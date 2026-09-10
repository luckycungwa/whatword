# WhatWord.co.za — Full SEO/Compliance Audit Report
**Date:** 2026-09-09 | **Target:** whatword.co.za | **Competitors:** dictionary.com, merriam-webster.com, vocabulary.com

---

## Executive Summary

| Page Type | Content | Technical SEO | AEO/AI | E-E-A-T | **Overall** |
|-----------|:---:|:---:|:---:|:---:|:---:|
| Word Definition (`/words/[word]`) | 7 | 7 | 7 | 7 | **7.0** |
| Word Finder (`/word-finder`) | 4 | 5 | 3 | 3 | **3.8** |
| Browse Pages (`/by-length/`, `/by-letter/`) | 3 | 4 | 2 | 2 | **2.8** |
| Learn Hub (`/learn`) | 3 | 5 | 2 | 2 | **3.0** |
| Learn Category (`/learn/[category]`) | 2 | 5 | 1 | 1 | **2.3** |
| Games Hub (`/games`) | 3 | 6 | 2 | 2 | **3.3** |
| WhatWord Game (`/games/whatword`) | 1 | 4 | 1 | 1 | **1.8** |
| Homepage (`/`) | 4 | 7 | 3 | 3 | **4.3** |

**Verdict:** Strong technical architecture, critically weak content across every page type except word definitions. The site is 2–3 content sprints from being competitive.

---

## Cross-Cutting Issues (All Pages)

| Issue | Impact | Fix |
|-------|--------|-----|
| No `robots.txt` | Crawlers have no guidance | Create with `Allow: /`, `Disallow: /api/`, `Sitemap:` |
| No `BreadcrumbList` schema site-wide | Misses rich result opportunity | Add via JSON-LD helper |
| No `FAQPage` schema anywhere | Zero AI Overview eligibility | Add to hub pages, word pages, homepage |
| Learn category metadata generic | All B1 pages have same description | Generate unique, keyword-rich descriptions |
| Game stats hardcoded "0" | Undermines trust | Make dynamic or remove |
| No `llms.txt` | AI crawler discovery gap | Add simple manifest |
| Source attribution buried | E-E-A-T trust gap | Make prominent on every page |

---

## Priority Actions (P0 = Critical)

| # | Action | Pages | Effort | Impact |
|---|--------|-------|--------|--------|
| 1 | Add 300+ words of unique editorial content to browse pages | `/by-length/`, `/by-letter/` | Medium | Critical |
| 2 | Add 300+ words of unique content per learn category | `/learn/[category]` | Medium | Critical |
| 3 | Create `robots.txt` | Global | 5 min | High |
| 4 | Add `BreadcrumbList` schema site-wide | All | Low | High |
| 5 | Add `FAQPage` schema to learn/games/homepage | Hub pages | Low | High |
| 6 | Surface word intelligence above the fold | `/words/[word]` | Medium | High |
| 7 | Add educational content to games hub | `/games` | Low | Medium |
| 8 | Pre-render popular word-finder results as static pages | `/word-finder/` | Medium | High |
| 9 | Add 400+ words to learn hub | `/learn` | Medium | Critical |
| 10 | Create `/games/whatword/how-to-play` guide page | Games | Medium | Medium |

---

## SERP Opportunities by Page Type

### Word Definition Pages
| Keyword | Volume Potential |
|---------|-----------------|
| `words with [X] letters in them` | High — WhatWord's within-words feature is direct answer |
| `[word] scrabble score and anagrams` | Medium — no single competitor covers both |
| `[word] south african english` | Low but zero competition |

### Word Finder
| Keyword | Volume Potential |
|---------|-----------------|
| `5 letter words for Wordle today` | Massive daily volume |
| `words that start with [X] and end with [Y]` | High long-tail |
| `how many 7 letter words are there in English` | Informational + tool |

### Browse Pages
| Keyword | Volume Potential |
|---------|-----------------|
| `how many [X] letter words are there in English` | High |
| `5 letter words for Wordle` | Massive daily |
| `words that start with [X] for kids` | Educational |

### Learn Pages
| Keyword | Volume Potential |
|---------|-----------------|
| `CEFR vocabulary list A1 A2 B1 B2 C1 C2 with definitions` | High |
| `learn English vocabulary by category` | Medium |
| `vocabulary builder for intermediate learners` | Medium |

### Games
| Keyword | Volume Potential |
|---------|-----------------|
| `free online vocabulary quiz with definitions` | High |
| `daily word challenge game improve vocabulary` | Medium |
| `word guessing game from definitions` | Medium |

---

## Competitor Landscape Summary

| Metric | dictionary.com | merriam-webster.com | vocabulary.com |
|--------|:---:|:---:|:---:|
| Organic Traffic | ~748M/mo | ~748M/mo | ~5.4M/mo |
| Indexed Pages | ~3.3M | 11.3M | ~500K |
| Referring Domains | 149.9K | 280.9K | ~50K |
| Domain Authority | Very High | Very High | High |

### What Each Does Best
- **dictionary.com:** Broadest coverage, multi-source definitions, game traffic capture
- **merriam-webster.com:** 200-year brand authority, cultural relevance, editorial depth
- **vocabulary.com:** Adaptive learning science, institutional sales, gamification

### WhatWord's Differentiation
1. **Word intelligence graph** (anagrams, within-words, neighbours) — no competitor offers this
2. **South African English focus** — zero competition from US-based dictionaries
3. **Game candidacy scoring** (Scrabble, Wordle integration) — unique combined value
4. **CEFR-aligned vocabulary paths** — vocabulary.com does this, but not for SA English

---

*Full page-by-page analysis available in the individual audit agent outputs.*
