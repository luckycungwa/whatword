'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Shuffle } from 'lucide-react';

interface SolverHit {
  word: string;
  slug: string;
  length: number;
  pos?: string;
  scrabbleScore: number;
  hasDefinition?: boolean;
  definition?: string;
}

interface ToolSolverClientProps {
  mode: 'anagram' | 'unscramble';
  initialLetters?: string;
}

/**
 * Shared client for Anagram Solver + Word Unscrambler.
 * Both consume the Word Intelligence Engine via API (never ship the corpus to the browser).
 */
export function ToolSolverClient({ mode, initialLetters = '' }: ToolSolverClientProps) {
  const [letters, setLetters] = useState(initialLetters);
  const [results, setResults] = useState<SolverHit[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const endpoint = mode === 'anagram' ? '/api/anagrams' : '/api/word-finder';

  const runSearch = useCallback(
    async (value: string) => {
      const clean = value.toLowerCase().replace(/[^a-z]/g, '');
      if (clean.length < 2) {
        setResults([]);
        setTotal(null);
        setSearched(false);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (mode === 'anagram') {
          params.set('letters', clean);
        } else {
          params.set('letters', clean);
          params.set('limit', '100');
        }
        const res = await fetch(`${endpoint}?${params.toString()}`);
        const data = await res.json();
        const list: SolverHit[] = data.results || [];
        setResults(list);
        setTotal(data.total ?? data.count ?? list.length);
        setSearched(true);
      } catch {
        setResults([]);
        setTotal(0);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, mode],
  );

  useEffect(() => {
    if (!initialLetters) return;
    const t = setTimeout(() => runSearch(initialLetters), 100);
    return () => clearTimeout(t);
  }, [initialLetters, runSearch]);

  useEffect(() => {
    const clean = letters.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length < 2) {
      setResults([]);
      setTotal(null);
      setSearched(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => runSearch(letters), 350);
    return () => clearTimeout(t);
  }, [letters, runSearch]);

  const shuffle = () => {
    const clean = letters.toLowerCase().replace(/[^a-z]/g, '');
    setLetters(clean.split('').sort(() => Math.random() - 0.5).join(''));
  };

  return (
    <div>
      <div className="rounded-3xl bg-[#f3f3f3] p-4 sm:p-6">
        <label htmlFor="solver-input" className="mb-1.5 block text-xs font-semibold text-[#707070]">
          {mode === 'anagram' ? 'Letters to rearrange' : 'Your letters'}
        </label>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-2 py-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f3] text-[#adadad]" aria-hidden="true">
            <Search className="h-4 w-4" />
          </span>
          <input
            id="solver-input"
            type="text"
            value={letters}
            onChange={(e) => setLetters(e.target.value.toLowerCase().replace(/[^a-z]/g, '').slice(0, 15))}
            placeholder={mode === 'anagram' ? 'e.g. listen' : 'e.g. aeplp'}
            className="min-w-0 flex-1 bg-transparent py-2 text-base tracking-widest text-[#141414] placeholder:text-[#adadad] focus:outline-none"
            aria-label="Enter letters"
          />
          <button
            type="button"
            onClick={shuffle}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f3f3f3] text-[#707070] transition-colors hover:bg-[#e8e8e8] hover:text-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20"
            aria-label="Shuffle letters"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 text-xs text-[#adadad]">
          {letters.replace(/[^a-z]/g, '').length} letter{letters.replace(/[^a-z]/g, '').length !== 1 ? 's' : ''}
          {searched && total !== null && (
            <>
              <span className="mx-1">&middot;</span>
              {loading ? 'Searching...' : `${total} word${total !== 1 ? 's' : ''} found`}
            </>
          )}
        </p>
      </div>

      <div className="mt-6">
        {loading && results.length === 0 ? (
          <div className="rounded-3xl bg-[#f3f3f3] p-8 text-center text-sm text-[#707070]">Searching the word graph...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((w) => (
              <Link
                key={w.slug || w.word}
                href={`/words/${w.slug || w.word}`}
                className="group flex items-center justify-between rounded-2xl bg-[#f3f3f3] px-4 py-3 transition-all hover:bg-[#e8e8e8]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#141414]">{w.word}</span>
                    <span className="text-xs text-[#adadad]">{w.length} letters</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-[#707070]">
                      {w.scrabbleScore} pts
                    </span>
                  </div>
                  {(w.definition || w.pos) && (
                    <p className="mt-0.5 line-clamp-1 text-xs text-[#707070]">
                      {w.definition || w.pos}
                    </p>
                  )}
                </div>
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[#adadad]" />
              </Link>
            ))}
          </div>
        ) : searched ? (
          <div className="rounded-3xl bg-[#f3f3f3] p-8 text-center">
            <p className="text-sm text-[#707070]">No anagrams found. Try different letters.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-[#f3f3f3] p-8 text-center">
            <p className="text-sm text-[#707070]">Enter at least 2 letters to see results.</p>
          </div>
        )}
      </div>
    </div>
  );
}
