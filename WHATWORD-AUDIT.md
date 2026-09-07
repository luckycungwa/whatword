# WhatWord — Full Audit & Implementation Plan

**Date:** 2026-09-06
**Auditor:** Lead Product Engineer / UX Designer / SEO Architect

---

## 1. EXISTING LIVE SITE (whatword.vercel.app)

### Critical Finding: The live site is a Create React App (CRA) SPA
- **Framework:** React 18 + CRA (react-scripts 5.0.1)
- **Routing:** react-router-dom v6 (client-side only)
- **Styling:** Tailwind CSS 3 + NextUI + custom CSS
- **Data:** Firebase Realtime Database + Free Dictionary API (dictionaryapi.dev)
- **Deployment:** Vercel (static build)
- **NO server-side rendering whatsoever** — `<noscript>` fallback only
- **NO sitemap.xml** — returns 404
- **robots.txt** exists but is minimal (allows all)
- **manifest.json** still says "Create React App Sample"
- **Title** is "What Word?" — generic, not SEO-optimized
- **No dynamic word pages** — everything is client-side rendered

### SEO Verdict: **CRITICAL FAILURE**
Google receives an empty `<div id="root"></div>` with no meaningful HTML content. The site is effectively invisible to search engines. No programmatic pages, no structured data, no metadata beyond basic title/description.

---

## 2. LOCAL REPOSITORY (PARTIALLY MIGRATED)

### What Has Been Done
The repo has been partially migrated to **Next.js 14 App Router** with:
- TypeScript, Tailwind CSS, Framer Motion, Lucide React Icons
- Root layout with metadata and JSON-LD (Website + Organization)
- Homepage with hero, search, categories, FAQ
- Dynamic `/word/[slug]` page with `generateMetadata()` and structured data
- Components: Header, Footer, SearchBar, AudioPlayer, WordQuiz, FlashcardWidget, WordPageClient
- Sitemap generator at `app/sitemap.ts`
- Not-found page, privacy page, terms page
- 15 word entries in `lib/words.ts`

### What Is Missing (Critical Gaps)

| Category | Status | Issue |
|----------|--------|-------|
| Word database | 15 words | Far too thin for a production platform |
| Data model | Missing fields | No syllables, word forms, frequency, quiz eligibility, game eligibility |
| Word Finder | Missing | No tool exists |
| Synonyms/Antonyms pages | Missing | No hub pages or dedicated routes |
| Vocabulary Learning | Missing | No /learn/ section |
| Games | Missing | No game system |
| Daily experience | Minimal | Only daily word selection, no daily challenge/game |
| User system | Missing | No architecture for saved words, streaks, progress |
| SEO content | Minimal | No /words/ index, no /word-finder/, no /synonyms/, no /antonyms/ |
| Internal linking | Weak | Word pages don't link to tools/games |
| robots.txt | CRA leftover | Needs proper Next.js implementation |
| Structured data | Basic | Missing Quiz, BreadcrumbList on all pages |
| Analytics | Missing | No event tracking architecture |
| Monetization | Missing | No ad placement architecture |
| Accessibility | Partial | Basic ARIA, needs keyboard nav, focus states, reduced motion |
| Mobile UX | Partial | Responsive but not mobile-first optimized |
| Performance | Unknown | No Core Web Vitals testing |

---

## 3. ARCHITECTURE DECISIONS

### Keep (reuse existing)
- Next.js 14 App Router foundation
- TypeScript + Tailwind CSS stack
- Framer Motion for animations
- Lucide React for icons
- Root layout with metadata
- Word page with generateMetadata + structured data
- AudioPlayer component
- WordQuiz component (improve)
- FlashcardWidget component (improve)
- SearchBar component (improve)

### Replace
- **Data model** — Expand from 15 fields to full production schema
- **Word database** — Grow from 15 to 100+ curated words
- **Navigation** — Redesign for 5-section product (Home, Words, Word Finder, Learn, Games)
- **Homepage** — Redesign as product hub, not generic landing page
- **robots.txt** — Proper implementation via app/robots.ts

### Add (new pages/components)
- `/words` — Word index with search/filter
- `/words/[word]` — Enhanced word page (rename from /word/)
- `/word-finder` — Pattern search tool
- `/synonyms/[word]` — Synonym explorer
- `/antonyms/[word]` — Antonym explorer
- `/learn` — Vocabulary learning hub
- `/learn/[category]` — Category learning
- `/games` — Games hub
- `/games/whatword` — Main WhatWord game
- `/games/definition-challenge` — Definition quiz game
- `/games/word-scramble` — Word scramble game
- `/games/spelling` — Spelling challenge
- Daily challenge system
- User learning architecture (data layer)

---

## 4. IMPLEMENTATION PLAN

### Phase 1: Product Foundation
- Redesign navigation (HOME / WORDS / WORD FINDER / LEARN / GAMES)
- Redesign homepage as product-focused hub
- Clean up header/footer for production polish

### Phase 2: SEO Foundation
- Implement `app/robots.ts` 
- Update sitemap to include all new routes
- Add BreadcrumbList to all pages
- Fix metadata base URL
- Ensure proper canonical URLs

### Phase 3: Word Database
- Expand WordEntry interface with full production fields
- Grow to 100+ curated words with full data
- Create word-finder data layer (letter patterns, lengths)
- Create synonyms/antonyms cross-reference data

### Phase 4: Word Pages
- Rename route from `/word/[slug]` to `/words/[word]`
- Enhance content sections
- Add breadcrumb navigation
- Add internal linking to tools/games

### Phase 5: Word Finder
- Build pattern matching engine
- Create `/word-finder` page with filters
- Create high-value SEO landing pages

### Phase 6: Synonyms/Antonyms
- Build `/synonyms/[word]` and `/antonyms/[word]`
- Create hub pages
- Add mini-quizzes

### Phase 7: Vocabulary Learning
- Build `/learn` hub
- Create category-based learning
- Build quiz system

### Phase 8: Games
- Build game architecture
- Implement WhatWord game
- Implement Definition Challenge
- Implement Word Scramble
- Implement Spelling Challenge

### Phase 9: Daily Experience
- Daily word system
- Daily game challenges
- Streak tracking (localStorage)

### Phase 10-20: Remaining
- User system architecture
- SEO content pages
- Internal linking
- Structured data
- Performance optimization
- Mobile UX
- Accessibility
- Monetization hooks
- Analytics hooks
- Quality control
- Final SEO validation

---

## 5. DEPLOYMENT NOTES

- Domain: whatword.co.za (configured in metadata)
- Current deploy: whatword.vercel.app (CRA)
- Target: Deploy Next.js to Vercel
- Must update Vercel project settings for Next.js

---

## 6. RISKS

1. **Word database quality** — Must not invent definitions or scrape copyrighted content
2. **Thin content** — Must not create thousands of low-value SEO pages
3. **Scope creep** — 20 phases, must stay focused on highest-impact items
4. **Build size** — 100+ words with full data will increase bundle; use static generation

---

*Audit complete. Beginning implementation.*
