import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolSolverClient } from '@/components/ToolSolverClient';

export const metadata: Metadata = {
  title: 'Word Unscrambler — Make Words From Letters',
  description:
    'Enter your tiles or letters to find every word you can build — perfect for Scrabble, Words With Friends and crosswords. With letter scores.',
  alternates: { canonical: 'https://whatword.co.za/word-unscrambler' },
};

const solverSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'WhatWord Word Unscrambler',
  url: 'https://whatword.co.za/word-unscrambler',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'ZAR' },
};

export default async function WordUnscramblerPage({
  searchParams,
}: {
  searchParams?: Promise<{ letters?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <Breadcrumbs items={[{ label: 'Word Unscrambler' }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(solverSchema) }} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-balance text-3xl font-bold leading-tight text-[#141414] sm:text-4xl">Word Unscrambler</h1>
        <p className="mt-3 text-pretty text-[17px] leading-6 text-[#707070] sm:text-lg sm:leading-7">
          Enter your letters — we find every word you can build from them, longest first. Try{' '}
          <span className="font-semibold text-[#141414]">aeplp</span>.
        </p>
      </div>
      <div className="mt-8">
        <ToolSolverClient mode="unscramble" initialLetters={params?.letters || ''} />
      </div>
      <section className="mx-auto mt-12 max-w-2xl text-sm leading-relaxed text-[#707070]">
        <h2 className="mb-2 text-base font-semibold text-[#141414]">How it works</h2>
        <p>
          The engine checks which graph words fit inside your letter multiset, then ranks longest-first with
          Scrabble scores — so the highest-value plays surface naturally.
        </p>
      </section>
    </div>
  );
}
