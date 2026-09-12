import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { NavigationProgress } from '@/components/NavigationProgress';

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
      <body className="flex min-h-screen flex-col bg-[#faf8f2] text-[#141414] antialiased">
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-full bg-[#141414] px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
        >
          Skip to content
        </a>
        <NavigationProgress />
        <Header />
        <main id="main-content" className="flex-1 pt-[76px] sm:pt-[80px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
