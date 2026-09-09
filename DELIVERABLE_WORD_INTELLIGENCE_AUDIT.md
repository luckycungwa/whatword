# DELIVERABLE — Word Intelligence Audit (2026-09-09)

## 1. What already works (retained)
- Next.js 14 App Router + TypeScript + Tailwind (production domain `https://whatword.co.za`, metadataBase, OG/Twitter, WebSite+Organization JSON-LD).
- Supabase-backed word cache (`words` table) with dictionaryapi.dev fallback in `src/lib/words.ts`.
- Routes: `/words/[word]` (metadata + DefinedTerm/LearningResource/FAQ/Breadcrumb schemas), `/words`, `/words/by-length/[length]`, `/words/by-letter/[letter]`, `/word-finder` + `/api/word-finder`, `/synonyms`, `/antonyms`, `/learn`, 4 games, `/api/search`, `/api/dictionary/[word]`, robots + sitemap.
- Components: Header/Footer/SearchBar/AudioPlayer/WordQuiz/FlashcardWidget/Breadcrumbs.

## 2. What was retained vs modified
- Retained: all routes, components, games, learn system, existing SEO scaffolding.
- Modified: `src/lib/word-finder.ts` (now delegates to engine, same public API); `/words/[word]/page.tsx` (intelligence hub + SEO-score noindex gate); by-length/by-letter pages (engine-backed, quality-gated); `sitemap.ts` (indexability-gated); `/api/word-finder` (FinderQuery incl. unscrambler `letters`/`minLength`).

## 3. What was built (new)
- `src/lib/word-intelligence/`: normalize, sources, letter-props (+Scrabble/game), relationships, seo-score, query-parser, regional, corpus, service, index.
- `src/data/lexical-seed.ts`: 3,599-word local corpus with per-word field provenance.
- `scripts/ingest-esdb.mjs` + `scripts/enrich-freedictionary.mjs` (repeatable pipelines).
- `supabase/migrations/001_word_intelligence.sql` (provenance columns, verification states, letter/game columns, 11 indexes).
- `/anagram-solver`, `/word-unscrambler` + `ToolSolverClient` + `/api/anagrams`.
- `tests/word-intelligence.test.ts` (32 tests), `WORD-SOURCES.md` (license register).

## 4. Architectural risks
- Supabase remains the definition store; local corpus guarantees tool availability offline. If Supabase is down, word pages fall back to API fetch; tools keep working.
- `getSearchUniverse()` unions both per request; at 100k+ rows this needs the migration's `length/first_letter` indexes + pagination (documented, not yet needed).
- dictionaryapi.dev flakiness observed at build (HTTP 522) — migration to FreeDictionaryAPI scripted, not yet executed.

## 5. Data/licensing risks (handled)
- Removed false "Source: COCA" claim in `seed-bulk`. ESDB (MIT-like, notice required) + Wiktionary CC BY-SA 4.0 (attribution + ShareAlike on text fields) verified 2026-09-09; field-level isolation implemented; quarantine state for ambiguous rows.
- No definitions invented: seed carries spellings only; enrichment stores verbatim API text + sourceUrl.

## 6. SEO risks (handled)
- Prior sitemap listed every slug blindly → now only verified-definition words + quality-gated list pages. Thin word/list pages emit `noindex,follow`.
- Prior build pre-rendered 8,777 static pages and crashed on a dead `[slug]` route → dead route removed, dynamic rendering, 27 routes, build green.
