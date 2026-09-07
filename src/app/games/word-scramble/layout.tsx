import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Word Scramble — Unscramble Letters to Find the Word',
  description: 'Unscramble jumbled letters to find the correct English word. A fun word puzzle game with hints and a timer.',
  alternates: { canonical: 'https://whatword.co.za/games/word-scramble' },
  openGraph: {
    title: 'Word Scramble — Word Puzzle Game',
    description: 'Unscramble the letters to find the hidden word. Race against time.',
    url: 'https://whatword.co.za/games/word-scramble',
  },
};

export default function WordScrambleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
