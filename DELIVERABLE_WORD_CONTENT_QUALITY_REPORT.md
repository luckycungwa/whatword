# DELIVERABLE — Content Quality Report (2026-09-09)

## Generation rules (enforced)
- Content blocks render ONLY from structured data present on the page (definition, examples, synonyms, anagrams, neighbours, within-words, letter facts, game info, SA note). No block renders empty.
- Zero invented facts: no generated definitions/examples/etymology/pronunciation/game-validity/word-forms. Seed file carries spellings only.
- No filler boilerplate ("Apple is an interesting word…"). Every block answers a user question (what does X mean / what rhymes-rearranges / what can I make / how many points).

## Word page block inventory (`/words/[word]`)
Definition (simple+full) · pronunciation+audio · examples · etymology · synonyms/antonyms · word forms · letter-facts grid (length/Scrabble/starts/ends) · anagrams · words-from-letters · one-letter neighbours · SA usage (en-ZA only) · quiz · flashcard · related words · tool cross-links · source attribution footer.

## Quality gates
- Thin pages (`score < 70`, e.g. spelling-only rows) → `noindex` + excluded from sitemap. Review band 70–79 → `noindex` pending enrichment.
- Duplicate-template risk: descriptions/scores vary per word (definition text + counts + top anagrams); list pages show real result counts.
- Attribution honesty: page footer + WORD-SOURCES.md; ShareAlike text fields flagged per-field, never re-licensed.

## Known content gaps
- Examples/synonyms depend on Supabase enrichment depth (legacy dictionaryapi.dev rows are thin: 1 example, uncapped synonym lists sliced to 8/5).
- Etymology/funFact on legacy rows are short or empty — rendered only when present (no hallucinated fill).
- Synonym/antonym individual pages lack the thin-gate (deferred, see SEO report).
