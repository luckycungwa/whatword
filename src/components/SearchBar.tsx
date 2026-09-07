'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

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
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: abortRef.current.signal,
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch {
      // abort or network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (slug: string) => {
    setQuery('');
    setFocused(false);
    router.push(`/words/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0].slug);
    else if (query.length >= 2) router.push(`/words?q=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.parentElement?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#adadad]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search any word..."
            className="input-field !pl-13 !pr-12 !text-[16px]"
            autoComplete="off"
            aria-label="Search for a word"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#adadad] hover:text-[#707070]"
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      {focused && (results.length > 0 || loading) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#f0f0f0] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          {loading && results.length === 0 && (
            <div className="flex items-center gap-2 px-5 py-4 text-sm text-[#adadad]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </div>
          )}
          {results.map((word) => (
            <button
              key={word.slug}
              type="button"
              onClick={() => handleSelect(word.slug)}
              className="flex w-full items-start gap-3 border-b border-[#f0f0f0] px-5 py-3.5 text-left transition-colors last:border-0 hover:bg-[#f3f3f3]"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold text-[#141414]">{word.word}</div>
                <div className="mt-0.5 line-clamp-1 text-xs text-[#707070]">{word.simple}</div>
              </div>
              <span className="badge shrink-0">
                {word.level}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
