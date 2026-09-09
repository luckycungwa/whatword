'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { WORD_LENGTHS, type WordPattern, type WordFinderResult } from '@/lib/word-finder';
import Link from 'next/link';

export function WordFinderClient() {
  const [length, setLength] = useState<string>('');
  const [startsWith, setStartsWith] = useState('');
  const [endsWith, setEndsWith] = useState('');
  const [contains, setContains] = useState('');
  const [notContains, setNotContains] = useState('');
  const [pattern, setPattern] = useState('');
  const [results, setResults] = useState<WordFinderResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasFilters = length || startsWith || endsWith || contains || notContains || pattern;
    if (!hasFilters) {
      setResults([]);
      return;
    }

    setLoading(true);
    const p: WordPattern = {};
    if (length) p.length = parseInt(length);
    if (startsWith) p.startsWith = startsWith;
    if (endsWith) p.endsWith = endsWith;
    if (contains) p.contains = contains;
    if (notContains) p.notContains = notContains;
    if (pattern) p.knownLetters = pattern;

    const params = new URLSearchParams();
    if (p.length) params.set('length', String(p.length));
    if (p.startsWith) params.set('startsWith', p.startsWith);
    if (p.endsWith) params.set('endsWith', p.endsWith);
    if (p.contains) params.set('contains', p.contains);
    if (p.notContains) params.set('notContains', p.notContains);
    if (p.knownLetters) params.set('knownLetters', p.knownLetters);

    fetch(`/api/word-finder?${params.toString()}`)
      .then(r => r.json())
      .then(data => { setResults(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [length, startsWith, endsWith, contains, notContains, pattern]);

  const hasFilters = length || startsWith || endsWith || contains || notContains || pattern;

  const clearAll = () => {
    setLength('');
    setStartsWith('');
    setEndsWith('');
    setContains('');
    setNotContains('');
    setPattern('');
    setResults([]);
  };

  return (
    <div>
      <div className="rounded-3xl bg-[#f3f3f3] p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#707070]">Word Length</label>
            <select value={length} onChange={e => setLength(e.target.value)} className="input-field !py-2.5 !text-sm">
              <option value="">Any length</option>
              {WORD_LENGTHS.map(l => <option key={l} value={l}>{l} letters</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#707070]">Starts With</label>
            <input type="text" value={startsWith} onChange={e => setStartsWith(e.target.value.toLowerCase())} placeholder="e.g. pre" className="input-field !py-2.5 !text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#707070]">Ends With</label>
            <input type="text" value={endsWith} onChange={e => setEndsWith(e.target.value.toLowerCase())} placeholder="e.g. tion" className="input-field !py-2.5 !text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#707070]">Contains</label>
            <input type="text" value={contains} onChange={e => setContains(e.target.value.toLowerCase())} placeholder="e.g. que" className="input-field !py-2.5 !text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#707070]">Does Not Contain</label>
            <input type="text" value={notContains} onChange={e => setNotContains(e.target.value.toLowerCase())} placeholder="e.g. x" className="input-field !py-2.5 !text-sm" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#707070]">Pattern (use _ for unknown)</label>
            <input type="text" value={pattern} onChange={e => setPattern(e.target.value.toLowerCase())} placeholder="e.g. a_p_e" className="input-field !py-2.5 !text-sm" />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-4 flex items-center gap-3">
            <button type="button" onClick={clearAll} className="text-xs font-medium text-[#707070] hover:text-[#141414]">Clear all</button>
            <span className="text-xs text-[#adadad]">&middot;</span>
            <span className="text-xs text-[#707070]">
              {loading ? 'Searching...' : `${results.length} word${results.length !== 1 ? 's' : ''} found`}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-3xl bg-[#f3f3f3] p-8 text-center text-[#707070]">Searching...</div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, 50).map(w => (
              <Link
                key={w.slug}
                href={`/words/${w.slug}`}
                className="group flex items-center justify-between rounded-2xl bg-[#f3f3f3] px-4 py-3 transition-all hover:bg-[#e8e8e8]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#141414]">{w.word}</span>
                    <span className="text-xs text-[#adadad]">{w.length} letters</span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-[#707070]">{w.definition}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-[#adadad]" />
              </Link>
            ))}
          </div>
        ) : hasFilters ? (
          <div className="rounded-3xl bg-[#f3f3f3] p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-[#adadad]" />
            <p className="mt-3 text-sm text-[#707070]">No words match your filters. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-[#f3f3f3] p-8 text-center">
            <p className="text-sm text-[#707070]">Use the filters above to find words.</p>
          </div>
        )}
      </div>
    </div>
  );
}
