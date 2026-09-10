import { Metadata } from 'next';
import Link from 'next/link';
import { finderQuery } from '@/lib/word-intelligence/service';
import { listPageDecision } from '@/lib/word-intelligence/seo-score';

export const dynamic = 'force-dynamic';

const LENGTH_CONTEXT: Record<number, { game: string; fact: string; tip: string }> = {
  2: { game: 'Two-letter words are essential in Scrabble, where they unlock parallel plays and triple-word scores.', fact: 'The most common two-letter words in English include "of", "to", "in", "is", and "it".', tip: 'Master two-letter words to gain an edge in word games — many are valid plays that casual players overlook.' },
  3: { game: 'Three-letter words are the backbone of games like Wordle and crossword puzzles.', fact: 'English has over 1,000 common three-letter words, making it one of the most productive word lengths.', tip: 'Focus on three-letter verb forms (ran, sat, met) and articles — they appear in almost every game.' },
  4: { game: 'Four-letter words appear frequently in crossword puzzles and are high-value Scrabble plays.', fact: 'Many common English words have four letters, including about 5% of all words in a standard dictionary.', tip: 'Learn four-letter words with rare letters (J, Q, X, Z) for maximum Scrabble points.' },
  5: { game: 'Five-letter words are the most searched length thanks to Wordle, which uses exactly 5-letter answers.', fact: 'There are roughly 9,000 five-letter words in English, but only about 2,300 are commonly used.', tip: 'For Wordle, start with words containing common vowels (A, E, O) and frequent consonants (S, T, R, N).' },
  6: { game: 'Six-letter words are common in crossword puzzles and offer strong Scrabble scoring potential.', fact: 'Six-letter words account for roughly 7% of everyday English vocabulary.', tip: 'Six-letter words with double letters (e.g., "breeze", "gossip") can score highly in word games.' },
  7: { game: 'Seven-letter words are the gold standard in Scrabble — they earn a 50-point bonus for using all seven tiles.', fact: 'The Scrabble bonus for playing all seven tiles is called a "bingo" and is worth 50 extra points.', tip: 'Learn seven-letter words with common endings (-tion, -ing, -ous) to maximise your chance of a bingo play.' },
  8: { game: 'Eight-letter words are powerful in Scrabble and appear frequently in advanced crossword puzzles.', fact: 'Many eight-letter words are derived from Latin or Greek roots, making them common in academic English.', tip: 'Words with prefixes (un-, re-, pre-) and suffixes (-tion, -ment) are productive patterns for finding eight-letter words.' },
};

function getLengthContext(len: number) {
  return LENGTH_CONTEXT[len] || {
    game: `${len}-letter words are useful in crossword puzzles and word games.`,
    fact: `English words of ${len} letters make up a distinctive portion of the vocabulary.`,
    tip: `Use the Word Finder to explore ${len}-letter words by pattern, starting letter, or ending letter.`,
  };
}

function getBreadcrumbs(len: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://whatword.co.za' },
      { '@type': 'ListItem', position: 2, name: 'Words', item: 'https://whatword.co.za/words' },
      { '@type': 'ListItem', position: 3, name: `${len} Letter Words`, item: `https://whatword.co.za/words/by-length/${len}` },
    ],
  };
}

function getFAQSchema(len: number, total: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many ${len}-letter words are there in English?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There are approximately ${total} ${len}-letter words in our database, drawn from standard English dictionaries and the SCOWL word list.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are the most common ${len}-letter words?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The most common ${len}-letter words include everyday vocabulary used in writing and conversation. Browse the full list above, sorted by frequency.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are ${len}-letter words useful for Scrabble?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: len === 7
            ? 'Yes — seven-letter words are especially valuable in Scrabble because they earn a 50-point bonus for using all seven tiles.'
            : `Yes — ${len}-letter words can score well in Scrabble, especially those containing rare letters like J, Q, X, or Z.`,
        },
      },
    ],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ length: string }> }): Promise<Metadata> {
  const { length } = await params;
  const len = parseInt(length);
  const { total } = await finderQuery({ length: len, limit: 1 });
  const decision = listPageDecision(total);
  const ctx = getLengthContext(len);
  return {
    title: `${len} Letter Words — ${total} Words | WhatWord`,
    description: `Find all ${len}-letter English words. Browse ${total} ${len}-letter words with definitions, anagrams and word-game scores. ${ctx.fact}`,
    alternates: { canonical: `https://whatword.co.za/words/by-length/${len}` },
    robots: decision === 'noindex' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function WordLengthPage({ params }: { params: Promise<{ length: string }> }) {
  const { length } = await params;
  const len = parseInt(length);
  const { hits, total } = await finderQuery({ length: len, limit: 200 });
  const ctx = getLengthContext(len);

  return (
    <div className="container-app py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbs(len)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema(len, total)) }} />

      <nav className="text-xs text-[#adadad] mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[#707070]">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/words" className="hover:text-[#707070]">Words</Link>
        <span className="mx-1">/</span>
        <span className="text-[#707070]">{len} Letter Words</span>
      </nav>

      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-[#141414] sm:text-4xl">{len} Letter Words</h1>
        <p className="mt-3 text-lg text-[#707070]">
          Find all {len}-letter English words. We have <strong className="text-[#141414]">{total} words</strong> with {len} letters in our database.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#e0e0e0] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#141414]">About {len}-Letter Words</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#707070]">{ctx.game}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#707070]">{ctx.fact}</p>
        <div className="mt-4 rounded-xl bg-[#f9f9f9] p-4">
          <p className="text-sm font-medium text-[#141414]">Tip for word games</p>
          <p className="mt-1 text-sm text-[#707070]">{ctx.tip}</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <h2 className="mb-4 text-lg font-semibold text-[#141414]">{len}-Letter Word List</h2>
        {hits.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {hits.map((word) => (
              <Link key={word.word} href={`/words/${word.word}`} className="word-card">
                <span className="text-sm font-semibold text-[#141414]">{word.word}</span>
                <span className="block text-xs text-[#adadad]">
                  {word.pos || ''} · {word.scrabbleScore} pts
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#e0e0e0] bg-white p-8 text-center">
            <p className="text-[#707070]">No {len}-letter words found</p>
            <p className="mt-1 text-sm">Try the <Link href="/word-finder" className="underline hover:text-[#0066ff]">Word Finder</Link> instead</p>
          </div>
        )}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#e0e0e0] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#141414]">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#141414]">How many {len}-letter words are there in English?</h3>
            <p className="mt-1 text-sm text-[#707070]">There are approximately {total} {len}-letter words in our database, drawn from standard English dictionaries and the SCOWL word list.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#141414]">What are the most common {len}-letter words?</h3>
            <p className="mt-1 text-sm text-[#707070]">The most common {len}-letter words include everyday vocabulary used in writing and conversation. Browse the full list above, sorted by frequency.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#141414]">Are {len}-letter words useful for Scrabble?</h3>
            <p className="mt-1 text-sm text-[#707070]">{len === 7 ? 'Yes — seven-letter words are especially valuable in Scrabble because they earn a 50-point bonus for using all seven tiles.' : `Yes — ${len}-letter words can score well in Scrabble, especially those containing rare letters like J, Q, X, or Z.`}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <h2 className="mb-4 text-lg font-semibold text-[#141414]">Explore Other Word Lengths</h2>
        <div className="flex flex-wrap gap-2">
          {[2, 3, 4, 5, 6, 7, 8, 9, 10].filter(n => n !== len).map(n => (
            <Link key={n} href={`/words/by-length/${n}`} className="rounded-full border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#707070] transition-colors hover:border-[#0066ff]/30 hover:text-[#0066ff]">
              {n} Letter Words
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
