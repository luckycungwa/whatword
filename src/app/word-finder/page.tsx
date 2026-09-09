import { Metadata } from 'next';
import Link from 'next/link';
import { getPopularSearches, WORD_LENGTHS } from '@/lib/word-finder';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { WordFinderClient } from '@/components/WordFinderClient';

export const metadata: Metadata = {
  title: 'Word Finder — Find Words by Length, Pattern & Letters',
  description: 'Find English words by length, starting letter, ending letter, pattern, or known letters.',
  alternates: { canonical: 'https://whatword.co.za/word-finder' },
};

export default function WordFinderPage() {
  const popularSearches = getPopularSearches();

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

      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">Popular Searches</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popularSearches.map((search, i) => (
            <div key={i} className="rounded-2xl border border-[#e0e0e0] bg-white p-4">
              <h3 className="text-sm font-semibold text-[#141414]">{search.label}</h3>
              <p className="mt-1 text-xs text-[#707070]">Search for this pattern</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">Browse by Word Length</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {WORD_LENGTHS.map(len => (
            <Link key={len} href={`/words/by-length/${len}`} className="rounded-2xl border border-[#e0e0e0] bg-white p-4 text-center transition-all hover:border-[#0066ff]/30">
              <div className="text-2xl font-bold text-[#141414]">{len}</div>
              <div className="mt-1 text-sm font-medium text-[#707070]">{len}-letter words</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
