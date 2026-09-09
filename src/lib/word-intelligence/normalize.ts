// WhatWord Word Intelligence — normalisation & validation (pure, dependency-free).
// Provenance: whatword-derived-v1.

export function normalizeWord(input: string): string {
  return (input || '')
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, ' ');
}

export function slugifyWord(input: string): string {
  return normalizeWord(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Canonical lookup key: lowercase a-z plus apostrophe/hyphen interiors. */
export function canonicalKey(input: string): string {
  return normalizeWord(input).replace(/[^a-z'-]/g, '');
}

const VALID_RE = /^[a-z](?:[a-z'-]*[a-z])?$/;

export interface ValidationResult {
  ok: boolean;
  reason?: string;
  canonical?: string;
}

export function validateWord(input: string): ValidationResult {
  const canonical = canonicalKey(input);
  if (!canonical) return { ok: false, reason: 'empty' };
  if (canonical.length < 1 || canonical.length > 45) return { ok: false, reason: 'bad-length' };
  if (!VALID_RE.test(canonical)) return { ok: false, reason: 'bad-characters' };
  if (/--|''|-'|'-/.test(canonical)) return { ok: false, reason: 'bad-punctuation' };
  return { ok: true, canonical };
}
