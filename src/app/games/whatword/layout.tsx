import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WhatWord Challenge — Guess the Word from Its Definition',
  description: 'Test your vocabulary with the WhatWord Challenge. Guess the correct word from its definition in 15 seconds. Score points and build streaks.',
  alternates: { canonical: 'https://whatword.co.za/games/whatword' },
  openGraph: {
    title: 'WhatWord Challenge — Vocabulary Word Game',
    description: 'Guess the word from its definition. Score points and build streaks.',
    url: 'https://whatword.co.za/games/whatword',
  },
};

export default function WhatWordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
