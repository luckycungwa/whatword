import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionaryEntries } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Antonyms Explorer — Find Words with Opposite Meanings',
  description: 'Browse antonyms for English words. Find words with opposite meanings.',
  alternates: { canonical: 'https://whatword.co.za/antonyms' },
};

export default async function AntonymsPage() {
  const words = await getDictionaryEntries();
  const wordsWithAntonyms = words.filter(w => w.antonyms.length > 0);

  return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <Breadcrumbs items={[{ label: 'Antonyms' }]} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-balance text-3xl font-bold leading-tight text-[#141414] sm:text-4xl">Antonyms Explorer</h1>
        <p className="mt-3 text-pretty text-[17px] leading-6 text-[#707070] sm:text-lg sm:leading-7">Find words with opposite meanings. Search any word for antonyms.</p>
      </div>

      {wordsWithAntonyms.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wordsWithAntonyms.map(word => (
            <Link key={word.slug} href={`/antonyms/${word.slug}`} className="group rounded-2xl border border-[#e0e0e0] bg-white p-5 transition-all hover:border-[#0066ff]/30">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-[#141414]">{word.word}</h2>
                  <p className="mt-1 line-clamp-1 text-sm text-[#707070]">{word.definitions.simple}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#e0e0e0] transition-transform group-hover:text-[#0066ff]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {word.antonyms.slice(0, 4).map(ant => (
                  <span key={ant} className="rounded-full bg-[#e0e0e0] px-2.5 py-1 text-xs font-medium text-[#141414]">{ant}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 text-center text-[#707070]">
          <p className="text-lg">No antonyms cached yet</p>
          <p className="mt-1 text-sm">Search for a word to see its antonyms</p>
        </div>
      )}
    </div>
  );
}
