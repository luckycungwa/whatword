import { Metadata } from 'next';
import Link from 'next/link';
import { finderQuery } from '@/lib/word-intelligence/service';
import { listPageDecision } from '@/lib/word-intelligence/seo-score';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }): Promise<Metadata> {
  const { letter } = await params;
  const { total } = await finderQuery({ startsWith: letter, limit: 1 });
  const decision = listPageDecision(total);
  return {
    title: `Words Starting with ${letter.toUpperCase()} — ${total} Words | WhatWord`,
    description: `Find English words starting with ${letter.toUpperCase()}. Browse ${total} words with definitions, anagrams and word-game scores.`,
    alternates: { canonical: `https://whatword.co.za/words/by-letter/${letter}` },
    robots: decision === 'noindex' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function StartingWithPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const { hits, total } = await finderQuery({ startsWith: letter, limit: 200 });

  return (
    <div className="container-app py-8">
      <nav className="text-xs text-[#adadad] mb-6">
        <Link href="/" className="hover:text-[#707070]">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/words" className="hover:text-[#707070]">Words</Link>
        <span className="mx-1">/</span>
        <span className="text-[#707070]">Starting with {letter.toUpperCase()}</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-[#141414] mb-2">
        Words Starting with {letter.toUpperCase()}
      </h1>
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
          <p>No words starting with {letter.toUpperCase()} found</p>
          <p className="mt-1 text-sm">Try the <Link href="/word-finder" className="underline">Word Finder</Link> instead</p>
        </div>
      )}
    </div>
  );
}
