import { Metadata } from 'next';
import Link from 'next/link';
import { finderQuery } from '@/lib/word-intelligence/service';
import { listPageDecision } from '@/lib/word-intelligence/seo-score';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

const LETTER_CONTEXT: Record<string, { origin: string; words: string; tip: string }> = {
  a: { origin: 'The letter A is the most commonly used letter in English, appearing in roughly 8% of all words.', words: 'Common A words include action, about, after, again, and area — many are among the most frequently used words in the language.', tip: 'Words starting with A often come from Latin and Greek roots, making them common in academic and scientific English.' },
  b: { origin: 'The letter B comes from the Egyptian hieroglyph for "house" and evolved through Phoenician and Greek before reaching Latin.', words: 'Common B words include be, but, by, back, and because — many are basic function words essential to English grammar.', tip: 'B words are valuable in Scrabble — "buzz", "fizz", and "jazz" all contain B and score well.' },
  c: { origin: 'The letter C has two sounds in English — the hard /k/ sound (cat) and the soft /s/ sound (city) — making it one of the most versatile consonants.', words: 'Common C words include can, come, could, and city. The hard C sound appears in thousands of everyday words.', tip: 'C words with the soft /s/ sound often come from French or Latin origins — look for words ending in -ce, -cy, or -ci.' },
  d: { origin: 'The letter D derives from the Phoenician letter Daleth, meaning "door", and represents one of the most common consonant sounds in English.', words: 'Common D words include do, day, down, and different — the D sound is fundamental to English verb forms (past tense -ed).', tip: 'Many D words are verb forms — learn the base words and their past tenses to expand your word-game vocabulary.' },
  e: { origin: 'The letter E is the most frequently used letter in English, appearing in about 13% of all words — including the most common English word, "the".', words: 'Common E words include each, even, every, and enough — E appears in more English words than any other letter.', tip: 'E-heavy words score well in Scrabble. Words like "jazzed", "frenzy", and "quizzed" all feature multiple E-adjacent letters.' },
  f: { origin: 'The letter F comes from the Phewa letter, meaning "hook", and represents one of the softer fricative consonants in English.', words: 'Common F words include for, from, find, and first — many high-frequency English words begin with F.', tip: 'F words are great for Wordle — F is uncommon enough to narrow possibilities but common enough to be useful.' },
  g: { origin: 'The letter G has both hard (go, get) and gentle (gem, giant) sounds, making it one of the most context-dependent letters in English.', words: 'Common G words include go, get, give, and good — the hard G sound appears in thousands of everyday words.', tip: 'G words with the soft sound (before E, I, Y) often come from French — useful for distinguishing word origins.' },
  h: { origin: 'The letter H is unique in English — it is often silent (hour, honest) or combined with other letters (sh, ch, th) to create distinct sounds.', words: 'Common H words include have, he, her, and here — H appears in many essential pronouns and determiners.', tip: 'H words are tricky in word games — many are silent, so check your dictionary before committing tiles.' },
  i: { origin: 'The letter I is the third most common letter in English and appears in many essential words — it, in, is, if, and ice.', words: 'Common I words include is, it, in, if, and into — I is one of the most productive vowels in English.', tip: 'I words often form the basis of verb conjugations — learn -ing, -ied, and -ish patterns for word games.' },
  j: { origin: 'The letter J is one of the least common letters in English, appearing in fewer than 0.15% of words — but it scores 8 points in Scrabble.', words: 'Common J words include just, job, join, and joy — J is rare enough to be a high-value word-game letter.', tip: 'J words are gold in Scrabble. Learn "jiffy", "jiff", "joey", and "jibe" — short J words that use common letters.' },
  k: { origin: 'The letter K often replaces C at the beginning of words before E, I, or Y (keep, key, kind) and is one of the less frequent consonants.', words: 'Common K words include know, keep, kind, and key — K appears in many everyday words despite being less common than C.', tip: 'K is worth 5 points in Scrabble. Words like "kayak", "kinky", and "kink" score well.' },
  l: { origin: 'The letter L is one of the most frequently used consonants, appearing in about 4% of all English words.', words: 'Common L words include long, look, like, and last — L is essential to many common word endings (-ly, -al, -le).', tip: 'L words are versatile in word games — "lazy", "laze", and "lull" all score well and use common letters.' },
  m: { origin: 'The letter M represents one of the most natural consonant sounds — it is one of the first sounds babies learn to make.', words: 'Common M words include my, me, more, and most — M appears in many personal pronouns and possessives.', tip: 'M words are valuable in Scrabble. "Maze", "mozzarella", and "mezzanine" all score well.' },
  n: { origin: 'The letter N is the sixth most common letter in English and appears in nearly every word through the -n and -ng endings.', words: 'Common N words include no, not, new, and next — N appears in many negations and common verb forms.', tip: 'N words are essential in Wordle — N is one of the most common consonants in English.' },
  o: { origin: 'The letter O is the fourth most common letter in English and appears in many essential function words (of, on, or, one).', words: 'Common O words include of, on, one, or, and our — O is one of the most productive vowels.', tip: 'O words are valuable in Scrabble — "ooze", "oomph", and "orgasm" all score well with double O.' },
  p: { origin: 'The letter P comes from the Phoenician letter Pe, meaning "mouth", and represents a strong plosive consonant.', words: 'Common P words include people, part, place, and play — P appears in many action words and nouns.', tip: 'P is worth 3 points in Scrabble — words like "pizzazz", "plop", and "pump" score well.' },
  q: { origin: 'The letter Q is one of the rarest letters in English and almost always appears with U (quiz, queen, quest) — a pattern inherited from Latin.', words: 'Common Q words include question, quite, quiet, and queen — Q is almost always followed by U in English.', tip: 'Q without U is rare but valid in Scrabble — learn "qi", "qat", "qoph", and "qadi" for high scores.' },
  r: { origin: 'The letter R is one of the most common consonants and is essential to English pronunciation — many words would be unrecognisable without it.', words: 'Common R words include run, red, real, and right — R appears in thousands of everyday words.', tip: 'R is worth 1 point in Scrabble but is essential for word formation — learn R-heavy words like "rarity" and "rara".' },
  s: { origin: 'The letter S is the most common consonant in English, appearing in about 6% of all words — it is essential to plurals and verb forms.', words: 'Common S words include so, some, say, and she — S appears in nearly every English sentence.', tip: 'S is worth 1 point in Scrabble but is essential for word formation — learn S-heavy words like "sass", "success", and "possess".' },
  t: { origin: 'The letter T is the second most common letter in English, appearing in about 9% of all words — it is essential to the most common English word, "the".', words: 'Common T words include the, to, that, this, and they — T appears in many function words and articles.', tip: 'T is worth 1 point in Scrabble but is essential for word formation — learn T-heavy words like "tart", "tartness", and "tattletale".' },
  u: { origin: 'The letter U is the fifth most common letter in English and appears in many essential words (up, us, use, under).', words: 'Common U words include up, us, use, and under — U is one of the most versatile vowels.', tip: 'U words are valuable in Scrabble — "umm", "ugh", and "ups" all score well with common letters.' },
  v: { origin: 'The letter V is relatively rare in English compared to other letters, appearing in about 1% of words — but it carries significant weight in formal vocabulary.', words: 'Common V words include very, view, visit, and voice — V appears in many formal and Latinate words.', tip: 'V is worth 4 points in Scrabble — words like "vivacious", "vivify", and "vex" score well.' },
  w: { origin: 'The letter W is unique among English consonants — it functions as both a consonant and a vowel (in "cwm" and "crwth") and is one of the less common letters.', words: 'Common W words include we, with, was, and will — W appears in many essential function words.', tip: 'W is worth 4 points in Scrabble — words like "wax", "waxy", and "wiz" score well.' },
  x: { origin: 'The letter X is one of the rarest letters in English but one of the highest-scoring in Scrabble — worth 8 points.', words: 'Common X words include xenon, xerox, and xylophone — X is rare but distinctive in English.', tip: 'X is worth 8 points in Scrabble — words like "axe", "fox", "box", and "axle" use X in common positions.' },
  y: { origin: 'The letter Y functions as both a consonant (yes, you) and a vowel (gym, myth) — making it one of the most versatile letters in English.', words: 'Common Y words include you, your, yes, and year — Y appears in many essential pronouns and determiners.', tip: 'Y is worth 4 points in Scrabble — words like "yoyo", "yippee", and "youth" score well.' },
  z: { origin: 'The letter Z is the rarest commonly used letter in English, appearing in fewer than 0.1% of words — but it scores 10 points in Scrabble.', words: 'Common Z words include zero, zone, and zoo — Z is rare but carries significant Scrabble value.', tip: 'Z is worth 10 points in Scrabble — words like "jazz", "fizz", "buzz", and "pizza" score extremely well.' },
};

function getLetterContext(letter: string) {
  return LETTER_CONTEXT[letter.toLowerCase()] || {
    origin: `The letter ${letter.toUpperCase()} has its own unique history and usage patterns in English.`,
    words: `There are many English words starting with ${letter.toUpperCase()}.`,
    tip: `Use the Word Finder to explore words starting with ${letter.toUpperCase()} by pattern or length.`,
  };
}

function getBreadcrumbs(letter: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://whatword.co.za' },
      { '@type': 'ListItem', position: 2, name: 'Words', item: 'https://whatword.co.za/words' },
      { '@type': 'ListItem', position: 3, name: `Starting with ${letter.toUpperCase()}`, item: `https://whatword.co.za/words/by-letter/${letter}` },
    ],
  };
}

function getFAQSchema(letter: string, total: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How many words start with ${letter.toUpperCase()} in English?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There are approximately ${total} words starting with ${letter.toUpperCase()} in our database, drawn from standard English dictionaries and the SCOWL word list.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are some common words starting with ${letter.toUpperCase()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Common words starting with ${letter.toUpperCase()} include everyday vocabulary used in writing and conversation. Browse the full list above, sorted by frequency.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are words starting with ${letter.toUpperCase()} useful for word games?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes — words starting with ${letter.toUpperCase()} are valuable in Scrabble, Wordle, and crossword puzzles. ${letter.toLowerCase() === 'x' || letter.toLowerCase() === 'z' || letter.toLowerCase() === 'j' || letter.toLowerCase() === 'q' ? `The letter ${letter.toUpperCase()} is rare and scores high in Scrabble.` : `Many common words start with ${letter.toUpperCase()}.`}`,
        },
      },
    ],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }): Promise<Metadata> {
  const { letter } = await params;
  const { total } = await finderQuery({ startsWith: letter, limit: 1 });
  const decision = listPageDecision(total);
  const ctx = getLetterContext(letter);
  return {
    title: `Words Starting with ${letter.toUpperCase()} — ${total} Words | WhatWord`,
    description: `Find English words starting with ${letter.toUpperCase()}. Browse ${total} words with definitions, anagrams and word-game scores. ${ctx.words}`,
    alternates: { canonical: `https://whatword.co.za/words/by-letter/${letter}` },
    robots: decision === 'noindex' ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function StartingWithPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const { hits, total } = await finderQuery({ startsWith: letter, limit: 200 });
  const ctx = getLetterContext(letter);

  return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbs(letter)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQSchema(letter, total)) }} />

      <Breadcrumbs items={[{ label: 'Words', href: '/words' }, { label: `Starting with ${letter.toUpperCase()}` }]} />

      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-[#141414] sm:text-4xl">
          Words Starting with {letter.toUpperCase()}
        </h1>
        <p className="mt-3 text-lg text-[#707070]">
          Find English words starting with <strong className="text-[#141414]">{letter.toUpperCase()}</strong>. We have <strong className="text-[#141414]">{total} words</strong> in our database.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-[#e0e0e0] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#141414]">About the Letter {letter.toUpperCase()}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#707070]">{ctx.origin}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#707070]">{ctx.words}</p>
        <div className="mt-4 rounded-xl bg-[#f9f9f9] p-4">
          <p className="text-sm font-medium text-[#141414]">Word Game Tip</p>
          <p className="mt-1 text-sm text-[#707070]">{ctx.tip}</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <h2 className="mb-4 text-lg font-semibold text-[#141414]">Word List Starting with {letter.toUpperCase()}</h2>
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
            <p className="text-[#707070]">No words starting with {letter.toUpperCase()} found</p>
            <p className="mt-1 text-sm">Try the <Link href="/word-finder" className="underline hover:text-[#0066ff]">Word Finder</Link> instead</p>
          </div>
        )}
      </div>

      <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-[#e0e0e0] bg-white p-6">
        <h2 className="text-lg font-semibold text-[#141414]">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#141414]">How many words start with {letter.toUpperCase()} in English?</h3>
            <p className="mt-1 text-sm text-[#707070]">There are approximately {total} words starting with {letter.toUpperCase()} in our database, drawn from standard English dictionaries and the SCOWL word list.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#141414]">What are some common words starting with {letter.toUpperCase()}?</h3>
            <p className="mt-1 text-sm text-[#707070]">Common words starting with {letter.toUpperCase()} include everyday vocabulary used in writing and conversation. Browse the full list above, sorted by frequency.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#141414]">Are words starting with {letter.toUpperCase()} useful for word games?</h3>
            <p className="mt-1 text-sm text-[#707070]">Yes — words starting with {letter.toUpperCase()} are valuable in Scrabble, Wordle, and crossword puzzles. {letter.toLowerCase() === 'x' || letter.toLowerCase() === 'z' || letter.toLowerCase() === 'j' || letter.toLowerCase() === 'q' ? `The letter ${letter.toUpperCase()} is rare and scores high in Scrabble.` : `Many common words start with ${letter.toUpperCase()}.`}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <h2 className="mb-4 text-lg font-semibold text-[#141414]">Explore Other Starting Letters</h2>
        <div className="flex flex-wrap gap-2">
          {'abcdefghijklmnopqrstuvwxyz'.split('').filter(l => l !== letter.toLowerCase()).map(l => (
            <Link key={l} href={`/words/by-letter/${l}`} className="rounded-full border border-[#e0e0e0] bg-white px-3 py-1.5 text-sm font-medium text-[#707070] transition-colors hover:border-[#0066ff]/30 hover:text-[#0066ff]">
              {l.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
