// WhatWord Word Intelligence — derived relationship engine (pure).
// All relations computed deterministically from spellings (whatword-derived-v1).
// Safe: anagrams, mutations, affixes, within-words need no external facts.

import { letterProps, isOneLetterNeighbour, canBuildFrom } from './letter-props';

export interface CorpusWord {
  word: string; // lowercase canonical
  pos?: string;
  frequencyBand?: 'very-common' | 'common' | 'uncommon' | 'rare';
  isCommon?: boolean;
}

export function buildSignatureIndex(words: CorpusWord[]): Map<string, string[]> {
  const index = new Map<string, string[]>();
  for (const w of words) {
    const sig = letterProps(w.word).alphabeticalSignature;
    const bucket = index.get(sig);
    if (bucket) bucket.push(w.word);
    else index.set(sig, [w.word]);
  }
  return index;
}

/** All corpus words sharing the exact letter multiset (excluding the word itself). */
export function getAnagrams(word: string, index: Map<string, string[]>): string[] {
  const sig = letterProps(word).alphabeticalSignature;
  return (index.get(sig) || []).filter((w) => w !== word.toLowerCase());
}

/** Equal-length words differing by exactly one letter. */
export function getOneLetterNeighbours(word: string, candidates: CorpusWord[]): string[] {
  const w = word.toLowerCase();
  return candidates
    .map((c) => c.word)
    .filter((c) => c.length === w.length && isOneLetterNeighbour(w, c));
}

/** Words formed by adding exactly one letter (multiset superset, length + 1). */
export function getLetterAdditions(word: string, index: Map<string, string[]>, words: CorpusWord[]): string[] {
  const w = word.toLowerCase();
  const out = new Set<string>();
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(97 + i);
    const sig = letterProps(w + ch).alphabeticalSignature;
    for (const cand of index.get(sig) || []) {
      if (cand !== w) out.add(cand);
    }
  }
  return [...out].filter((c) => words.some((x) => x.word === c));
}

/** Words formed by removing exactly one letter (sub-words, length - 1). */
export function getLetterRemovals(word: string, wordSet: Set<string>): string[] {
  const w = word.toLowerCase();
  const out = new Set<string>();
  for (let i = 0; i < w.length; i++) {
    const sub = w.slice(0, i) + w.slice(i + 1);
    if (sub.length >= 2 && wordSet.has(sub)) out.add(sub);
  }
  return [...out];
}

/** Proper sub-words (length >= 2) buildable from the word's letters. */
export function getWordsWithin(word: string, wordSet: Set<string>, maxResults = 40): string[] {
  const w = word.toLowerCase();
  const out: string[] = [];
  for (const cand of wordSet) {
    if (cand.length >= 2 && cand.length < w.length && canBuildFrom(cand, w)) out.push(cand);
    if (out.length >= maxResults) break;
  }
  return out.sort((a, b) => b.length - a.length || a.localeCompare(b));
}

export function getWordsWithPrefix(prefix: string, words: CorpusWord[], limit = 100): string[] {
  const p = prefix.toLowerCase();
  return words.map((c) => c.word).filter((w) => w.startsWith(p)).slice(0, limit);
}

export function getWordsWithSuffix(suffix: string, words: CorpusWord[], limit = 100): string[] {
  const s = suffix.toLowerCase();
  return words.map((c) => c.word).filter((w) => w.endsWith(s)).slice(0, limit);
}
