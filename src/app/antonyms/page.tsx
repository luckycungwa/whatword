import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Target } from 'lucide-react';
import { getAllWords } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Antonyms Explorer — Find Words with Opposite Meanings',
  description: 'Browse antonyms for English words. Find words with opposite meanings, organised by category and difficulty.',
  alternates: { canonical: 'https://whatword.co.za/antonyms' },
  openGraph: {
    title: 'Antonyms Explorer — Find Words with Opposite Meanings',
    description: 'Browse antonyms for English words. Find words with opposite meanings.',
    url: 'https://whatword.co.za/antonyms',
  },
};

export default function AntonymsPage() {
  const words = getAllWords();
  const wordsWithAntonyms = words.filter(w => w.antonyms.length > 0);

  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Antonyms' }]} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-[#141414] sm:text-4xl">Antonyms Explorer</h1>
        <p className="mt-3 text-lg text-[#707070]">Find words with opposite meanings. Click any word to explore its full page.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wordsWithAntonyms.map(word => (
          <Link key={word.slug} href={`/antonyms/${word.slug}`} className="group rounded-2xl border border-[#e0e0e0] bg-white p-5 transition-all hover:border-[#e0e0e0]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-[#141414] group-hover:text-[#141414]">{word.word}</h2>
                <p className="mt-1 line-clamp-1 text-sm text-[#707070]">{word.definitions.simple}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#e0e0e0] transition-transform group-hover:text-[#141414]" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {word.antonyms.slice(0, 4).map(ant => (
                <span key={ant} className="rounded-full bg-[#e0e0e0] px-2.5 py-1 text-xs font-medium text-[#141414]">{ant}</span>
              ))}
              {word.antonyms.length > 4 && <span className="rounded-full bg-[#f0f0f0] px-2.5 py-1 text-xs text-[#707070]">+{word.antonyms.length - 4}</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
