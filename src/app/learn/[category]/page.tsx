import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllWords, getWordsByDifficulty, getWordsByLevel, categories } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const levels = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'beginner', 'intermediate', 'advanced'];
  const catSlugs = categories.map(c => c.toLowerCase().replace(/\s+/g, '-'));
  return [...levels, ...catSlugs].map(category => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const title = category.toUpperCase().replace(/-/g, ' ');
  return {
    title: `${title} — Vocabulary Learning`,
    description: `Learn ${title} English vocabulary. Browse words organised by this level.`,
    alternates: { canonical: `https://whatword.co.za/learn/${category}` },
  };
}

export default async function LearnCategoryPage({ params }: Props) {
  const { category } = await params;
  const allWords = getAllWords();

  const isLevel = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'].includes(category);
  const isDifficulty = ['beginner', 'intermediate', 'advanced'].includes(category);

  let words;
  let title;
  if (isLevel) {
    const level = category.toUpperCase();
    words = getWordsByLevel(level);
    title = `Level ${level} Vocabulary`;
  } else if (isDifficulty) {
    words = getWordsByDifficulty(category as 'beginner' | 'intermediate' | 'advanced');
    title = `${category.charAt(0).toUpperCase() + category.slice(1)} Vocabulary`;
  } else {
    const catName = categories.find(c => c.toLowerCase().replace(/\s+/g, '-') === category);
    words = catName ? allWords.filter(w => w.category === catName) : [];
    title = catName || category;
  }

  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Learn', href: '/learn' }, { label: title }]} />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-[#141414] sm:text-4xl">{title}</h1>
        <p className="mt-3 text-lg text-[#707070]">{words.length} words to learn.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {words.map(word => (
          <Link key={word.slug} href={`/words/${word.slug}`} className="group flex items-start justify-between rounded-2xl border border-[#e0e0e0] bg-white p-4 transition-all hover:border-[#e0e0e0]">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#141414] group-hover:text-[#141414]">{word.word}</span>
                <span className="text-xs text-[#adadad]">{word.vocabularyLevel}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-[#707070]">{word.definitions.simple}</p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#e0e0e0] transition-transform group-hover:text-[#141414]" />
          </Link>
        ))}
      </div>

      {words.length === 0 && (
        <div className="mt-8 rounded-2xl border border-[#e0e0e0] bg-white p-8 text-center">
          <p className="text-sm text-[#707070]">No words found for this category.</p>
          <Link href="/learn" className="mt-3 inline-block text-sm font-medium text-[#141414] hover:text-[#141414]">Browse all levels →</Link>
        </div>
      )}
    </div>
  );
}
