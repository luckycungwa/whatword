import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllSlugs, getWordBySlug } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ word: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map(word => ({ word }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { word: slug } = await params;
  const word = getWordBySlug(slug);
  if (!word) return { title: 'Word Not Found' };
  return {
    title: `Synonyms of ${word.word} — Words with Similar Meanings`,
    description: `Find synonyms and alternative words with similar meanings to "${word.word}". Explore related vocabulary and usage examples.`,
    alternates: { canonical: `https://whatword.co.za/synonyms/${slug}` },
  };
}

export default async function SynonymWordPage({ params }: Props) {
  const { word: slug } = await params;
  const word = getWordBySlug(slug);
  if (!word) notFound();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://whatword.co.za' },
      { '@type': 'ListItem', position: 2, name: 'Synonyms', item: 'https://whatword.co.za/synonyms' },
      { '@type': 'ListItem', position: 3, name: word.word, item: `https://whatword.co.za/synonyms/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container-app py-8 md:py-12">
        <Breadcrumbs items={[{ label: 'Synonyms', href: '/synonyms' }, { label: word.word }]} />
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-[#141414]">
            Synonyms of <span className="text-[#141414]">{word.word}</span>
          </h1>
          <p className="mt-3 text-lg text-[#707070]">{word.definitions.simple}</p>

          <div className="mt-8 rounded-2xl border border-[#e0e0e0] bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#141414]">Words with similar meaning</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {word.synonyms.map(syn => (
                <div key={syn} className="flex items-center justify-between rounded-2xl border border-[#f0f0f0] bg-[#f3f3f3] px-4 py-3 transition-colors hover:bg-[#f3f3f3]">
                  <span className="font-medium text-[#141414]">{syn}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#adadad]" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#e0e0e0] bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-[#141414]">About this word</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-[#707070]">Part of Speech</dt><dd className="font-medium text-[#141414]">{word.partOfSpeech}</dd></div>
              <div className="flex justify-between"><dt className="text-[#707070]">Difficulty</dt><dd className="font-medium capitalize text-[#141414]">{word.difficulty}</dd></div>
              <div className="flex justify-between"><dt className="text-[#707070]">Category</dt><dd className="font-medium text-[#141414]">{word.category}</dd></div>
            </dl>
            <div className="mt-4">
              <Link href={`/words/${slug}`} className="text-sm font-medium text-[#141414] hover:text-[#141414]">View full word page →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
