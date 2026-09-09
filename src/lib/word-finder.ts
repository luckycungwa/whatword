// Word Finder — compatibility layer over the Word Intelligence Engine.
// New code should import from '@/lib/word-intelligence' directly.
// This module preserves the existing public API (WordPattern, WordFinderResult,
// findWords, getAnagrams, POPULAR_SEARCHES) used by pages, components and API routes.

import { finderQuery, solverAnagrams, type FinderHit } from './word-intelligence/service';
import { matchPattern as engineMatchPattern } from './word-intelligence/letter-props';
import { canonicalKey } from './word-intelligence/normalize';
import { getWord, type WordEntry } from './words';

export interface WordPattern {
  length?: number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  notContains?: string;
  knownLetters?: string;
  pattern?: string;
}

export interface WordFinderResult {
  word: string;
  slug: string;
  definition: string;
  partOfSpeech: string;
  difficulty: string;
  length: number;
}

export const matchPattern = engineMatchPattern;

const definitionCache = new Map<string, WordEntry | null>();

async function toResult(hit: FinderHit): Promise<WordFinderResult> {
  let entry = definitionCache.get(hit.word);
  if (entry === undefined) {
    try {
      entry = await getWord(hit.word);
    } catch {
      entry = null;
    }
    definitionCache.set(hit.word, entry);
  }
  return {
    word: hit.word,
    slug: canonicalKey(hit.word),
    definition: entry?.definitions?.simple || '',
    partOfSpeech: entry?.partOfSpeech || hit.pos || 'noun',
    difficulty: entry?.difficulty || 'beginner',
    length: hit.length,
  };
}

export async function findWords(pattern: WordPattern): Promise<WordFinderResult[]> {
  const { hits } = await finderQuery({ ...pattern, limit: 100 });
  const results = await Promise.all(hits.map(toResult));
  // Defined words first — most useful for tool users.
  results.sort((a, b) => Number(Boolean(b.definition)) - Number(Boolean(a.definition)) || a.word.localeCompare(b.word));
  return results;
}

export async function getWordsByLength(length: number): Promise<WordFinderResult[]> {
  return findWords({ length });
}

export async function getWordsStartingWith(letters: string): Promise<WordFinderResult[]> {
  return findWords({ startsWith: letters });
}

export async function getWordsEndingWith(letters: string): Promise<WordFinderResult[]> {
  return findWords({ endsWith: letters });
}

export async function getWordsContaining(letters: string): Promise<WordFinderResult[]> {
  return findWords({ contains: letters });
}

export async function getWordsNotContaining(letters: string): Promise<WordFinderResult[]> {
  return findWords({ notContains: letters });
}

/** Anagram solver — full-corpus signature matching via the intelligence engine. */
export async function getAnagrams(word: string): Promise<WordFinderResult[]> {
  const hits = await solverAnagrams(word, 50);
  return Promise.all(hits.map(toResult));
}

export const WORD_LENGTHS: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export interface PopularSearch {
  label: string;
  pattern: WordPattern;
}

export const POPULAR_SEARCHES: PopularSearch[] = [
  { label: '5 letter words', pattern: { length: 5 } },
  { label: '6 letter words', pattern: { length: 6 } },
  { label: '7 letter words', pattern: { length: 7 } },
  { label: '8 letter words', pattern: { length: 8 } },
  { label: 'Words starting with S', pattern: { startsWith: 'S' } },
  { label: 'Words starting with P', pattern: { startsWith: 'P' } },
  { label: 'Words starting with E', pattern: { startsWith: 'E' } },
  { label: 'Words ending with -tion', pattern: { endsWith: 'tion' } },
  { label: 'Words ending with -ly', pattern: { endsWith: 'ly' } },
  { label: 'Words ending with -ing', pattern: { endsWith: 'ing' } },
  { label: 'Words containing "act"', pattern: { contains: 'act' } },
  { label: 'Words containing "ment"', pattern: { contains: 'ment' } },
  { label: 'Words with double letters', pattern: { pattern: '(.)\\1' } },
];

export function getPopularSearches(): PopularSearch[] {
  return POPULAR_SEARCHES;
}
