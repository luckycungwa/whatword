'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, X } from 'lucide-react';

interface SearchResult {
  word: string;
  slug: string;
  simple: string;
  pos: string;
  level: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`, {
        signal: abortRef.current.signal,
      });
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      }
    } catch {
      // aborted
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchResults(query), 220);
    return () => clearTimeout(timer);
  }, [query, fetchResults]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const navigateTo = useCallback(
    (slug: string) => {
      setQuery('');
      setFocused(false);
      setResults([]);
      setActiveIndex(-1);
      router.push(`/words/${slug}`);
    },
    [router],
  );

  // Canonical search action — used by Enter, icon click, and form submit
  const executeSearch = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    if (activeIndex >= 0 && results[activeIndex]) {
      navigateTo(results[activeIndex].slug);
      return;
    }
    if (results.length > 0) {
      navigateTo(results[0].slug);
      return;
    }
    if (q.length >= 2) {
      setFocused(false);
      router.push(`/words?q=${encodeURIComponent(q)}`);
    }
  }, [query, results, activeIndex, navigateTo, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focused || (results.length === 0 && !loading)) {
      if (e.key === 'Enter') executeSearch();
      if (e.key === 'Escape') {
        setFocused(false);
        inputRef.current?.blur();
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setFocused(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      // let form submit handle it via executeSearch
    }
  };

  // Keep active item visible
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasDropdown = focused && (results.length > 0 || loading);
  const showClear = query.length > 0;

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`flex items-center gap-2 rounded-2xl bg-[#f0f0f0] px-2 py-2 transition-all sm:px-3 ${
            focused ? 'ring-2 ring-[#141414]/10' : 'ring-0'
          }`}
        >
          <button
            type="submit"
            aria-label="Search"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#707070] shadow-sm transition-colors hover:text-[#141414] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20 active:bg-[#f3f3f3] sm:h-11 sm:w-11"
          >
            {loading ? (
              <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
            ) : (
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any word..."
            className="min-w-0 flex-1 bg-transparent py-2 text-[16px] font-medium text-[#141414] placeholder:text-[#adadad] focus:outline-none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-label="Search for a word"
            aria-expanded={hasDropdown}
            aria-controls="search-results"
            aria-autocomplete="list"
            role="combobox"
          />

          {showClear ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setActiveIndex(-1);
                inputRef.current?.focus();
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#adadad] transition-colors hover:bg-white hover:text-[#707070] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414]/20"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <span className="hidden w-10 shrink-0 sm:block" aria-hidden="true" />
          )}
        </div>
      </form>

      {hasDropdown && (
        <div
          id="search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(60vh,420px)] overflow-auto overscroll-contain rounded-2xl border border-[#f0f0f0] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
        >
          {loading && results.length === 0 && (
            <div className="flex items-center gap-2 px-5 py-4 text-sm text-[#adadad]" role="status" aria-live="polite">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching…
            </div>
          )}
          {results.map((word, idx) => (
            <button
              key={word.slug}
              type="button"
              role="option"
              aria-selected={idx === activeIndex}
              data-index={idx}
              onClick={() => navigateTo(word.slug)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`flex w-full items-start gap-3 border-b border-[#f0f0f0] px-5 py-3.5 text-left transition-colors last:border-0 hover:bg-[#f3f3f3] focus-visible:outline-none focus-visible:bg-[#f3f3f3] ${
                idx === activeIndex ? 'bg-[#f3f3f3]' : 'bg-white'
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold leading-5 text-[#141414]">{word.word}</span>
                <span className="mt-0.5 line-clamp-1 block text-xs leading-4 text-[#707070]">{word.simple || word.pos}</span>
              </span>
              <span className="badge shrink-0">{word.level}</span>
            </button>
          ))}
          {results.length > 0 && (
            <div className="border-t border-[#f0f0f0] px-5 py-2.5 text-center">
              <span className="text-xs text-[#adadad]">Press Enter to search or select a word</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
