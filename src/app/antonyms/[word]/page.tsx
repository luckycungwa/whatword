import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWord } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ word: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { word: slug } = await params;
  const word = await getWord(slug);
  if (!word) return { title: 'Word Not Found' };
  return {
    title: `Antonyms of ${word.word} — Words with Opposite Meanings`,
    description: `Find antonyms and words with opposite meanings to "${word.word}".`,
    alternates: { canonical: `https://whatword.co.za/antonyms/${slug}` },
  };
}

export default async function AntonymWordPage({ params }: Props) {
  const { word: slug } = await params;
  const word = await getWord(slug);
  if (!word) notFound();

  return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <Breadcrumbs items={[{ label: 'Antonyms', href: '/antonyms' }, { label: word.word }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-[#141414]">
          Antonyms of <span className="text-[#141414]">{word.word}</span>
        </h1>
        <p className="mt-3 text-lg text-[#707070]">{word.definitions.simple}</p>

        {word.antonyms.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-[#e0e0e0] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#141414]">Words with opposite meaning</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {word.antonyms.map(ant => (
                <Link key={ant} href={`/words/${ant.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="flex items-center justify-between rounded-2xl border border-[#f0f0f0] bg-[#f3f3f3] px-4 py-3 transition-colors hover:bg-[#e8e8e8]">
                  <span className="font-medium text-[#141414]">{ant}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#adadad]" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#e0e0e0] bg-white p-6 text-center text-[#707070]">
            No antonyms found for this word
          </div>
        )}

        <div className="mt-8">
          <Link href={`/words/${slug}`} className="text-sm font-medium text-[#0066ff] hover:underline">View full word page →</Link>
        </div>
      </div>
    </div>
  );
}
