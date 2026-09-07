import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllSlugs, getWordBySlug, getRelatedWords } from '@/lib/words';
import { WordPageClient } from '@/components/WordPageClient';

interface WordPageProps {
  params: Promise<{ word: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((word) => ({ word }));
}

export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
  const { word: slug } = await params;
  const word = getWordBySlug(slug);
  if (!word) return { title: 'Word Not Found' };

  const title = `${word.word} — Definition, Pronunciation & Etymology`;
  const description = `Learn the meaning of "${word.word}" (${word.phonetic}). Explore its definition, pronunciation, etymology, usage examples, synonyms, and test your knowledge with an interactive quiz.`;
  const url = `https://whatword.co.za/words/${slug}`;

  return {
    title,
    description,
    keywords: [
      word.word.toLowerCase(),
      `${word.word.toLowerCase()} definition`,
      `${word.word.toLowerCase()} meaning`,
      `${word.word.toLowerCase()} pronunciation`,
      `${word.word} etymology`,
      `${word.word} synonyms`,
    ],
    openGraph: {
      title, description, url, siteName: 'WhatWord', type: 'article', locale: 'en_ZA',
      images: [{ url: `/og/words/${slug}.png`, width: 1200, height: 630, alt: `${word.word} — WhatWord` }],
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default async function WordPage({ params }: WordPageProps) {
  const { word: slug } = await params;
  const word = getWordBySlug(slug);
  if (!word) notFound();

  const relatedWords = getRelatedWords(slug);
  const url = `https://whatword.co.za/words/${slug}`;

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.word,
    description: word.definitions.simple,
    inDefinedTermSet: { '@type': 'DefinedTermSet', name: 'WhatWord English Dictionary', url: 'https://whatword.co.za' },
    url,
  };

  const learningResourceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `Learn the word "${word.word}"`,
    description: `Comprehensive learning resource for "${word.word}" including definition, pronunciation, etymology, and interactive quiz.`,
    url,
    educationalLevel: word.vocabularyLevel,
    learningResourceType: 'Vocabulary Lesson',
    about: { '@type': 'Thing', name: word.word },
    provider: { '@type': 'Organization', name: 'WhatWord', url: 'https://whatword.co.za' },
    inLanguage: 'en',
    isAccessibleForFree: true,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://whatword.co.za' },
      { '@type': 'ListItem', position: 2, name: 'Words', item: 'https://whatword.co.za/words' },
      { '@type': 'ListItem', position: 3, name: word.word, item: url },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What does ${word.word} mean?`,
        acceptedAnswer: { '@type': 'Answer', text: word.definitions.full },
      },
      {
        '@type': 'Question',
        name: `How do you pronounce ${word.word}?`,
        acceptedAnswer: { '@type': 'Answer', text: `The phonetic transcription is ${word.phonetic}. Click the listen button on the word page to hear the pronunciation.` },
      },
      {
        '@type': 'Question',
        name: `What are synonyms of ${word.word}?`,
        acceptedAnswer: { '@type': 'Answer', text: `Synonyms of ${word.word} include: ${word.synonyms.join(', ')}.` },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <WordPageClient word={word} relatedWords={relatedWords} />
    </>
  );
}
