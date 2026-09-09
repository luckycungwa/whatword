import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWord, getRelatedWords, corpusToEntry, type WordEntry } from '@/lib/words';
import { WordPageClient, type WordIntelView } from '@/components/WordPageClient';
import { getWordIntelligence } from '@/lib/word-intelligence/service';
import { getLocalCorpus } from '@/lib/word-intelligence/corpus';
import { scoreWordPage, indexDecision } from '@/lib/word-intelligence/seo-score';

interface WordPageProps {
  params: Promise<{ word: string }>;
}

// Word pages are dynamic: the corpus + Supabase graph change independently of deploys.
export const dynamic = 'force-dynamic';

function toIntelView(
  slug: string,
  intel: Awaited<ReturnType<typeof getWordIntelligence>>,
): WordIntelView {
  return {
    anagrams: intel.anagrams,
    neighbours: intel.neighbours,
    withinWords: intel.withinWords,
    length: intel.letter.length,
    startsWith: intel.letter.firstLetter.toUpperCase(),
    endsWith: intel.letter.lastLetter.toUpperCase(),
    scrabbleScore: intel.game.scrabbleScore,
    wordleCandidate: intel.game.wordleCandidate,
    gameCandidate: intel.game.gameCandidate,
    regionalUsageNote: intel.regional?.usageNote || null,
    regionalEquivalent: intel.regional?.standardEquivalent || null,
  };
}

/** Graph-only entry for words that exist but await definition verification. */
function pendingEntryFor(slug: string): WordEntry | null {
  const found = getLocalCorpus().byWord.get(slug);
  if (!found) return null;
  return corpusToEntry(found);
}

export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
  const { word: slug } = await params;
  const [word, intel] = await Promise.all([
    getWord(slug).catch(() => null),
    getWordIntelligence(slug).catch(() => null),
  ]);
  const verified = Boolean(word?.definitions?.simple);
  if (!verified && !intel?.exists) {
    return { title: 'Word Not Found', robots: { index: false, follow: false } };
  }

  const url = `https://whatword.co.za/words/${slug}`;
  const display = word?.word || slug.charAt(0).toUpperCase() + slug.slice(1);

  const score = scoreWordPage({
    hasVerifiedDefinition: verified,
    definitionLength: (word?.definitions?.full || '').length,
    exampleCount: word?.examples?.length || 0,
    synonymCount: word?.synonyms?.length || 0,
    antonymCount: word?.antonyms?.length || 0,
    relatedCount: 0,
    anagramCount: intel?.anagrams?.length || 0,
    hasPronunciation: Boolean(word?.phonetic),
    hasWordForms: Boolean(word?.wordForms && Object.keys(word.wordForms).length > 0),
    facetCoverage: 0,
    contentBlocks: verified ? 6 : 3,
  });
  const decision = indexDecision(score.total);
  const noindex = !verified || decision === 'noindex' || decision === 'review';

  let description: string;
  let title: string;
  if (verified && word) {
    const bits: string[] = [];
    bits.push(word.definitions.simple.split('.')[0]);
    if (intel) bits.push(`${intel.letter.length} letters, Scrabble value ${intel.game.scrabbleScore}`);
    if (word.synonyms?.length) bits.push(`synonyms include ${word.synonyms.slice(0, 3).join(', ')}`);
    if (intel && intel.anagrams.length > 0) bits.push(`anagrams: ${intel.anagrams.slice(0, 3).join(', ')}`);
    description = `Learn "${display}" (${word.phonetic || word.partOfSpeech}): ${bits.join('. ').slice(0, 300)}.`;
    title = `${display} — Definition, Anagrams & Word-Game Info`;
  } else {
    const bits = [`${intel!.letter.length} letters`, `Scrabble value ${intel!.game.scrabbleScore}`];
    if (intel!.anagrams.length > 0) bits.push(`anagrams: ${intel!.anagrams.slice(0, 3).join(', ')}`);
    description = `"${display}": ${bits.join(', ')}. Full definition being verified — explore letter patterns, anagrams and word-game info.`;
    title = `${display} — Word Details, Anagrams & Word-Game Info`;
  }

  return {
    title,
    description,
    keywords: [
      display.toLowerCase(),
      `${display.toLowerCase()} definition`,
      `${display.toLowerCase()} meaning`,
      `${display.toLowerCase()} pronunciation`,
      `${display} etymology`,
      `${display} synonyms`,
      `${display.toLowerCase()} anagrams`,
      `${display.toLowerCase()} scrabble`,
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'WhatWord',
      type: 'article',
      locale: 'en_ZA',
      images: [{ url: 'https://whatword.co.za/black-logo.png', width: 512, height: 512, alt: `${display} — WhatWord` }],
    },
    twitter: { card: 'summary_large_image', title: `${display} — WhatWord`, description },
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function WordPage({ params }: WordPageProps) {
  const { word: slug } = await params;
  const [word, intel] = await Promise.all([
    getWord(slug).catch(() => null),
    getWordIntelligence(slug).catch(() => null),
  ]);
  const verified = Boolean(word?.definitions?.simple);
  if (!verified && !intel?.exists) notFound();

  const url = `https://whatword.co.za/words/${slug}`;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://whatword.co.za' },
      { '@type': 'ListItem', position: 2, name: 'Words', item: 'https://whatword.co.za/words' },
      { '@type': 'ListItem', position: 3, name: word?.word || slug, item: url },
    ],
  };

  // ---- Intelligence-only page: word exists in the graph, definition pending ----
  if (!verified || !word) {
    const pending = pendingEntryFor(slug);
    if (!pending || !intel) notFound();
    const intelView = toIntelView(slug, intel);
    const neighbourEntries = [...intel.anagrams, ...intel.neighbours]
      .slice(0, 5)
      .map((w) => pendingEntryFor(w))
      .filter((e): e is WordEntry => e !== null);
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <WordPageClient word={pending} relatedWords={neighbourEntries} intel={intelView} definitionPending />
      </>
    );
  }

  // ---- Verified page ----
  const relatedWords = await getRelatedWords(slug);
  const intelView = intel ? toIntelView(slug, intel) : null;

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
      <WordPageClient word={word} relatedWords={relatedWords} intel={intelView} />
    </>
  );
}
