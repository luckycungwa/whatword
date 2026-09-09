// WhatWord Word Intelligence — local corpus (Supabase + local fallback strategy).
// Parses LEXICAL_SEED_RAW into CorpusWords and prebuilds derived indexes.
// Every entry carries field-level provenance; nothing here claims a definition.

import { LEXICAL_SEED_RAW } from '@/data/lexical-seed';
import { canonicalKey } from './normalize';
import { letterProps } from './letter-props';
import { buildSignatureIndex } from './relationships';
import type { CorpusWord } from './relationships';
import type { FieldSources } from './sources';

export type { CorpusWord };

export interface EnrichedCorpusWord extends CorpusWord {
  canonical: string;
  length: number;
  signature: string;
  fieldSources: FieldSources;
}

const POS_MAP: Record<string, string> = {
  n: 'noun', v: 'verb', j: 'adjective', r: 'adverb',
  i: 'interjection', p: 'preposition', c: 'conjunction', o: 'pronoun', x: 'other',
};

const FREQ_MAP = ['very-common', 'common', 'uncommon', 'rare'] as const;

function parseSeed(): EnrichedCorpusWord[] {
  const seen = new Set<string>();
  const out: EnrichedCorpusWord[] = [];
  for (const line of LEXICAL_SEED_RAW.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const [rawWord, rawPos, rawFreq] = trimmed.split(/\s+/);
    const canonical = canonicalKey(rawWord);
    if (!canonical || seen.has(canonical)) continue;
    seen.add(canonical);
    const freqBand = FREQ_MAP[parseInt(rawFreq, 10)] || 'common';
    out.push({
      word: canonical,
      pos: POS_MAP[rawPos] || 'noun',
      frequencyBand: freqBand,
      isCommon: freqBand === 'very-common' || freqBand === 'common',
      canonical,
      length: canonical.replace(/[^a-z]/g, '').length,
      signature: letterProps(canonical).alphabeticalSignature,
      fieldSources: {
        spelling: 'whatword-seed-v1',
        frequency: 'whatword-seed-v1',
        pos: 'whatword-seed-v1',
        letterProps: 'whatword-derived-v1',
        anagrams: 'whatword-derived-v1',
        gameScore: 'whatword-derived-v1',
      },
    });
  }
  return out.sort((a, b) => a.word.localeCompare(b.word));
}

let cache: {
  words: EnrichedCorpusWord[];
  wordSet: Set<string>;
  signatureIndex: Map<string, string[]>;
  byWord: Map<string, EnrichedCorpusWord>;
} | null = null;

export function getLocalCorpus() {
  if (!cache) {
    const words = parseSeed();
    cache = {
      words,
      wordSet: new Set(words.map((w) => w.word)),
      signatureIndex: buildSignatureIndex(words),
      byWord: new Map(words.map((w) => [w.word, w])),
    };
  }
  return cache;
}

export function corpusStats() {
  const { words } = getLocalCorpus();
  const byLength: Record<number, number> = {};
  for (const w of words) byLength[w.length] = (byLength[w.length] || 0) + 1;
  return { totalWords: words.length, byLength };
}
