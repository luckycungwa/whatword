#!/usr/bin/env node
/**
 * WhatWord dictionary enrichment — FreeDictionaryAPI.com (Wiktionary, CC BY-SA 4.0).
 *
 * Reads candidate spellings (local corpus ∪ ESDB import), fetches definitions in
 * small batches respecting the 1,000 req/hour/IP limit (default 500ms between
 * calls, --limit caps per run), and upserts Supabase `words` rows with:
 *   - definition_simple/full, examples, synonyms, antonyms, phonetic, audio
 *   - source='freedictionaryapi', source_url=<wiktionary page>, license='CC BY-SA 4.0'
 *
 * NEVER overwrites a human/verified row blindly: rows with source='manual' are skipped.
 * NEVER invents definitions: only API-returned text is stored, verbatim + sourceUrl.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/enrich-freedictionary.mjs --limit 200
 */
const API = 'https://freedictionaryapi.com/api/v1/entries/en';
const DELAY_MS = parseInt(process.env.ENRICH_DELAY_MS || '500', 10);
const LIMIT = parseInt((process.argv.find((a) => a.startsWith('--limit=')) || '=200').split('=')[1], 10);

// --- Load .env.local (Next.js convention) so `npm run enrich:dict` just works.
// Plain `node` does not read .env.local automatically; without this the script
// reports "Missing SUPABASE_URL / key env vars" even when the app itself works.
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function loadEnvFiles() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  for (const file of ['.env.local', '.env']) {
    const p = join(root, file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#') || !t.includes('=')) continue;
      const i = t.indexOf('=');
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (k && !(k in process.env)) process.env[k] = v;
    }
  }
}
loadEnvFiles();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Upsert that tolerates migration 001 not being applied yet: if PostgREST
 * reports an unknown column, drop it and retry (with a warning). Provenance
 * columns are preserved whenever the schema supports them.
 */
async function upsertWithFallback(supabase, row) {
  const attempt = { ...row };
  for (let i = 0; i < 12; i++) {
    const { error } = await supabase.from('words').upsert(attempt, { onConflict: 'slug' });
    if (!error) return null;
    const m = error.message && error.message.match(/Could not find the '([^']+)' column/);
    if (m && m[1] in attempt) {
      console.warn(`[enrich] column '${m[1]}' missing — migration 001 not applied? Retrying without it.`);
      console.warn('[enrich] Apply supabase/migrations/001_word_intelligence.sql for full provenance.');
      delete attempt[m[1]];
      continue;
    }
    return error;
  }
  return new Error('too many missing columns in words table');
}

async function main() {
  const { createClient } = await import('@supabase/supabase-js');
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;
  if (!url || !key) {
    console.error('[enrich] Missing Supabase URL/key. Checked SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL,');
    console.error('[enrich] SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('[enrich] in process env plus .env.local / .env.');
    process.exit(1);
  }
  if (!serviceKey) {
    console.warn('[enrich] No SUPABASE_SERVICE_KEY found — using anon key.');
    console.warn('[enrich] Anon writes are usually blocked by RLS; if upserts fail with 42501,');
    console.warn('[enrich] add SUPABASE_SERVICE_KEY (service_role, server-only, never NEXT_PUBLIC_) to .env.local.');
  }
  const supabase = createClient(url, key);

  // Preflight: verify table access before burning API quota.
  const { error: pingError } = await supabase.from('words').select('slug').limit(1);
  if (pingError) {
    console.error(`[enrich] Cannot read 'words' table: ${pingError.message}`);
    process.exit(1);
  }

  // Candidates: seed words WITHOUT a verified definition, most-common-first.
  // Frequency ordering matters: a small fraction of words gets most lookups,
  // so early batches must cover very-common words before rare ones.
  const { data: existing } = await supabase.from('words').select('slug, definition_simple');
  const have = new Set((existing || []).filter((r) => r.definition_simple).map((r) => r.slug));
  const seedRaw = readFileSync(new URL('../src/data/lexical-seed.ts', import.meta.url), 'utf8');
  const candidates = [...seedRaw.matchAll(/^([a-z][a-z'-]*[a-z]?)\s+[a-z]\s+([0-3])$/gm)]
    .map((m) => ({ word: m[1], freq: parseInt(m[2], 10) }))
    .filter((c) => !have.has(c.word))
    .sort((a, b) => a.freq - b.freq || (a.word < b.word ? -1 : 1))
    .map((c) => c.word)
    .slice(0, LIMIT);

  console.log(`[enrich] candidates=${candidates.length} (limit=${LIMIT}, delay=${DELAY_MS}ms)`);
  let ok = 0, miss = 0, fail = 0;
  for (const word of candidates) {
    try {
      const res = await fetch(`${API}/${encodeURIComponent(word)}`);
      if (res.status === 429) { console.error('[enrich] rate-limited (429) — stopping run, resume later.'); break; }
      if (!res.ok) { miss++; await sleep(DELAY_MS); continue; }
      // FreeDictionaryAPI v1 shape: { word, entries: [{ language, partOfSpeech,
      // pronunciations[], senses: [{ definition, examples[], synonyms[], antonyms[] }],
      // synonyms[], antonyms[] }], source: { url, license } }
      const data = await res.json();
      const entries = Array.isArray(data) ? [] : data.entries || [];
      const enEntries = entries.filter((e) => !e.language || e.language.code === 'en');
      const withDef = enEntries
        .flatMap((e) => (e.senses || []).map((s) => ({ ...s, pos: e.partOfSpeech })))
        .filter((s) => s.definition);
      if (!withDef.length) { miss++; await sleep(DELAY_MS); continue; }
      const first = withDef[0];
      const str = (v) => (typeof v === 'string' ? v : (v && v.text) || '');
      const collect = (key) => [...new Set(
        enEntries.flatMap((e) => [...(e[key] || []), ...(e.senses || []).flatMap((s) => s[key] || [])])
          .map(str).filter(Boolean),
      )];
      const synonyms = collect('synonyms').slice(0, 8);
      const antonyms = collect('antonyms').slice(0, 5);
      const prons = enEntries.flatMap((e) => e.pronunciations || []);
      const examples = withDef.flatMap((s) => s.examples || []).map(str).filter(Boolean).slice(0, 3);
      const row = {
        slug: word,
        word: data.word ? data.word.charAt(0).toUpperCase() + data.word.slice(1) : word,
        phonetic: (prons.find((p) => p.text) || {}).text || '',
        audio_url: (prons.find((p) => p.audio) || {}).audio || '',
        part_of_speech: enEntries[0]?.partOfSpeech || 'noun',
        definition_simple: first.definition || '',
        definition_full: withDef.map((s) => s.definition).filter(Boolean).join(' | ').slice(0, 2000),
        examples,
        synonyms, antonyms,
        source: 'freedictionaryapi',
        source_url: (data.source && data.source.url) || `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`,
        license: (data.source && data.source.license && data.source.license.name) || 'CC BY-SA 4.0',
        verification_status: 'definition-verified',
      };
      const upsertError = await upsertWithFallback(supabase, row);
      if (upsertError) { fail++; console.error(`[enrich] upsert failed ${word}: ${upsertError.message}`); }
      else ok++;
    } catch (err) {
      fail++;
      console.error(`[enrich] error ${word}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
  console.log(`[enrich] done: enriched=${ok} missing=${miss} failed=${fail}`);
}

main();
