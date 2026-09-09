# DELIVERABLE — SEO Report (2026-09-09)

## Scoring system
`scoreWordPage()` (0–100): Intent /20, Completeness /20, Uniqueness /15, Utility /20, Relationships /10, Depth /10, Confidence /5.
Thresholds (configurable `DEFAULT_THRESHOLDS`): ≥90 index-priority, ≥80 index, ≥70 review, <70 noindex.
Reference: rich page ≈ 89 (index); definition-less page ≈ 13–20 (noindex). Tested both directions.

## Indexing enforcement
- `/words/[word]`: `generateMetadata` scores each page; thin pages emit `robots: noindex,follow`.
- `/words/by-length/*`, `/words/by-letter/*`: `listPageDecision(total)` — <5 results → noindex. Counts now come from the 3,599-word universe (previously "0 cached" dead-ends).
- `sitemap.xml`: static hubs + `/anagram-solver` + `/word-unscrambler` + only verified-definition Supabase words + list pages passing the ≥5 gate. Never every URL pattern.

## Internal linking (automatic, contextual)
Word page → synonyms/antonyms hubs, Word Finder, length page, starting-letter page, anagram/unscrambler prefilled with the word, related words, anagrams/neighbours/within-words cross-links. No boilerplate link farms.

## Metadata/structured data
Unique per-word titles (`Apple — Definition, Anagrams & Word-Game Info`), data-driven descriptions (definition + length + Scrabble + top anagrams), canonicals everywhere, DefinedTerm/LearningResource/Breadcrumb/FAQ schemas retained; WebApplication schema added on both solver pages.

## Risks closed this phase
- Thin-content: noindex gates + sitemap exclusion (was: index-all).
- Duplicate routes: dead `words/[slug]/` dir removed; redirects for legacy `/words/:length-letter-words`, `/words/starting-with/:letter` already in `next.config.js`.
- Near-empty filter combos: `listPageDecision` blocks them.

## Deferred (documented, not hidden)
- `/synonyms/[word]`, `/antonyms/[word]` individual pages: not in sitemap, no thin-gate yet (they render via API fallback; mostly content-rich). Next phase: apply same scoring.
- Search Console submission, analytics, OG image check (`black-logo.png` exists in `/public`).
