import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://whatword.co.za'),
  title: {
    default: 'WhatWord — Interactive English Dictionary, Word Finder & Vocabulary Games',
    template: '%s | WhatWord',
  },
  description:
    'Search English words, find words by pattern, build vocabulary with quizzes, and play daily word games. Your complete word utility platform.',
  keywords: [
    'dictionary', 'English words', 'vocabulary builder', 'word finder',
    'synonyms', 'antonyms', 'word games', 'spelling', 'pronunciation',
    'learn English', 'educational', 'word quiz',
  ],
  authors: [{ name: 'Lucky Cungwa' }],
  creator: 'Lucky Cungwa',
  publisher: 'Lucky Cungwa',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: 'https://whatword.co.za',
    siteName: 'WhatWord',
    title: 'WhatWord — Interactive English Dictionary, Word Finder & Vocabulary Games',
    description:
      'Search English words, find words by pattern, build vocabulary with quizzes, and play daily word games.',
    images: [{ url: 'https://whatword.co.za/black-logo.png', width: 512, height: 512, alt: 'WhatWord — Word Utility Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatWord — Interactive English Dictionary, Word Finder & Vocabulary Games',
    description: 'Search words, find patterns, build vocabulary, play games.',
    images: ['https://whatword.co.za/black-logo.png'],
    site: '@whatword',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: 'https://whatword.co.za' },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'WhatWord',
  url: 'https://whatword.co.za',
  description: 'Interactive English dictionary, word finder, and vocabulary games platform.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://whatword.co.za/words?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WhatWord',
  url: 'https://whatword.co.za',
  logo: 'https://whatword.co.za/black-logo.png',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body className="flex min-h-screen flex-col bg-[#ffffff] text-[#141414] antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
