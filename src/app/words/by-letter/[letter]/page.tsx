import { Metadata } from 'next';
import Link from 'next/link';
import { getWordsByLetter } from '@/lib/words';

export async function generateStaticParams() {
  return 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => ({ letter }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }): Promise<Metadata> {
  const { letter } = await params;
  const words = getWordsByLetter(letter);
  return {
    title: `Words Starting with ${letter.toUpperCase()} — ${words.length} Words | WhatWord`,
    description: `Find English words starting with ${letter.toUpperCase()}. Browse ${words.length} words with definitions.`,
    alternates: { canonical: `https://whatword.co.za/words/by-letter/${letter}` },
  };
}

export default async function StartingWithPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const words = getWordsByLetter(letter);

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
      <p className="text-sm text-[#adadad] mb-8">{words.length} words found</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {words.map(word => (
          <Link key={word.slug} href={`/words/${word.slug}`} className="word-card">
            <span className="text-sm font-semibold text-[#141414]">{word.word}</span>
            <span className="block text-xs text-[#adadad]">{word.partOfSpeech}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
