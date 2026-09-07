import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Lightbulb, Brain, Zap, SpellCheck, Trophy, Gamepad2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Word Games — Play Vocabulary Quizzes & Word Puzzles',
  description: 'Play interactive word games to build vocabulary. Challenge yourself with definition quizzes, word scrambles, and spelling challenges.',
  alternates: { canonical: 'https://whatword.co.za/games' },
  openGraph: {
    title: 'Word Games — Play Vocabulary Quizzes & Word Puzzles',
    description: 'Play interactive word games to build vocabulary. Definition quizzes, word scrambles, and spelling challenges.',
    url: 'https://whatword.co.za/games',
  },
};

const games = [
  { href: '/games/whatword', icon: Lightbulb, label: 'WhatWord Challenge', description: 'Guess the word from a series of clues. Test your vocabulary knowledge.' },
  { href: '/games/definition-challenge', icon: Brain, label: 'Definition Challenge', description: 'Match words to their correct definitions. How many can you get right?' },
  { href: '/games/word-scramble', icon: Zap, label: 'Word Scramble', description: 'Unscramble the letters to find the hidden word. Race against time.' },
  { href: '/games/spelling', icon: SpellCheck, label: 'Spelling Challenge', description: 'Hear the word and type the correct spelling. Perfect your spelling skills.' },
];

export default function GamesPage() {
  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Games' }]} />

      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#f3f3f3] px-4 py-1.5 text-xs font-medium text-[#707070]">
          <Trophy className="h-3.5 w-3.5" />
          Daily Challenges
        </div>
        <h1 className="text-3xl font-bold text-black sm:text-4xl">Word Games</h1>
        <p className="mt-3 text-lg text-[#707070]">Play daily word games to sharpen your vocabulary and have fun while learning.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {games.map(game => (
          <Link key={game.href} href={game.href} className="group rounded-2xl border border-[#f0f0f0] bg-white p-6 transition-all hover:border-[#adadad]">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f3f3f3]">
              <game.icon className="h-6 w-6 text-black" />
            </div>
            <h2 className="text-xl font-bold text-black group-hover:text-[#707070]">{game.label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#707070]">{game.description}</p>
            <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-black group-hover:text-[#707070]">
              Play now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Daily Challenge */}
      <div className="mt-12 rounded-2xl border border-[#f0f0f0] bg-[#f3f3f3] p-8 text-center">
        <Gamepad2 className="mx-auto h-10 w-10 text-black" />
        <h2 className="mt-4 text-2xl font-bold text-black">Daily Challenge</h2>
        <p className="mt-2 text-[#707070]">A new challenge every day. Can you keep your streak going?</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/games/whatword" className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#141414]">
            Start Today&apos;s Challenge
          </Link>
        </div>
      </div>
    </div>
  );
}
