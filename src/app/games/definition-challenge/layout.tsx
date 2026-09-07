import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Definition Challenge — Match Words to Definitions',
  description: 'Match English words to their correct definitions. A timed vocabulary quiz that tests your word knowledge.',
  alternates: { canonical: 'https://whatword.co.za/games/definition-challenge' },
  openGraph: {
    title: 'Definition Challenge — Vocabulary Word Game',
    description: 'Match words to their correct definitions in this timed quiz.',
    url: 'https://whatword.co.za/games/definition-challenge',
  },
};

export default function DefinitionChallengeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
