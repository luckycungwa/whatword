// WhatWord Word Intelligence — deterministic letter properties + game layer (pure).
// Provenance: whatword-derived-v1 (computed from spelling; no third-party obligations).

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export const SCRABBLE_VALUES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5,
  l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1,
  v: 4, w: 4, x: 8, y: 4, z: 10,
};

export interface LetterProps {
  word: string;
  length: number;
  firstLetter: string;
  lastLetter: string;
  /** Sorted letters, e.g. apple -> 'aelpp'. Basis of anagram indexing. */
  alphabeticalSignature: string;
  /** Letter -> count, e.g. apple -> {a:1,p:2,l:1,e:1}. */
  letterFrequency: Record<string, number>;
  uniqueLetterCount: number;
  repeatedLetters: string[];
  vowelCount: number;
  consonantCount: number;
  hasRepeatedLetters: boolean;
  isVowelHeavy: boolean;
}

export function letterProps(raw: string): LetterProps {
  const word = raw.toLowerCase().replace(/[^a-z]/g, '');
  const letters = word.split('');
  const letterFrequency: Record<string, number> = {};
  for (const ch of letters) letterFrequency[ch] = (letterFrequency[ch] || 0) + 1;
  const repeatedLetters = Object.entries(letterFrequency)
    .filter(([, n]) => n > 1)
    .map(([ch]) => ch)
    .sort();
  const vowelCount = letters.filter((ch) => VOWELS.has(ch)).length;
  return {
    word,
    length: word.length,
    firstLetter: word[0] || '',
    lastLetter: word[word.length - 1] || '',
    alphabeticalSignature: [...letters].sort().join(''),
    letterFrequency,
    uniqueLetterCount: Object.keys(letterFrequency).length,
    repeatedLetters,
    vowelCount,
    consonantCount: word.length - vowelCount,
    hasRepeatedLetters: repeatedLetters.length > 0,
    isVowelHeavy: word.length > 0 && vowelCount / word.length >= 0.5,
  };
}

export function scrabbleScore(raw: string): number {
  let total = 0;
  for (const ch of raw.toLowerCase()) total += SCRABBLE_VALUES[ch] || 0;
  return total;
}

export interface GameInfo {
  scrabbleScore: number;
  /** Heuristic game-validity: common alphabetic words of length 2-15. Never asserts official tournament validity. */
  gameCandidate: boolean;
  wordleCandidate: boolean;
  length: number;
}

/**
 * Separate game-validity layer: dictionary word ≠ valid game word.
 * This heuristic marks candidates; official Scrabble/WWF validity requires a
 * licensed tournament word list (deferred, see deliverables).
 */
export function gameInfo(raw: string, isCommon: boolean): GameInfo {
  const clean = raw.toLowerCase().replace(/[^a-z]/g, '');
  const gameCandidate = isCommon && clean.length >= 2 && clean.length <= 15;
  return {
    scrabbleScore: scrabbleScore(clean),
    gameCandidate,
    wordleCandidate: gameCandidate && clean.length === 5,
    length: clean.length,
  };
}

/** True if `word` can be built from `letters` (multiset containment) — unscrambler core. */
export function canBuildFrom(word: string, letters: string): boolean {
  const need: Record<string, number> = {};
  for (const ch of word.toLowerCase()) {
    if (ch < 'a' || ch > 'z') return false;
    need[ch] = (need[ch] || 0) + 1;
  }
  const have: Record<string, number> = {};
  for (const ch of letters.toLowerCase()) {
    if (ch < 'a' || ch > 'z') continue;
    have[ch] = (have[ch] || 0) + 1;
  }
  return Object.entries(need).every(([ch, n]) => (have[ch] || 0) >= n);
}

/** `_` or `?` = wildcard, e.g. '_a__e' matches 'apple' shape. */
export function matchPattern(word: string, pattern: string): boolean {
  if (word.length !== pattern.length) return false;
  const w = word.toLowerCase();
  const p = pattern.toLowerCase();
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c !== '_' && c !== '?' && c !== w[i]) return false;
  }
  return true;
}

/** Hamming distance of 1 with equal length — one-letter mutation core. */
export function isOneLetterNeighbour(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i] && ++diff > 1) return false;
  }
  return diff === 1;
}
