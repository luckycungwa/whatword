-- WhatWord Word Intelligence — Supabase migration 001
-- Apply in Supabase Dashboard > SQL Editor (or supabase CLI).
-- Adds field-level provenance, verification states, letter/game columns + indexes.
-- WORD_EXISTS / DEFINITION_VERIFIED / GAME_VALID stay independent columns.

-- 1. Provenance & verification columns
alter table public.words
  add column if not exists source text not null default 'dictionaryapi.dev',
  add column if not exists source_url text,
  add column if not exists license text,
  add column if not exists field_sources jsonb not null default '{}'::jsonb,
  add column if not exists verification_status text not null default 'definition-pending'
    check (verification_status in ('exists','definition-pending','definition-verified','quarantined')),
  add column if not exists normalized_word text,
  add column if not exists length int,
  add column if not exists first_letter char(1),
  add column if not exists last_letter char(1),
  add column if not exists alphabetical_signature text,
  add column if not exists scrabble_score int,
  add column if not exists game_valid boolean not null default false,
  add column if not exists language text not null default 'en',
  add column if not exists locale text not null default 'en-ZA',
  add column if not exists regional_tag text,
  add column if not exists is_proper_noun boolean not null default false,
  add column if not exists is_abbreviation boolean not null default false;

-- 2. Backfill deterministic columns from existing spellings
update public.words
set normalized_word = lower(regexp_replace(slug, '[^a-z0-9]+', '', 'g')),
    length = char_length(regexp_replace(slug, '[^a-z]', '', 'g')),
    first_letter = substring(lower(regexp_replace(slug, '[^a-z]', '', 'g')) from 1 for 1),
    last_letter = substring(lower(regexp_replace(slug, '[^a-z]', '', 'g')) from char_length(regexp_replace(slug, '[^a-z]', '', 'g')) for 1)
where normalized_word is null;

update public.words
set verification_status = case
  when definition_simple is not null and definition_simple <> '' then 'definition-verified'
  else 'definition-pending' end
where verification_status = 'definition-pending';

-- 3. Indexes for the most common queries (measured targets; no blind index spam)
create index if not exists words_slug_idx on public.words (slug);
create index if not exists words_normalized_idx on public.words (normalized_word);
create index if not exists words_length_idx on public.words (length);
create index if not exists words_first_letter_idx on public.words (first_letter);
create index if not exists words_last_letter_idx on public.words (last_letter);
create index if not exists words_length_first_idx on public.words (length, first_letter);
create index if not exists words_length_last_idx on public.words (length, last_letter);
create index if not exists words_signature_idx on public.words (alphabetical_signature);
create index if not exists words_verification_idx on public.words (verification_status);
create index if not exists words_game_valid_idx on public.words (game_valid) where game_valid = true;
create index if not exists words_regional_idx on public.words (regional_tag) where regional_tag is not null;

-- 4. Quarantine helper: anything with unclear licensing leaves the public index
--    (app queries add: .neq('verification_status', 'quarantined'))

-- 5. RLS / enrichment access (READ THIS before running scripts/enrich-freedictionary.mjs)
--    The app reads `words` with the anon key, but anon INSERT/UPDATE is normally
--    blocked by RLS (error 42501). The enrichment script therefore needs the
--    SERVICE_ROLE key: add SUPABASE_SERVICE_KEY=<service_role key> to .env.local
--    (server-only — never use a NEXT_PUBLIC_ name for it).
--    Do NOT open anon writes to the public internet. If app-runtime caching
--    (words.ts fire-and-forget upserts) must write, use a restrictive policy,
--    e.g. allow updates only of last_seen-style columns — not definition text.
