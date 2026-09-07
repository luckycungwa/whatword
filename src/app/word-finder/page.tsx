import { Metadata } from 'next';
import Link from 'next/link';
import { Search, ArrowRight, Puzzle } from 'lucide-react';
import { findWords, getPopularSearches, WORD_LENGTHS } from '@/lib/word-finder';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WordFinderClient } from '@/components/WordFinderClient';

export const metadata: Metadata = {
  title: 'Word Finder — Find Words by Length, Pattern & Letters',
  description: 'Find English words by length, starting letter, ending letter, pattern, or known letters. Perfect for word games and puzzles.',
  alternates: { canonical: 'https://whatword.co.za/word-finder' },
  openGraph: {
    title: 'Word Finder — Find Words by Length, Pattern & Letters',
    description: 'Find English words by length, pattern, or known letters. Perfect for word games and puzzles.',
    url: 'https://whatword.co.za/word-finder',
  },
};

export default function WordFinderPage() {
  const popularSearches = getPopularSearches();
  const defaultResults = findWords({ length: 5 });

  const lengthPages = WORD_LENGTHS.map(len => ({
    length: len,
    count: findWords({ length: len }).length,
  }));

  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Word Finder' }]} />

      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-[#141414] sm:text-4xl">Word Finder</h1>
        <p className="mt-3 text-lg text-[#707070]">
          Find words by length, starting letter, pattern, or known letters.
        </p>
      </div>

      <div className="mt-8">
        <WordFinderClient />
      </div>

      {/* Popular Searches */}
      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">Popular Searches</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularSearches.map((search, i) => {
            const results = findWords(search.pattern);
            if (results.length === 0) return null;
            return (
              <div key={i} className="rounded-2xl border border-[#e0e0e0] bg-white p-4">
                <h3 className="text-sm font-semibold text-[#141414]">{search.label}</h3>
                <p className="mt-1 text-xs text-[#707070]">{results.length} words found</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {results.slice(0, 6).map(w => (
                    <Link key={w.slug} href={`/words/${w.slug}`} className="rounded-md bg-[#f3f3f3] px-2 py-1 text-xs font-medium text-[#707070] hover:bg-[#f3f3f3] hover:text-[#141414]">
                      {w.word}
                    </Link>
                  ))}
                  {results.length > 6 && <span className="px-2 py-1 text-xs text-[#adadad]">+{results.length - 6} more</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By Length */}
      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">Browse by Word Length</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {lengthPages.map(({ length, count }) => (
            <div key={length} className="rounded-2xl border border-[#e0e0e0] bg-white p-4 text-center">
              <div className="text-2xl font-bold text-[#141414]">{count}</div>
              <div className="mt-1 text-sm font-medium text-[#707070]">{length}-letter words</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
