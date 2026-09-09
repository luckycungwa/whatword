import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolSolverClient } from '@/components/ToolSolverClient';

export const metadata: Metadata = {
  title: 'Anagram Solver — Unscramble Letters Instantly',
  description:
    'Enter any letters to find all valid anagrams — e.g. LISTEN gives SILENT, ENLIST, TINSEL. Powered by the WhatWord word graph with Scrabble scores.',
  alternates: { canonical: 'https://whatword.co.za/anagram-solver' },
};

const solverSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WhatWord Anagram Solver',
  url: 'https://whatword.co.za/anagram-solver',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'ZAR' },
};

export default function AnagramSolverPage({
  searchParams,
}: {
  searchParams?: Promise<{ letters?: string }>;
}) {
  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Anagram Solver' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(solverSchema) }} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-[#141414] sm:text-4xl">Anagram Solver</h1>
        <p className="mt-3 text-lg text-[#707070]">
          Type any letters — we find every word you can make from exactly those letters. Try{' '}
          <span className="font-semibold text-[#141414]">listen</span>.
        </p>
      </div>
      <div className="mt-8">
        <ToolSolverLoader mode="anagram" searchParams={searchParams} />
      </div>
      <section className="mx-auto mt-12 max-w-2xl text-sm leading-relaxed text-[#707070]">
        <h2 className="mb-2 text-base font-semibold text-[#141414]">How it works</h2>
        <p>
          Every word in our graph carries an alphabetical signature (LISTEN → EILNST). Words sharing a
          signature are anagrams — so results are exact, not guessed. Scores shown are Scrabble letter values.
        </p>
      </section>
    </div>
  );
}

async function ToolSolverLoader({
  mode,
  searchParams,
}: {
  mode: 'anagram';
  searchParams?: Promise<{ letters?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  return <ToolSolverClient mode={mode} initialLetters={params?.letters || ''} />;
}
