import { Metadata } from 'next';
import Link from 'next/link';
import { getDictionaryEntries, getDailyChallenge } from '@/lib/words';
import { SearchBar } from '@/components/SearchBar';
import { AuraBackground } from '@/components/AuraBackground';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'WhatWord — Interactive English Dictionary, Word Finder & Vocabulary Games',
  description:
    'Search English words, find words by pattern, build vocabulary with quizzes, and play daily word games. Your complete word utility platform.',
  alternates: { canonical: 'https://whatword.co.za' },
};

export default async function HomePage() {
  const allWords = await getDictionaryEntries();
  const dailyWord = await getDailyChallenge();

  const wordLengths = [3, 4, 5, 6, 7, 8].map(len => ({
    length: len,
    count: allWords.filter(w => w.slug.length === len).length,
  }));

  const letterCounts = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => ({
    letter,
    count: allWords.filter(w => w.slug.startsWith(letter)).length,
  }));

  const popularWords = allWords
    .filter(w => w.frequency === 'very-common')
    .sort((a, b) => Number(Boolean(b.definitions.simple)) - Number(Boolean(a.definitions.simple)))
    .slice(0, 12);

  return (
    <AuraBackground>
      {/* Hero — generous whitespace, no extra top pad (layout handles fixed header) */}
      <section className="relative pb-12 pt-6 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-[#707070] shadow-sm backdrop-blur sm:text-sm">
              {allWords.length.toLocaleString()} words indexed
            </div>
            <h1 className="text-balance font-display text-[2.5rem] font-bold leading-none tracking-tight text-[#141414] sm:text-6xl lg:text-7xl">
              What<span className="text-[#0066ff]">Word</span>?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[17px] leading-6 text-[#707070] sm:mt-5 sm:text-xl sm:leading-7">
              Definitions, pronunciation, word finder, and games. Your complete English dictionary.
            </p>
          </div>

          {/* Search — unified field */}
          <div className="mt-8 sm:mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Word of the Day — card with field fill, no shadows */}
      <section className="container-app pb-12">
        <Link href={`/words/${dailyWord.slug}`} className="group block rounded-3xl bg-[#f3f3f3] p-6 transition-all hover:bg-[#e8e8e8] sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#707070]">Word of the Day</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-[#141414] sm:text-4xl">{dailyWord.word}</h2>
              {dailyWord.phonetic && <p className="mt-1 text-sm text-[#adadad]">{dailyWord.phonetic}</p>}
              <p className="mt-3 max-w-lg text-[#707070]">{dailyWord.definitions.simple}</p>
            </div>
            <ArrowRight className="mt-2 h-5 w-5 text-[#adadad] transition-transform group-hover:translate-x-1 group-hover:text-[#141414]" />
          </div>
        </Link>
      </section>

      {/* Quick Tools — pill cards, no shadows */}
      <section className="container-app pb-12">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link href="/word-finder" className="group card hover:bg-[#f3f3f3]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#adadad]">Word Finder</p>
            <p className="mt-2 text-sm text-[#707070]">Find words by pattern</p>
            <p className="mt-1 text-xs text-[#adadad]">_A_E &rarr; make, lake, gate</p>
          </Link>
          <Link href="/games" className="group card hover:bg-[#f3f3f3]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#adadad]">Word Games</p>
            <p className="mt-2 text-sm text-[#707070]">Quiz, scramble, spelling</p>
            <p className="mt-1 text-xs text-[#adadad]">Challenge yourself daily</p>
          </Link>
          <Link href="/learn" className="group card hover:bg-[#f3f3f3]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#adadad]">Learn</p>
            <p className="mt-2 text-sm text-[#707070]">Vocabulary lessons</p>
            <p className="mt-1 text-xs text-[#adadad]">Beginner to advanced</p>
          </Link>
        </div>
      </section>

      {/* Words by Length — pill grid */}
      <section className="container-app pb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Words by Length</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {wordLengths.map(({ length, count }) => (
            <Link
              key={length}
              href={`/words/by-length/${length}`}
              className="group card-soft text-center hover:bg-[#e8e8e8]"
            >
              <span className="text-2xl font-bold text-[#141414]">{length}</span>
              <span className="mt-1 block text-[10px] uppercase tracking-wider text-[#adadad]">letters</span>
              <span className="mt-0.5 block text-xs text-[#adadad]">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Letter — pill buttons */}
      <section className="container-app pb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Browse by Letter</h2>
        <div className="flex flex-wrap gap-2">
          {letterCounts.map(({ letter, count }) => (
            <Link
              key={letter}
              href={`/words/by-letter/${letter}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f3f3] text-sm font-semibold text-[#707070] transition-all hover:bg-[#141414] hover:text-white"
            >
              {letter.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Words — pill tags */}
      <section className="container-app pb-12">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Popular Words</h2>
        <div className="flex flex-wrap gap-2">
          {popularWords.map(word => (
            <Link
              key={word.slug}
              href={`/words/${word.slug}`}
              className="badge hover:bg-[#141414] hover:text-white transition-all"
            >
              {word.word}
            </Link>
          ))}
        </div>
      </section>

      {/* About — minimal */}
      <section className="container-app py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-xl font-bold text-[#141414]">About WhatWord</h2>
          <p className="mt-3 text-sm leading-relaxed text-[#707070]">
            WhatWord is a free English vocabulary platform. Search {allWords.length.toLocaleString()} words with definitions, phonetics, synonyms and antonyms. Use the word finder to discover words by pattern, take vocabulary quizzes, and play daily word games.
          </p>
          <p className="mt-4 text-xs text-[#adadad]">
            &copy; {new Date().getFullYear()} WhatWord &middot; Built by Lucky Cungwa
          </p>
        </div>
      </section>
    </AuraBackground>
  );
}
