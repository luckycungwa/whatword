'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X } from 'lucide-react';

/**
 * NOTE: the /words page maps full entries to slim rows before passing them
 * here, so the static RSC payload stays small (~60KB, not megabytes).
 * This component only needs browse/display fields — never full definitions.
 */
export interface DictionaryRow {
  slug: string;
  word: string;
  partOfSpeech: string;
  difficulty: string;
  vocabularyLevel: string;
  hasDefinition: boolean;
  simple: string;
}

export default function DictionaryClient({ words }: { words: DictionaryRow[] }) {
  const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [activePOS, setActivePOS] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PER_PAGE = 50;

  const posOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    words.forEach(w => {
      counts[w.partOfSpeech] = (counts[w.partOfSpeech] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [words]);

  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    words.forEach(w => {
      const letter = w.word[0].toUpperCase();
      if (/[A-Z]/.test(letter)) {
        counts[letter] = (counts[letter] || 0) + 1;
      }
    });
    return counts;
  }, [words]);

  const filtered = useMemo(() => {
    let result = words;
    if (activeLetter) {
      result = result.filter(w => w.word[0].toUpperCase() === activeLetter);
    }
    if (activePOS) {
      result = result.filter(w => w.partOfSpeech === activePOS);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.simple.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => a.word.localeCompare(b.word));
  }, [words, activeLetter, activePOS, search]);

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#adadad]" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search words or definitions..."
          className="w-full rounded-2xl border border-[#e0e0e0] bg-[#f0f0f0] py-3 pl-11 pr-10 text-sm text-[#141414] outline-none transition-colors placeholder:text-[#adadad] focus:border-[#0066ff]"
        />
        {search && (
          <button
            onClick={() => { setSearch(''); setPage(0); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#adadad] hover:bg-[#e0e0e0] hover:text-[#141414]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Letter filter */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => { setActiveLetter(null); setPage(0); }}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            !activeLetter
              ? 'bg-[#141414] text-white'
              : 'bg-[#f3f3f3] text-[#707070] hover:bg-[#e0e0e0]'
          }`}
        >
          All
        </button>
        {LETTERS.map(letter => (
          <button
            key={letter}
            onClick={() => { setActiveLetter(activeLetter === letter ? null : letter); setPage(0); }}
            disabled={!letterCounts[letter]}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeLetter === letter
                ? 'bg-[#141414] text-white'
                : letterCounts[letter]
                  ? 'bg-[#f3f3f3] text-[#707070] hover:bg-[#e0e0e0]'
                  : 'bg-[#f3f3f3] text-[#d0d0d0] cursor-not-allowed'
            }`}
          >
            {letter}
            {letterCounts[letter] ? (
              <span className="ml-1 text-[10px] opacity-60">{letterCounts[letter]}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Part of speech filter */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {posOptions.map(([pos, count]) => (
          <button
            key={pos}
            onClick={() => { setActivePOS(activePOS === pos ? null : pos); setPage(0); }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              activePOS === pos
                ? 'bg-[#0066ff] text-white'
                : 'bg-[#f3f3f3] text-[#707070] hover:bg-[#e0e0e0]'
            }`}
          >
            {pos} ({count})
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-[#707070]">
        {filtered.length.toLocaleString()} word{filtered.length !== 1 ? 's' : ''}
        {activeLetter && <> starting with <strong className="text-[#141414]">{activeLetter}</strong></>}
        {activePOS && <> — <strong className="text-[#141414] capitalize">{activePOS}</strong></>}
        {search && <> matching <strong className="text-[#141414]">&ldquo;{search}&rdquo;</strong></>}
      </div>

      {/* Word grid */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {paged.map(word => (
          <Link
            key={word.slug}
            href={`/words/${word.slug}`}
            className="group flex items-start justify-between rounded-2xl border border-[#e0e0e0] bg-white p-4 transition-all hover:border-[#0066ff]/30"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#141414]">{word.word}</span>
                <span className="rounded-full bg-[#f3f3f3] px-2 py-0.5 text-[10px] font-medium text-[#707070] capitalize">
                  {word.partOfSpeech}
                </span>
                {!word.hasDefinition && (
                  <span className="rounded-full bg-[#fff4e0] px-2 py-0.5 text-[10px] font-medium text-[#8a6d1b]">
                    graph entry
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-[#707070]">
                {word.simple || 'In the word graph — full definition being verified.'}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-[#adadad]">
                <span className="capitalize">{word.difficulty}</span>
                <span>·</span>
                <span>{word.vocabularyLevel}</span>
              </div>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#e0e0e0] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0066ff]" />
          </Link>
        ))}
      </div>

      {paged.length === 0 && (
        <div className="mt-12 text-center text-[#707070]">
          <p className="text-lg">No words found</p>
          <p className="mt-1 text-sm">Try a different filter or search term</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-full bg-[#f3f3f3] px-4 py-2 text-sm font-medium text-[#707070] transition-colors hover:bg-[#e0e0e0] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-4 text-sm text-[#707070]">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-full bg-[#f3f3f3] px-4 py-2 text-sm font-medium text-[#707070] transition-colors hover:bg-[#e0e0e0] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
