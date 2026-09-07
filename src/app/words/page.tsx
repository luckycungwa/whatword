import { Metadata } from 'next';
import Link from 'next/link';
import { Search, ArrowRight, Filter } from 'lucide-react';
import { getAllWords, categories } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'All English Words — Browse Definitions, Pronunciation & Etymology',
  description: 'Browse our complete collection of English words with definitions, pronunciation, etymology, synonyms, and interactive quizzes.',
  alternates: { canonical: 'https://whatword.co.za/words' },
  openGraph: {
    title: 'All English Words — Browse Definitions, Pronunciation & Etymology',
    description: 'Browse our complete word collection with definitions, pronunciation, etymology, and interactive quizzes.',
    url: 'https://whatword.co.za/words',
  },
};

export default function WordsPage() {
  const words = getAllWords();
  const groupedByCategory = categories.map(cat => ({
    category: cat,
    words: words.filter(w => w.category === cat),
  })).filter(g => g.words.length > 0);

  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Words' }]} />

      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-[#141414] sm:text-4xl">All Words</h1>
        <p className="mt-3 text-lg text-[#707070]">
          Browse our complete word collection. Each word includes definition, pronunciation, etymology, and interactive quiz.
        </p>
      </div>

      {/* Quick stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Words', value: words.length },
          { label: 'Beginner', value: words.filter(w => w.difficulty === 'beginner').length },
          { label: 'Intermediate', value: words.filter(w => w.difficulty === 'intermediate').length },
          { label: 'Advanced', value: words.filter(w => w.difficulty === 'advanced').length },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl border border-[#e0e0e0] bg-white p-4 text-center">
            <div className="text-2xl font-bold text-[#141414]">{stat.value}</div>
            <div className="mt-1 text-xs font-medium text-[#707070]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* All words grid */}
      <div className="mt-10">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">Browse All Words</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((word) => (
            <Link
              key={word.slug}
              href={`/words/${word.slug}`}
              className="group flex items-start justify-between rounded-2xl border border-[#e0e0e0] bg-white p-4 transition-all hover:border-[#e0e0e0]"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#141414] group-hover:text-[#141414]">{word.word}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                    word.difficulty === 'beginner' ? 'bg-[#f3f3f3] text-[#707070]' :
                    word.difficulty === 'intermediate' ? 'bg-[#e0e0e0] text-[#141414]' :
                    'bg-[#e0e0e0] text-[#141414]'
                  }`}>{word.difficulty}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-[#707070]">{word.definitions.simple}</p>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-[#adadad]">
                  <span>{word.partOfSpeech}</span>
                  <span>·</span>
                  <span>{word.category}</span>
                </div>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#e0e0e0] transition-transform group-hover:translate-x-0.5 group-hover:text-[#141414]" />
            </Link>
          ))}
        </div>
      </div>

      {/* By category */}
      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">Browse by Category</h2>
        <div className="space-y-8">
          {groupedByCategory.map(group => (
            <div key={group.category}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#707070]">{group.category}</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.words.map(word => (
                  <Link
                    key={word.slug}
                    href={`/words/${word.slug}`}
                    className="flex items-center justify-between rounded-2xl border border-[#f0f0f0] bg-[#f3f3f3] px-4 py-3 text-sm transition-colors hover:bg-[#f3f3f3] hover:text-[#141414]"
                  >
                    <span className="font-medium">{word.word}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#adadad]" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
