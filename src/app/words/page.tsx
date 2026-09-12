import { Metadata } from 'next';
import { getDictionaryEntries } from '@/lib/words';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import DictionaryClient, { type DictionaryRow } from './DictionaryClient';

export const metadata: Metadata = {
  title: 'English Dictionary — Browse All Words, Definitions & Pronunciation',
  description: 'Browse our complete English dictionary with definitions, pronunciation, etymology, synonyms, and interactive quizzes.',
  alternates: { canonical: 'https://whatword.co.za/words' },
};

export default async function WordsPage() {
  const words = await getDictionaryEntries();

  const verified = words.filter(w => w.definitions.simple).length;

  // Slim rows for the client: full WordEntry objects would bloat the RSC payload.
  const rows: DictionaryRow[] = words.map((w) => ({
    slug: w.slug,
    word: w.word,
    partOfSpeech: w.partOfSpeech,
    difficulty: w.difficulty,
    vocabularyLevel: w.vocabularyLevel,
    hasDefinition: Boolean(w.definitions.simple),
    simple: w.definitions.simple || '',
  }));
  const stats = {
    total: words.length,
    verified,
    beginner: words.filter(w => w.difficulty === 'beginner').length,
    intermediate: words.filter(w => w.difficulty === 'intermediate').length,
    advanced: words.filter(w => w.difficulty === 'advanced').length,
  };

  return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <Breadcrumbs items={[{ label: 'Dictionary' }]} />

      <div className="mx-auto max-w-2xl">
        <h1 className="text-balance text-3xl font-bold leading-tight text-[#141414] sm:text-4xl">English Dictionary</h1>
        <p className="mt-3 text-pretty text-[17px] leading-6 text-[#707070] sm:text-lg sm:leading-7">
          {stats.total > 0
            ? <>Search {stats.total.toLocaleString()} words in the graph{stats.verified > 0 && <> — {stats.verified.toLocaleString()} with verified definitions</>}.</>
            : <>Type any word above to look it up. Every word is fetched live from the dictionary.</>
          }
        </p>
      </div>

      {stats.total > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Words in graph', value: stats.total },
            { label: 'Verified definitions', value: stats.verified },
            { label: 'Beginner', value: stats.beginner },
            { label: 'Advanced', value: stats.advanced },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl border border-[#e0e0e0] bg-white p-4 text-center">
              <div className="text-2xl font-bold text-[#141414]">{stat.value.toLocaleString()}</div>
              <div className="mt-1 text-xs font-medium text-[#707070]">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <DictionaryClient words={rows} />
      </div>
    </div>
  );
}
