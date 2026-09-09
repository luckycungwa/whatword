# DELIVERABLE — Performance Report (2026-09-09, measured, not estimated)

Engine measured via tsx on dev machine (3,599-word corpus):

| Operation | Time | Result |
|---|---|---|
| Corpus load + index build (one-time, in-memory) | 73 ms | 3,599 words |
| Anagram lookup (`listen`) | 0 ms | 4 hits |
| One-letter neighbours (`cat`) | 2 ms | 4 hits |
| Finder query (5-letter starting with S) | 33 ms | 172 total (33 ms includes live Supabase slug fetch; pure-local path is <5 ms) |
| Solver end-to-end (`listen`) | 3 ms | 4 hits |

Live production-server smoke test (`next start`):
- `GET /api/anagrams?letters=listen` → `enlist, silent, tinsel` (+`inlets` after seed fix) ✅
- `GET /api/word-finder?letters=aeplp&limit=10` → `apple, pale, peal` ✅
- `/anagram-solver` page: not verified via CLI (PowerShell non-interactive fetch limitation); verified via successful build prerender.

## Strategy
- Corpus ships as a compact TS module (~3.6k entries); signatures precomputed once per server boot. Browser never downloads the corpus — tools query `/api/*`.
- Server-side querying + defined-first ranking; results capped (default 100, max 200).
- Migration 001 adds DB indexes (`slug, normalized_word, length, first/last letter, length+first/last composites, signature, verification, game_valid, regional`) so Supabase unions stay fast as rows grow to 100k+.
- Build: 27 routes, all green (previously crashed pre-rendering 8,777 pages).

## Not yet done
- No caching layer for anagram/filter results yet (lookups are sub-5 ms; add when corpus × traffic demands it).
- `getWordsByLength` legacy helper in `words.ts` still full-scans Supabase; superseded by `finderQuery` (kept for compat, flagged for removal).
