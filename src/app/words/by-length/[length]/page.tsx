import { Metadata } from 'next';
import Link from 'next/link';
import { getWordsByLength } from '@/lib/words';

export async function generateStaticParams() {
  return Array.from({ length: 12 }, (_, i) => ({ length: String(i + 3) }));
}

export async function generateMetadata({ params }: { params: Promise<{ length: string }> }): Promise<Metadata> {
  const { length } = await params;
  const len = parseInt(length);
  const words = getWordsByLength(len);
  return {
    title: `${len} Letter Words — ${words.length} Words | WhatWord`,
    description: `Find all ${len} letter English words. Browse ${words.length} ${len}-letter words with definitions.`,
    alternates: { canonical: `https://whatword.co.za/words/by-length/${len}` },
  };
}

export default async function WordLengthPage({ params }: { params: Promise<{ length: string }> }) {
  const { length } = await params;
  const len = parseInt(length);
  const words = getWordsByLength(len);

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
