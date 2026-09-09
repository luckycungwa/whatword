// WhatWord Word Intelligence — South African English / Mzansi Word Bank architecture.
// Design rule: locale-aware extension that NEVER contaminates the standard English
// corpus. A word is only tagged en-ZA by editorial action with a cited source.
// Provenance: whatword-editorial (citation required per entry).

export type RegionalTag = 'south-africa' | null;

export interface RegionalEntry {
  word: string; // canonical lowercase
  locale: 'en-ZA';
  regionalTag: RegionalTag;
  /** SA usage note (editorial, original writing — not copied). */
  usageNote: string;
  /** Required: dictionary, style guide, or publication citation. */
  sourceCitation: string;
  reviewedBy: string;
  reviewedAt: string;
  /** Standard-English cognate/equivalent where one exists. */
  standardEquivalent?: string;
}

/**
 * Starter set — each entry reviewed with a citable source class.
 * Full bank grows only through editorial review, never bulk import.
 */
export const MZANSI_SEED: RegionalEntry[] = [
  {
    word: 'lekker',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Afrikaans loanword used across SA English to mean nice, pleasant, tasty or good — "a lekker day", "lekker food".',
    sourceCitation: 'Documented in major SA English dictionaries (e.g. Dictionary of South African English); Afrikaans origin "lekker".',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'nice / great',
  },
  {
    word: 'howzit',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Greeting contracting "how is it going" — "Howzit, bru!" Equivalent to "hey, how are you?"',
    sourceCitation: 'Documented in SA English usage guides and dictionaries of SA slang.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'hello / how are you',
  },
  {
    word: 'braai',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Barbecue grill gathering and the grill itself — a central SA social institution. Verb and noun.',
    sourceCitation: 'Dictionary of South African English; Afrikaans origin "braai" (roast).',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'barbecue',
  },
  {
    word: 'ubuntu',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Nguni philosophy of shared humanity — "I am because we are". Used in law, business and everyday speech.',
    sourceCitation: 'Widely documented (isiZulu/isiXhosa origin); cited in SA jurisprudence and literature.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
  },
  {
    word: 'eish',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Interjection expressing surprise, dismay or resignation — "Eish, the taxi left already."',
    sourceCitation: 'Documented in SA English slang dictionaries; widespread media usage.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'oh no / wow',
  },
  {
    word: 'yebo',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'isiZulu-derived "yes" used across SA English conversation — "Yebo, I agree."',
    sourceCitation: 'isiZulu origin; documented in SA English usage references.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'yes',
  },
  {
    word: 'shame',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Term of endearment/sympathy unique to SA English — "Shame, the poor thing is tired." Not an insult.',
    sourceCitation: 'Noted in SA English usage literature as a distinctive local pragmatic use.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
  },
  {
    word: 'robot',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'In SA English also means a traffic light — "Turn left at the robot." Standard meaning (machine) coexists.',
    sourceCitation: 'Dictionary of South African English; standard SA road-usage term.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'traffic light',
  },
  {
    word: 'bakkie',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Pickup truck / utility vehicle. Afrikaans diminutive of "bak" (container).',
    sourceCitation: 'Dictionary of South African English.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'pickup truck',
  },
  {
    word: 'veld',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Open grassland or countryside. Standard term in SA geography and everyday speech.',
    sourceCitation: 'Standard dictionaries with SA usage note; Afrikaans/Dutch origin.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'grassland / field',
  },
  {
    word: 'laduma',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Celebratory shout for a goal, from football commentary — "Laduma! Bafana score!"',
    sourceCitation: 'SA football-broadcast usage; documented in SA media/slang references.',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'goal!',
  },
  {
    word: 'sharp',
    locale: 'en-ZA',
    regionalTag: 'south-africa',
    usageNote: 'Township-derived greeting/farewell meaning good, OK, agreed — "Sharp, see you later."',
    sourceCitation: 'Documented in SA slang references (township lingo / tsotsitaal influence).',
    reviewedBy: 'whatword-editorial',
    reviewedAt: '2026-09-09',
    standardEquivalent: 'good / OK / bye',
  },
];

export function getRegionalEntry(word: string): RegionalEntry | undefined {
  return MZANSI_SEED.find((e) => e.word === word.toLowerCase());
}
