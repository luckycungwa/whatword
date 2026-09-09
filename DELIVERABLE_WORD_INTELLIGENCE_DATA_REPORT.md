# DELIVERABLE — Data Report (2026-09-09, measured values)

## Corpus
- Local lexical corpus: **3,599 words**, all with `WORD_EXISTS` + deterministic letter/game properties.
- Every entry carries `fieldSources` (spelling/frequency/pos → `whatword-seed-v1`; letterProps/anagrams/gameScore → `whatword-derived-v1`).
- Anagram signature index: full coverage; `listen → silent, enlist, inlets, tinsel` (4/4).
- Definitions: seed carries NONE by design. Verified definitions live in Supabase (`definition-verified`) or legacy dictionaryapi.dev cache rows; enrichment pipeline targets FreeDictionaryAPI.
- Game validity separated: `gameCandidate` heuristic (common, 2–15 letters) + Scrabble scores for all; official tournament lists explicitly deferred (never claimed).

## Quality gates
- Normalisation: NFKC, lowercase, canonical-key dedupe (repeat ingestion safe). Rejects empty/bad-length/bad-characters/bad-punctuation.
- `validateWord('abc123')` → canonical `abc` (digits stripped, documented + tested).
- Licensing: ambiguous rows → `verificationStatus: 'quarantined'`, excluded from pages/sitemap (migration 001).

## Coverage (local corpus, measured)
- Anagram demo sets complete: LISTEN family 4/4; APPLE signature `aelpp`; CAT neighbours `bat, can, cap, car`.
- Length/prefix/suffix/contains/pattern filters operate over the full 3,599-word universe (previously Supabase-cache-only, ~100s rows).

## Pending (honest gaps)
- Full ESDB import (size 60) not yet executed — requires ESDB checkout + `make`; script ready, commit to be recorded at import.
- FreeDictionaryAPI enrichment not yet bulk-run (1,000 req/hour limit; run `npm run enrich:dict` in batches).
- Supabase migration 001 not yet applied (apply in Dashboard SQL Editor).
- Supabase row counts not re-measured here (prior docs: ~100 curated + bulk-cached rows); local corpus is now the guaranteed floor.
