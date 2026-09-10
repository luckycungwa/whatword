import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getDictionaryEntries, categories } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Vocabulary Builder — Learn English Words by Level',
  description: 'Build your English vocabulary with structured learning paths. Learn words by difficulty level, category, and topic.',
  alternates: { canonical: 'https://whatword.co.za/learn' },
};

const levels = [
  { level: 'A1', label: 'Beginner', description: 'Basic everyday words', color: 'green' },
  { level: 'A2', label: 'Elementary', description: 'Common words for daily use', color: 'green' },
  { level: 'B1', label: 'Intermediate', description: 'Words for work and school', color: 'yellow' },
  { level: 'B2', label: 'Upper-Intermediate', description: 'Complex everyday topics', color: 'yellow' },
  { level: 'C1', label: 'Advanced', description: 'Fluent, nuanced vocabulary', color: 'red' },
  { level: 'C2', label: 'Proficiency', description: 'Near-native vocabulary', color: 'red' },
];

export default async function LearnPage() {
  const allWords = await getDictionaryEntries();

  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Learn' }]} />

      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-[#141414] sm:text-4xl">Vocabulary Builder</h1>
        <p className="mt-3 text-lg text-[#707070]">Learn English words organised by difficulty level and category.</p>
      </div>

      <div className="mt-10">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">By Level</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map(({ level, label, description }) => {
            const count = allWords.filter(w => w.vocabularyLevel === level).length;
            return (
              <Link key={level} href={`/learn/${level.toLowerCase()}`} className="group rounded-2xl border border-[#e0e0e0] bg-white p-5 transition-all hover:border-[#0066ff]/30">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#f3f3f3] px-2.5 py-1 text-xs font-bold text-[#707070]">{level}</span>
                      <span className="font-semibold text-[#141414]">{label}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#707070]">{description}</p>
                    <p className="mt-1 text-xs text-[#adadad]">{count} words</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#e0e0e0] transition-transform group-hover:text-[#0066ff]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">By Difficulty</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(['beginner', 'intermediate', 'advanced'] as const).map(diff => {
            const count = allWords.filter(w => w.difficulty === diff).length;
            return (
              <Link key={diff} href={`/learn/${diff}`} className="group rounded-2xl border border-[#e0e0e0] bg-white p-5 transition-all hover:border-[#0066ff]/30">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-[#f3f3f3] px-2.5 py-1 text-xs font-bold text-[#707070] capitalize">{diff}</span>
                    <p className="mt-2 text-sm text-[#707070]">{count} words to learn</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-[#e0e0e0] transition-transform group-hover:text-[#0066ff]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-lg font-semibold text-[#141414]">By Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(cat => {
            const count = allWords.filter(w => w.category === cat).length;
            return (
              <Link key={cat} href={`/learn/${cat.toLowerCase().replace(/\s+/g, '-')}`} className="rounded-2xl border border-[#e0e0e0] bg-white p-4 text-center transition-all hover:border-[#0066ff]/30">
                <div className="text-xl font-bold text-[#141414]">{count}</div>
                <div className="mt-1 text-xs font-medium text-[#707070]">{cat}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
