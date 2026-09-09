// WhatWord Word Intelligence — unified service layer (server-side).
// UI and API routes consume THIS instead of duplicating logic.
// Strategy: local corpus (instant, offline-safe) ∪ Supabase enrichment
// (verified definitions). Local never claims definitions; Supabase/API
// rows carry their own source attribution.

import { getLocalCorpus, type EnrichedCorpusWord } from './corpus';
import { canonicalKey, validateWord } from './normalize';
import {
  letterProps,
  gameInfo,
  canBuildFrom,
  matchPattern,
  scrabbleScore,
  type LetterProps,
  type GameInfo,
} from './letter-props';
import {
  getAnagrams as relAnagrams,
  getOneLetterNeighbours as relNeighbours,
  getLetterAdditions,
  getLetterRemovals,
  getWordsWithin,
  getWordsWithPrefix,
  getWordsWithSuffix,
} from './relationships';
import { getRegionalEntry } from './regional';
import { getAllWords as getSupabaseWords, type WordEntry } from '@/lib/words';

export interface WordIntelligenceResult {
  word: string;
  exists: boolean;
  inLocalCorpus: boolean;
  letter: LetterProps;
  game: GameInfo;
  anagrams: string[];
  neighbours: string[];
  additions: string[];
  removals: string[];
  withinWords: string[];
  startsWithFamily: string[];
  endsWithFamily: string[];
  enrichment: WordEntry | null;
  regional: ReturnType<typeof getRegionalEntry> | null;
  verification: 'exists' | 'definition-verified' | 'definition-pending' | 'unknown';
}

export async function getWordIntelligence(raw: string): Promise<WordIntelligenceResult> {
  const word = canonicalKey(raw);
  const { words, wordSet, signatureIndex, byWord } = getLocalCorpus();
  const local = byWord.get(word);
  const letter = letterProps(word);
  const game = gameInfo(word, local?.isCommon ?? wordSet.has(word));

  let enrichment: WordEntry | null = null;
  try {
    const { getWord } = await import('@/lib/words');
    enrichment = await getWord(word);
  } catch {
    enrichment = null;
  }
  const hasDefinition = !!enrichment?.definitions?.simple;

  return {
    word,
    exists: !!local || wordSet.has(word) || hasDefinition,
    inLocalCorpus: !!local,
    letter,
    game,
    anagrams: relAnagrams(word, signatureIndex),
    neighbours: relNeighbours(word, words).slice(0, 24),
    additions: getLetterAdditions(word, signatureIndex, words).slice(0, 24),
    removals: getLetterRemovals(word, wordSet),
    withinWords: getWordsWithin(word, wordSet),
    startsWithFamily: getWordsWithPrefix(word.slice(0, 2), words, 12).filter((w) => w !== word),
    endsWithFamily: getWordsWithSuffix(word.slice(-2), words, 12).filter((w) => w !== word),
    enrichment,
    regional: getRegionalEntry(word) || null,
    verification: hasDefinition ? 'definition-verified' : wordSet.has(word) ? 'definition-pending' : 'unknown',
  };
}

export interface FinderQuery {
  length?: number;
  minLength?: number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  notContains?: string;
  knownLetters?: string;
  pattern?: string;
  letters?: string; // unscrambler: build from these letters
  limit?: number;
}

export interface FinderHit {
  word: string;
  length: number;
  pos?: string;
  scrabbleScore: number;
  hasDefinition: boolean;
}

function supabaseToCorpus(entries: WordEntry[]): EnrichedCorpusWord[] {
  const seen = new Set<string>();
  const out: EnrichedCorpusWord[] = [];
  for (const e of entries) {
    const canonical = canonicalKey(e.slug || e.word);
    const v = validateWord(canonical);
    if (!v.ok || !v.canonical || seen.has(v.canonical)) continue;
    seen.add(v.canonical);
    out.push({
      word: v.canonical,
      pos: e.partOfSpeech,
      frequencyBand: 'common',
      isCommon: true,
      canonical: v.canonical,
      length: v.canonical.length,
      signature: letterProps(v.canonical).alphabeticalSignature,
      fieldSources: {
        spelling: 'whatword-seed-v1',
        definition: 'freedictionaryapi',
        letterProps: 'whatword-derived-v1',
        anagrams: 'whatword-derived-v1',
        gameScore: 'whatword-derived-v1',
      },
    });
  }
  return out;
}

/** Combined searchable universe: local corpus ∪ Supabase cached words (deduped). */
export async function getSearchUniverse(): Promise<EnrichedCorpusWord[]> {
  const { words } = getLocalCorpus();
  try {
    const supabaseWords = await getSupabaseWords();
    if (!supabaseWords.length) return words;
    const localSet = new Set(words.map((w) => w.word));
    const extra = supabaseToCorpus(supabaseWords).filter((w) => !localSet.has(w.word));
    return [...words, ...extra].sort((a, b) => a.word.localeCompare(b.word));
  } catch {
    return words;
  }
}

export async function finderQuery(q: FinderQuery): Promise<{ hits: FinderHit[]; total: number }> {
  const universe = await getSearchUniverse();
  let defSet = new Set<string>();
  try {
    const { getAllSlugs } = await import('@/lib/words');
    defSet = new Set(await getAllSlugs());
  } catch {
    defSet = new Set();
  }

  const startsWith = q.startsWith?.toLowerCase();
  const endsWith = q.endsWith?.toLowerCase();
  const contains = q.contains?.toLowerCase();
  const notContains = q.notContains?.toLowerCase().replace(/[^a-z]/g, '');
  const letters = q.letters?.toLowerCase().replace(/[^a-z]/g, '');

  const hits: FinderHit[] = [];
  for (const w of universe) {
    if (q.length !== undefined && w.length !== q.length) continue;
    if (q.minLength !== undefined && w.length < q.minLength) continue;
    if (startsWith && !w.word.startsWith(startsWith)) continue;
    if (endsWith && !w.word.endsWith(endsWith)) continue;
    if (contains && !w.word.includes(contains)) continue;
    if (notContains && [...notContains].some((ch) => w.word.includes(ch))) continue;
    if (q.knownLetters && !matchPattern(w.word, q.knownLetters)) continue;
    if (q.pattern) {
      try {
        if (!new RegExp(q.pattern, 'i').test(w.word)) continue;
      } catch {
        continue;
      }
    }
    if (letters && !canBuildFrom(w.word, letters)) continue;
    hits.push({
      word: w.word,
      length: w.length,
      pos: w.pos,
      scrabbleScore: scrabbleScore(w.word),
      hasDefinition: defSet.has(w.word),
    });
  }
  const total = hits.length;
  // Defined words first, then alphabetical — usefulness over raw count.
  hits.sort((a, b) => Number(b.hasDefinition) - Number(a.hasDefinition) || a.word.localeCompare(b.word));
  return { hits: hits.slice(0, q.limit ?? 100), total };
}

/** Anagram solver over the full universe (not just same-length cache rows). */
export async function solverAnagrams(letters: string, limit = 50): Promise<FinderHit[]> {
  const clean = letters.toLowerCase().replace(/[^a-z]/g, '');
  if (clean.length < 2 || clean.length > 15) return [];
  const { signatureIndex } = getLocalCorpus();
  const universe = await getSearchUniverse();
  const uSet = new Set(universe.map((w) => w.word));
  const sig = letterProps(clean).alphabeticalSignature;
  // Combine: exact-signature matches from local index + any universe word matching.
  const matches = new Set<string>();
  for (const w of signatureIndex.get(sig) || []) if (w !== clean && uSet.has(w)) matches.add(w);
  let defSet = new Set<string>();
  try {
    const { getAllSlugs } = await import('@/lib/words');
    defSet = new Set(await getAllSlugs());
  } catch {
    defSet = new Set();
  }
  return [...matches]
    .map((word) => ({
      word,
      length: word.length,
      pos: universe.find((u) => u.word === word)?.pos,
      scrabbleScore: scrabbleScore(word),
      hasDefinition: defSet.has(word),
    }))
    .sort((a, b) => b.scrabbleScore - a.scrabbleScore || a.word.localeCompare(b.word))
    .slice(0, limit);
}

export async function wordsFromLetters(letters: string, minLength = 2, limit = 100): Promise<FinderHit[]> {
  const { hits, total } = await finderQuery({ letters, limit: 1000 });
  const filtered = hits.filter((h) => h.length >= minLength);
  filtered.sort((a, b) => b.length - a.length || b.scrabbleScore - a.scrabbleScore);
  return filtered.slice(0, limit);
}

export type { LetterProps, GameInfo };
export type LocalCorpusWord = EnrichedCorpusWord;
