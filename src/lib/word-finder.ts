import { getAllWords, type WordEntry } from './words';

export interface WordPattern {
  length?: number;
  startsWith?: string;
  endsWith?: string;
  contains?: string;
  notContains?: string;
  knownLetters?: string; // e.g. "a_p_e" where _ = unknown
  pattern?: string; // regex-like pattern
}

export interface WordFinderResult {
  word: string;
  slug: string;
  definition: string;
  partOfSpeech: string;
  difficulty: string;
  length: number;
}

function toResult(entry: WordEntry): WordFinderResult {
  return {
    word: entry.word.toLowerCase(),
    slug: entry.slug,
    definition: entry.definitions.simple,
    partOfSpeech: entry.partOfSpeech,
    difficulty: entry.difficulty,
    length: entry.word.length,
  };
}

function toResults(entries: WordEntry[]): WordFinderResult[] {
  return entries.map(toResult);
}

export function matchPattern(word: string, pattern: string): boolean {
  if (word.length !== pattern.length) return false;
  const lowerWord = word.toLowerCase();
  const lowerPattern = pattern.toLowerCase();
  for (let i = 0; i < lowerPattern.length; i++) {
    const p = lowerPattern[i];
    if (p !== '_' && p !== '?' && p !== lowerWord[i]) return false;
  }
  return true;
}

export function findWords(pattern: WordPattern): WordFinderResult[] {
  const allWords = getAllWords();

  return toResults(
    allWords.filter((entry) => {
      const word = entry.word.toLowerCase();

      if (pattern.length !== undefined && word.length !== pattern.length) return false;

      if (pattern.startsWith !== undefined) {
        const prefix = pattern.startsWith.toLowerCase();
        if (!word.startsWith(prefix)) return false;
      }

      if (pattern.endsWith !== undefined) {
        const suffix = pattern.endsWith.toLowerCase();
        if (!word.endsWith(suffix)) return false;
      }

      if (pattern.contains !== undefined) {
        const search = pattern.contains.toLowerCase();
        if (!word.includes(search)) return false;
      }

      if (pattern.notContains !== undefined) {
        const excluded = pattern.notContains.toLowerCase();
        for (const ch of excluded) {
          if (word.includes(ch)) return false;
        }
      }

      if (pattern.knownLetters !== undefined) {
        if (!matchPattern(word, pattern.knownLetters)) return false;
      }

      if (pattern.pattern !== undefined) {
        try {
          const regex = new RegExp(pattern.pattern, 'i');
          if (!regex.test(word)) return false;
        } catch {
          return false;
        }
      }

      return true;
    })
  );
}

export function getWordsByLength(length: number): WordFinderResult[] {
  return findWords({ length });
}

export function getWordsStartingWith(letters: string): WordFinderResult[] {
  return findWords({ startsWith: letters });
}

export function getWordsEndingWith(letters: string): WordFinderResult[] {
  return findWords({ endsWith: letters });
}

export function getWordsContaining(letters: string): WordFinderResult[] {
  return findWords({ contains: letters });
}

export function getWordsNotContaining(letters: string): WordFinderResult[] {
  return findWords({ notContains: letters });
}

export function getAnagrams(word: string): WordFinderResult[] {
  const sorted = word.toLowerCase().split('').sort().join('');
  const allWords = getAllWords();

  return toResults(
    allWords.filter((entry) => {
      if (entry.word.toLowerCase() === word.toLowerCase()) return false;
      if (entry.word.length !== word.length) return false;
      const entrySorted = entry.word.toLowerCase().split('').sort().join('');
      return entrySorted === sorted;
    })
  );
}

export const WORD_LENGTHS: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export interface PopularSearch {
  label: string;
  pattern: WordPattern;
}

export const POPULAR_SEARCHES: PopularSearch[] = [
  {
    label: '5 letter words',
    pattern: { length: 5 },
  },
  {
    label: '6 letter words',
    pattern: { length: 6 },
  },
  {
    label: '7 letter words',
    pattern: { length: 7 },
  },
  {
    label: '8 letter words',
    pattern: { length: 8 },
  },
  {
    label: 'Words starting with S',
    pattern: { startsWith: 'S' },
  },
  {
    label: 'Words starting with P',
    pattern: { startsWith: 'P' },
  },
  {
    label: 'Words starting with E',
    pattern: { startsWith: 'E' },
  },
  {
    label: 'Words ending with -tion',
    pattern: { endsWith: 'tion' },
  },
  {
    label: 'Words ending with -ly',
    pattern: { endsWith: 'ly' },
  },
  {
    label: 'Words ending with -ing',
    pattern: { endsWith: 'ing' },
  },
  {
    label: 'Words containing "act"',
    pattern: { contains: 'act' },
  },
  {
    label: 'Words containing "ment"',
    pattern: { contains: 'ment' },
  },
  {
    label: 'Words containing "graph"',
    pattern: { contains: 'graph' },
  },
  {
    label: 'Short words (2-3 letters)',
    pattern: { pattern: '^.{2,3}$' },
  },
  {
    label: 'Long words (10+ letters)',
    pattern: { pattern: '^.{10,}$' },
  },
  {
    label: 'Words with double letters',
    pattern: { pattern: '(.)\\1' },
  },
];

export function getPopularSearches(): PopularSearch[] {
  return POPULAR_SEARCHES;
}
