# WORD-SOURCES.md — WhatWord Word Intelligence: Source & License Register

**Date verified:** 2026-09-09
**Status:** Active provenance record. Every imported/enriched field must cite one of the sources below.
**Rule:** If a source's licensing is unclear, DO NOT import it into the production corpus.

---

## 1. ESDB — English Speller Database (lexical existence seed)

| Field | Value |
|---|---|
| Source name | English Speller Database (ESDB), previously SCOWLv2 / SCOWL (and Friends) |
| Maintainer | Kevin Atkinson (kevina@gnu.org) |
| Repo | https://github.com/en-wl/wordlist (branch `v2`) |
| Homepage/docs | https://wordlist.aspell.net/ |
| Version used | Rolling `v2` branch (no stable DB release yet; speller dict release 2026.02.25). Record exact commit hash at import time. |
| What we use it for | `WORD_EXISTS`, spelling, dialect/variant flags, frequency/commonness size band, basic POS/inflection hints |
| What we do NOT use it for | Definitions, examples, synonyms, pronunciations (ESDB does not contain these) |
| License | Permissive MIT-like grant: *"Permission to use, copy, modify, distribute, and sell any part of the ESDB, or word lists created from it, is hereby granted without fee, provided that the above copyright notice appears in all copies and that both the above copyright notice and this notice appear in supporting documentation."* — Copyright 2000–2026 by Kevin Atkinson. Full text in `Copyright` file of the repo (verified 2026-09-09). |
| Attribution required | Yes — include `Copyright 2000-2026 by Kevin Atkinson` notice in app supporting docs + about/attribution page. |
| Additional copyrights | **AU data** (Benjamin Titze notice) applies ONLY if using `D` spelling code / `AU` region — we do not (US/GB-en-ZA scope, size ≤ 70). **UKACD** (J Ross Beresford) notice applies ONLY to word lists larger than size 80 — we cap at size 70. **WordNet** (Princeton) MAY apply to POS tags derived from initial POS assignment — POS values we store are single common nouns (`noun`, `verb`, …), flagged `posSource: 'esdb-heuristic'` and re-verified against the dictionary source. |
| COCA note | ESDB used COCA 3-gram data under NDA; that raw data is NOT redistributed by ESDB and NOT imported by us. Our `frequency` band is an ESDB size-band heuristic, not COCA data. The old `seed-bulk` comment claiming "Source: COCA" was incorrect and has been removed. |
| Commercial use / redistribution | Permitted, with notices above. |
| ShareAlike interaction | None from ESDB side. Dictionary text layered on top stays under its own license (see §2) — field-level isolation required. |
| Import method | `scripts/ingest-esdb.mjs` (size 60, American spellings, variant-level 1, no AU codes, no >80 lists). |

## 2. FreeDictionaryAPI.com (dictionary enrichment)

| Field | Value |
|---|---|
| Source name | FreeDictionaryAPI.com |
| Endpoint | `https://freedictionaryapi.com/api/v1/entries/en/{word}` (OpenAPI 3.0 spec published on-site) |
| Underlying data | English Wiktionary |
| Data license | **CC BY-SA 4.0** (Wiktionary entries dual-licensed CC BY-SA 4.0 + GFDL) |
| Attribution requirements | (1) Link back to the original Wiktionary page (URL supplied per API response, stored in `sourceUrl`); (2) visible attribution to FreeDictionaryAPI.com; (3) indicate changes where adapted. Implemented via attribution block on every enriched word page + `/attribution` page. |
| ShareAlike obligation | Adapted definition/example text redistributed on WhatWord pages remains CC BY-SA 4.0. Our surrounding code, derived letter/game computations, and original summaries are our own work and NOT under ShareAlike — hence field-level provenance (`fieldSources`) on every record. Do NOT present Wiktionary-derived text as WhatWord-original. |
| Rate limits | 1,000 requests/hour/IP, no key. Enrichment must be batched/backoff (`scripts/enrich-freedictionary.mjs`), never 5–10k blind live calls. |
| Commercial use | Permitted under CC BY-SA 4.0 terms with attribution + ShareAlike. |
| Migration note | Legacy `dictionaryapi.dev` (CC BY-SA 3.0) enrichment remains readable for old cached rows (`source: 'dictionaryapi.dev'`) but all NEW enrichment uses FreeDictionaryAPI.com. |

## 3. WhatWord-derived (computed intelligence — our own work)

| Field | Value |
|---|---|
| Source name | WhatWord Word Intelligence Engine |
| Covers | normalized spelling, length, letter properties, signatures, anagrams, neighbours, prefix/suffix/within-word relations, Scrabble scores, SEO scores, pattern indexes |
| License | WhatWord proprietary (no third-party obligations). Deterministic algorithms over spellings. |
| Provenance tag | `whatword-derived-v1` |

## 4. Editorial / Mzansi Word Bank (South African English)

| Field | Value |
|---|---|
| Source name | WhatWord Editorial (Mzansi Word Bank) |
| Covers | `locale: 'en-ZA'` entries (SA slang, loanwords, local usage notes) |
| Rule | Never auto-label a word South African from a generic dataset. Every `regionalTag: 'south-africa'` row requires an editor + source citation (dictionary, style guide, publication). Schema supports it; seed contains a small reviewed starter set only. |

## 5. Field → source map (canonical)

```text
spelling, existence, dialect, frequency-band → esdb
pos-hint (unverified)                        → esdb-heuristic (re-verify via §2)
definition, examples, synonyms, antonyms,
pronunciation, word-forms, sourceUrl         → freedictionaryapi (CC BY-SA 4.0)
anything computed from letters               → whatword-derived-v1
SA usage notes, regionalTag                  → whatword-editorial (citation required)
legacy cached rows                           → dictionaryapi.dev (CC BY-SA 3.0, attribution retained)
```

## 6. License-interaction statement

ESDB's permissive grant and Wiktionary's CC BY-SA 4.0 CAN be combined in one product as long as the ShareAlike-licensed text fields stay attributed and ShareAlike-flagged. Our architecture does this via per-field `fieldSources` + `licenses[]` on every record and visible page-level attribution. If any field's licensing becomes ambiguous, it is quarantined (`verificationStatus: 'quarantined'`) and excluded from public pages until resolved.
