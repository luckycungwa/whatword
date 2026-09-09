// WhatWord Word Intelligence — source registry & field-level provenance (pure).
// See WORD-SOURCES.md for license verification. Provenance: whatword-derived-v1.

export type SourceId =
  | 'esdb'
  | 'freedictionaryapi'
  | 'dictionaryapi.dev'
  | 'whatword-derived-v1'
  | 'whatword-editorial'
  | 'whatword-seed-v1';

export interface SourceRecord {
  id: SourceId;
  name: string;
  url: string;
  license: string;
  licenseUrl: string;
  attributionRequired: boolean;
  attributionText: string;
  shareAlike: boolean;
  retrievedAt: string;
  version: string;
  commercialUsePermitted: boolean;
  termsVerified: boolean;
}

export const SOURCE_REGISTRY: Record<SourceId, SourceRecord> = {
  esdb: {
    id: 'esdb',
    name: 'English Speller Database (ESDB), formerly SCOWLv2',
    url: 'https://github.com/en-wl/wordlist',
    license: 'MIT-like permissive (Copyright 2000-2026 by Kevin Atkinson; notice required)',
    licenseUrl: 'https://github.com/en-wl/wordlist/blob/v2/Copyright',
    attributionRequired: true,
    attributionText: 'Lexical data: English Speller Database (ESDB), Copyright 2000-2026 by Kevin Atkinson.',
    shareAlike: false,
    retrievedAt: '2026-09-09',
    version: 'v2 rolling branch (size 60, American spellings, variant-level 1)',
    commercialUsePermitted: true,
    termsVerified: true,
  },
  freedictionaryapi: {
    id: 'freedictionaryapi',
    name: 'FreeDictionaryAPI.com (Wiktionary data)',
    url: 'https://freedictionaryapi.com',
    license: 'CC BY-SA 4.0 (Wiktionary dual CC BY-SA 4.0 + GFDL)',
    licenseUrl: 'https://en.wiktionary.org/wiki/Wiktionary:Copyrights',
    attributionRequired: true,
    attributionText: 'Definitions via FreeDictionaryAPI.com, sourced from Wiktionary (CC BY-SA 4.0).',
    shareAlike: true,
    retrievedAt: '2026-09-09',
    version: 'v1 API',
    commercialUsePermitted: true,
    termsVerified: true,
  },
  'dictionaryapi.dev': {
    id: 'dictionaryapi.dev',
    name: 'dictionaryapi.dev (legacy cache rows only)',
    url: 'https://dictionaryapi.dev',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://dictionaryapi.dev',
    attributionRequired: true,
    attributionText: 'Definitions via dictionaryapi.dev (CC BY-SA 3.0).',
    shareAlike: true,
    retrievedAt: '2026-09-09',
    version: 'legacy',
    commercialUsePermitted: true,
    termsVerified: true,
  },
  'whatword-derived-v1': {
    id: 'whatword-derived-v1',
    name: 'WhatWord Word Intelligence Engine (computed)',
    url: 'https://whatword.co.za',
    license: 'WhatWord proprietary computation',
    licenseUrl: 'https://whatword.co.za/terms',
    attributionRequired: false,
    attributionText: '',
    shareAlike: false,
    retrievedAt: '2026-09-09',
    version: 'v1',
    commercialUsePermitted: true,
    termsVerified: true,
  },
  'whatword-editorial': {
    id: 'whatword-editorial',
    name: 'WhatWord Editorial / Mzansi Word Bank',
    url: 'https://whatword.co.za',
    license: 'WhatWord editorial (citation required per entry)',
    licenseUrl: 'https://whatword.co.za/terms',
    attributionRequired: false,
    attributionText: '',
    shareAlike: false,
    retrievedAt: '2026-09-09',
    version: 'v1',
    commercialUsePermitted: true,
    termsVerified: true,
  },
  'whatword-seed-v1': {
    id: 'whatword-seed-v1',
    name: 'WhatWord lexical seed v1 (ESDB-methodology common vocabulary)',
    url: 'https://whatword.co.za',
    license: 'Spelling facts + ESDB-compatible methodology; see WORD-SOURCES.md',
    licenseUrl: 'https://github.com/en-wl/wordlist/blob/v2/Copyright',
    attributionRequired: true,
    attributionText: 'Lexical data: English Speller Database (ESDB), Copyright 2000-2026 by Kevin Atkinson.',
    shareAlike: false,
    retrievedAt: '2026-09-09',
    version: 'v1',
    commercialUsePermitted: true,
    termsVerified: true,
  },
};

/** Independent verification states — WORD_EXISTS ≠ DEFINITION_VERIFIED ≠ GAME_VALID. */
export type VerificationStatus =
  | 'exists' // WORD_EXISTS: spelling confirmed by lexical source
  | 'definition-verified' // DEFINITION_VERIFIED: dictionary enrichment attached
  | 'definition-pending' // exists, awaiting enrichment
  | 'quarantined'; // licensing/quality issue — excluded from public pages

export type IntelligenceField =
  | 'spelling'
  | 'frequency'
  | 'dialect'
  | 'pos'
  | 'definition'
  | 'pronunciation'
  | 'examples'
  | 'synonyms'
  | 'antonyms'
  | 'wordForms'
  | 'letterProps'
  | 'anagrams'
  | 'gameScore'
  | 'regional';

/** Which source supplied each important field. Never collapse into one anonymous record. */
export type FieldSources = Partial<Record<IntelligenceField, SourceId>>;

export function shareAlikeSources(fields: FieldSources): SourceId[] {
  const out: SourceId[] = [];
  for (const sid of Object.values(fields)) {
    if (sid && SOURCE_REGISTRY[sid]?.shareAlike && !out.includes(sid)) out.push(sid);
  }
  return out;
}
