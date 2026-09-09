# ESDB / SCOWL Import — Local Runbook

The ESDB import cannot run in CI (needs a `make` build step + Python + libscowl). Run this once locally:

## Prerequisites
```bash
# macOS
brew install python3 aspell  # libscowl builds against Aspell headers
# Ubuntu/Debian
sudo apt-get install python3 python3-venv aspell libaspell-dev make
# Windows (via WSL2 Ubuntu recommended)
```

## Steps

1. **Clone the ESDB repo (branch `v2`)**
   ```bash
   git clone --branch v2 --depth 1 https://github.com/en-wl/wordlist.git /tmp/esdb
   cd /tmp/esdb
   ```

2. **Build the database**
   ```bash
   make   # produces scowl.db (SQLite) and scowl.txt
   ```

3. **Run our ingestion script**
   ```bash
   cd /path/to/whatword
   node scripts/ingest-esdb.mjs --checkout=/tmp/esdb --size=60 --spellings=A --emit
   ```
   - `--size=60` (default spellchecker size; size 70 pulls UKACD-copyright words)
   - `--spellings=A` = American spellings (use `B,Z` for British with -ize/-ise variants)
   - `--emit` writes `src/data/esdb-corpus.generated.ts` with exact commit hash + word list

4. **Verify**
   ```bash
   npm run test:intelligence   # corpus breadth test passes
   npm run build               # build uses the generated corpus
   ```

## What it does
- Validates the ESDB `Copyright` notice (MIT-like, attribution required).
- Exports the word list via libscowl `word-list 60 A 1` (American, variant-level 1).
- Filters: canonical NFKC lowercase, 1–45 chars, a-z + interior apostrophe/hyphen only.
- Writes `src/data/esdb-corpus.generated.ts` (3.6k+ words, fieldSources pointing to ESDB).
- The build bundles this as the guaranteed graph floor; Supabase enrichments overlay on top.

## Updating later
Re-run step 3 with a fresh checkout. The commit hash is recorded in the generated file for traceability.

## If you want size 70 (more words, larger tool corpus)
Change `--size=70` — but **only after** reading the ESDB `Copyright` section `=== UKACD` to confirm you accept J Ross Beresford's UKACD notice. Size 60 avoids it.