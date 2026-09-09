// WhatWord Smart Search — intent parser architecture (pure, grows over time).
// Understands: "5 letter words starting with S", "anagram of listen",
// "words containing q without u", "word meaning happy", patterns like _A_E_.
// Provenance: whatword-derived-v1.

export type SearchIntent =
  | { kind: 'word-lookup'; word: string }
  | { kind: 'anagram'; letters: string }
  | { kind: 'unscramble'; letters: string }
  | { kind: 'pattern'; pattern: string; length?: number }
  | {
      kind: 'finder';
      length?: number;
      startsWith?: string;
      endsWith?: string;
      contains?: string;
      notContains?: string;
    }
  | { kind: 'meaning'; query: string }
  | { kind: 'unknown'; query: string };

export function parseSmartQuery(raw: string): SearchIntent {
  const q = raw.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return { kind: 'unknown', query: raw };

  let m = q.match(/^(?:anagram(?:s)?(?: of| for)?|unscramble|unscrambles?)\s+([a-z?_\s]+)$/);
  if (m) {
    const letters = m[1].replace(/[^a-z]/g, '');
    if (letters.length >= 2) return { kind: 'anagram', letters };
  }

  m = q.match(/^(?:words? )?(?:made )?(?:from|with|using)(?: these)? letters?\s+([a-z\s]+)$/);
  if (m) {
    const letters = m[1].replace(/[^a-z]/g, '');
    if (letters.length >= 2) return { kind: 'unscramble', letters };
  }

  m = q.match(/^(?:word|words|term)?\s*meaning\s+(.+)$/);
  if (m) return { kind: 'meaning', query: m[1].trim() };

  // Pattern query: contains _ or ? placeholders, e.g. "_a_e_" or "6 letter word _a_e__"
  m = q.match(/([_?a-z][_?a-z\s]*[_?][_?a-z\s]*)/);
  if (m && /[_?]/.test(m[1])) {
    const pattern = m[1].replace(/\s+/g, '');
    if (/^[a-z_?]+$/.test(pattern) && pattern.length >= 2 && pattern.length <= 15) {
      const len = q.match(/(\d+)\s*letter/);
      return { kind: 'pattern', pattern, length: len ? parseInt(len[1]) : undefined };
    }
  }

  const finder: Extract<SearchIntent, { kind: 'finder' }> = { kind: 'finder' } as Extract<
    SearchIntent,
    { kind: 'finder' }
  >;
  let isFinder = false;

  m = q.match(/(\d+)\s*letter(?:\s*word)?s?/);
  if (m) {
    finder.length = parseInt(m[1]);
    isFinder = true;
  }
  m = q.match(/start(?:ing|s)? with\s+([a-z]+)/);
  if (m) {
    finder.startsWith = m[1];
    isFinder = true;
  }
  m = q.match(/end(?:ing|s)? (?:with|in)\s+([a-z]+)/);
  if (m) {
    finder.endsWith = m[1];
    isFinder = true;
  }
  m = q.match(/contain(?:ing|s)?\s+([a-z]+)/);
  if (m) {
    finder.contains = m[1];
    isFinder = true;
  }
  m = q.match(/without\s+(?:the letters?\s+)?([a-z\s,]+)/);
  if (m) {
    const letters = m[1].replace(/[^a-z]/g, '');
    if (letters) {
      finder.notContains = letters;
      isFinder = true;
    }
  }
  if (/\bwords?\b/.test(q) && isFinder) return finder;
  if (isFinder && (finder.length || finder.startsWith || finder.endsWith || finder.contains)) return finder;

  // Single token -> direct word lookup.
  if (/^[a-z'-]{1,45}$/.test(q)) return { kind: 'word-lookup', word: q };

  return { kind: 'unknown', query: raw };
}

/** Route an intent to its engine destination. */
export function intentRoute(intent: SearchIntent): string {
  switch (intent.kind) {
    case 'word-lookup':
      return `/words/${intent.word}`;
    case 'anagram':
      return `/anagram-solver?letters=${intent.letters}`;
    case 'unscramble':
      return `/word-unscrambler?letters=${intent.letters}`;
    case 'pattern':
    case 'finder':
      return '/word-finder';
    case 'meaning':
      return `/words?q=${encodeURIComponent(intent.query)}`;
    default:
      return '/words';
  }
}
