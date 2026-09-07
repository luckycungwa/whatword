# SEO-INDEXING-PLAN.md

**Date:** 2026-09-07
**Production Domain:** whatword.co.za (when purchased) / whatword.vercel.app (current)

---

## Route Classification

### INDEX (High Priority)
| Route | Priority | Rationale |
|-------|----------|-----------|
| `/` | 1.0 | Homepage — primary landing page |
| `/words` | 0.9 | Word index — main content hub |
| `/words/[word]` | 0.9 | 100 individual word pages — core content |
| `/word-finder` | 0.9 | Word Finder tool — high user intent |
| `/learn` | 0.9 | Vocabulary hub — educational content |
| `/games` | 0.9 | Games hub — engagement page |

### INDEX (Medium Priority)
| Route | Priority | Rationale |
|-------|----------|-----------|
| `/synonyms` | 0.8 | Synonym hub page |
| `/antonyms` | 0.8 | Antonym hub page |
| `/learn/[level]` (a1-c2) | 0.7 | 6 CEFR level pages |
| `/learn/[difficulty]` | 0.7 | 3 difficulty pages (beginner, intermediate, advanced) |
| `/learn/[category]` | 0.7 | 15 category pages |
| `/games/whatword` | 0.7 | WhatWord Challenge game |
| `/games/definition-challenge` | 0.7 | Definition Challenge game |
| `/games/word-scramble` | 0.7 | Word Scramble game |
| `/games/spelling` | 0.7 | Spelling Challenge game |

### INDEX (Low Priority)
| Route | Priority | Rationale |
|-------|----------|-----------|
| `/synonyms/[word]` | 0.6 | 100 individual synonym pages |
| `/antonyms/[word]` | 0.6 | 100 individual antonym pages |
| `/privacy` | 0.3 | Legal page |
| `/terms` | 0.3 | Legal page |

### NOINDEX
| Route | Rationale |
|-------|-----------|
| (none currently) | All routes provide unique value |

### EXCLUDE (from sitemap)
| Route | Rationale |
|-------|-----------|
| `/api/*` | Not in sitemap — internal API routes |
| `/admin/*` | Not in sitemap — admin routes (if any) |

---

## Sitemap Coverage

Total URLs in sitemap:
- Static pages: 22
- Word pages: 100
- Category/learn pages: 24 (6 CEFR + 3 difficulty + 15 category)
- Synonym pages: 100
- Antonym pages: 100
- **Total: ~346 URLs**

---

## Canonical URL Strategy

| Route Pattern | Canonical | Notes |
|---------------|-----------|-------|
| `/*` | `https://whatword.co.za/*` | Absolute URLs via metadataBase |
| `/words/[word]` | `https://whatword.co.za/words/[word]` | Unique per word |
| `/synonyms/[word]` | `https://whatword.co.za/synonyms/[word]` | Unique per word |
| `/antonyms/[word]` | `https://whatword.co.za/antonyms/[word]` | Unique per word |

---

## Structured Data Coverage

| Schema Type | Pages | Notes |
|-------------|-------|-------|
| WebSite | All (via layout) | With SearchAction |
| Organization | All (via layout) | Brand info |
| BreadcrumbList | All word/synonym/antonym pages | Via Breadcrumbs component |
| DefinedTerm | Individual word pages | Definition schema |
| LearningResource | Individual word pages | Educational level |
| FAQPage | Individual word pages | 3 Q&A per word |

---

## Required Assets (Before Launch)

| Asset | Status | Purpose |
|-------|--------|---------|
| `public/og-image.png` | MISSING | Social sharing image (1200x630) |
| `public/logo.png` | MISSING | Organization logo for JSON-LD |

---

## Pre-Launch Checklist

- [x] All routes return 200
- [x] No 500 errors
- [x] Unique title tags on all pages
- [x] Meta descriptions on all pages
- [x] Canonical URLs on all pages
- [x] OpenGraph tags on all pages
- [x] robots.txt functional
- [x] sitemap.xml includes all routes
- [x] Structured data on key pages
- [x] Breadcrumb navigation
- [ ] Create `public/og-image.png` (1200x630)
- [ ] Create `public/logo.png`
- [ ] Verify robots.txt in production
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics / Plausible
