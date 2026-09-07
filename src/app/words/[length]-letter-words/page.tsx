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
    description: `Find all ${len} letter English words. Browse ${words.length} ${len}-letter words with definitions, synonyms, and antonyms.`,
    alternates: { canonical: `https://whatword.co.za/words/${len}-letter-words` },
  };
}

export default async function WordLengthPage({ params }: { params: Promise<{ length: string }> }) {
  const { length } = await params;
  const len = parseInt(length);
  const words = getWordsByLength(len);

  return (
    <div className="container-app py-8">
      <nav className="text-xs text-gray-400 mb-6">
        <Link href="/" className="hover:text-black">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/words" className="hover:text-black">Words</Link>
        <span className="mx-1">/</span>
        <span className="text-black">{len} Letter Words</span>
      </nav>

      <h1 className="text-3xl font-bold text-black mb-2">{len} Letter Words</h1>
      <p className="text-sm text-gray-500 mb-8">{words.length} words found</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {words.map(word => (
          <Link
            key={word.slug}
            href={`/words/${word.slug}`}
            className="border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium text-black">{word.word}</span>
            <span className="block text-xs text-gray-400">{word.partOfSpeech}</span>
          </Link>
        ))}
      </div>

      {words.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-12">No {len}-letter words found.</p>
      )}
    </div>
  );
}
