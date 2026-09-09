import { Metadata } from 'next';
import Link from 'next/link';
import { finderQuery } from '@/lib/word-intelligence/service';
import { listPageDecision } from '@/lib/word-intelligence/seo-score';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ length: string }> }): Promise<Metadata> {
  const { length } = await params;
  const len = parseInt(length);
  const { total } = await finderQuery({ length: len, limit: 1 });
  const decision = listPageDecision(total);
  return {
    title: `${len} Letter Words — ${total} Words | WhatWord`,
    description: `Find all ${len}-letter English words. Browse ${total} ${len}-letter words with definitions, anagrams and word-game scores.`,
    alternates: { canonical: `https://whatword.co.za/words/by-length/${len}` },
    robots: decision === 'noindex' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function WordLengthPage({ params }: { params: Promise<{ length: string }> }) {
  const { length } = await params;
  const len = parseInt(length);
  const { hits, total } = await finderQuery({ length: len, limit: 200 });

  return (
    <div className="container-app py-8">
      <nav className="text-xs text-[#adadad] mb-6">
        <Link href="/" className="hover:text-[#707070]">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/words" className="hover:text-[#707070]">Words</Link>
        <span className="mx-1">/</span>
        <span className="text-[#707070]">{len} Letter Words</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-[#141414] mb-2">{len} Letter Words</h1>
      <p className="text-sm text-[#adadad] mb-8">{total} words found</p>

      {hits.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {hits.map((word) => (
            <Link key={word.word} href={`/words/${word.word}`} className="word-card">
              <span className="text-sm font-semibold text-[#141414]">{word.word}</span>
              <span className="block text-xs text-[#adadad]">
                {word.pos || ''} · {word.scrabbleScore} pts
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-[#707070]">
          <p>No {len}-letter words found</p>
          <p className="mt-1 text-sm">Try the <Link href="/word-finder" className="underline">Word Finder</Link> instead</p>
        </div>
      )}
    </div>
  );
}
