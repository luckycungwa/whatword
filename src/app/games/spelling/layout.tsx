import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spelling Challenge — Hear the Word and Spell It',
  description: 'Listen to word pronunciations and type the correct spelling. Perfect your English spelling skills with this interactive challenge.',
  alternates: { canonical: 'https://whatword.co.za/games/spelling' },
  openGraph: {
    title: 'Spelling Challenge — Spelling Word Game',
    description: 'Hear the word and type the correct spelling. Perfect your spelling skills.',
    url: 'https://whatword.co.za/games/spelling',
  },
};

export default function SpellingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
