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
  {
    href: '/games/whatword',
    icon: Lightbulb,
    label: 'WhatWord Challenge',
    description: 'Guess the word from a series of clues. Test your vocabulary knowledge.',
    accent: '#fbbf24',
    accentBg: 'bg-yellow-50',
  },
  {
    href: '/games/definition-challenge',
    icon: Brain,
    label: 'Definition Challenge',
    description: 'Match words to their correct definitions. How many can you get right?',
    accent: '#34d399',
    accentBg: 'bg-emerald-50',
  },
  {
    href: '/games/word-scramble',
    icon: Zap,
    label: 'Word Scramble',
    description: 'Unscramble the letters to find the hidden word. Race against time.',
    accent: '#60a5fa',
    accentBg: 'bg-blue-50',
  },
  {
    href: '/games/spelling',
    icon: SpellCheck,
    label: 'Spelling Challenge',
    description: 'Hear the word and type the correct spelling. Perfect your spelling skills.',
    accent: '#f472b6',
    accentBg: 'bg-pink-50',
  },
];

export default function GamesPage() {
  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Games' }]} />

      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-game-washed-light px-4 py-1.5 text-xs font-semibold text-game">
          <Trophy className="h-3.5 w-3.5" />
          Daily Challenges
        </div>
        <h1 className="text-3xl font-bold text-ink sm:text-4xl">Word Games</h1>
        <p className="mt-3 text-lg text-muted">
          Play daily word games to sharpen your vocabulary and have fun while learning.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {games.map((game, idx) => (
          <Link
            key={game.href}
            href={game.href}
            className="group relative rounded-2xl border border-hairline bg-canvas p-6 transition-all duration-300 hover:border-game/40 hover:shadow-lg hover:shadow-game/10"
          >
            {/* Accent glow effect */}
            <div
              className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-10 blur-xl"
              style={{ backgroundColor: game.accent }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${game.accentBg}`}
                style={{
                  borderColor: game.accent,
                  borderWidth: '1px',
                }}
              >
                <game.icon className="h-6 w-6" style={{ color: game.accent }} />
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-ink transition-colors duration-300 group-hover:text-game">
                {game.label}
              </h2>

              {/* Description */}
              <p className="mt-2 text-sm leading-relaxed text-muted">{game.description}</p>

              {/* CTA */}
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300" style={{ color: game.accent }}>
                Play now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Daily Challenge Section */}
      <div className="mt-12 overflow-hidden rounded-2xl border border-game/20 bg-gradient-to-br from-game-washed-light via-white to-game/5 p-8 text-center transition-all duration-300 hover:border-game/40 hover:shadow-lg hover:shadow-game/10">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-game/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-game/5 blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-game-light">
            <Gamepad2 className="h-7 w-7 text-game" />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-ink">Daily Challenge</h2>
          <p className="mt-2 text-muted">A new challenge every day. Can you keep your streak going?</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/games/whatword"
              className="rounded-2xl bg-game px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-game/30 transition-all duration-300 hover:bg-game-dark hover:shadow-lg hover:shadow-game-dark/40 active:scale-95"
            >
              Start Today&apos;s Challenge
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Games Available', value: '4' },
          { label: 'Daily Streak', value: '0' },
          { label: 'Total Points', value: '0' },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl border border-hairline bg-canvas-soft p-6 text-center transition-all duration-300 hover:border-game/20"
          >
            <p className="text-sm font-medium text-muted">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-game">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
