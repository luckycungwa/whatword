'use client';

import { AudioPlayer } from '@/components/AudioPlayer';
import { WordQuiz } from '@/components/WordQuiz';
import { FlashcardWidget } from '@/components/FlashcardWidget';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { WordEntry } from '@/lib/words';
import { BookOpen, ExternalLink, Puzzle, Gamepad2, Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface WordPageClientProps {
  word: WordEntry;
  relatedWords: WordEntry[];
  intel?: WordIntelView | null;
  /** True when the word exists in the graph but has no verified definition yet. */
  definitionPending?: boolean;
}

export interface WordIntelView {
  anagrams: string[];
  neighbours: string[];
  withinWords: string[];
  length: number;
  startsWith: string;
  endsWith: string;
  scrabbleScore: number;
  wordleCandidate: boolean;
  gameCandidate: boolean;
  regionalUsageNote?: string | null;
  regionalEquivalent?: string | null;
}

export function WordPageClient({ word, relatedWords, intel, definitionPending }: WordPageClientProps) {
  return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <Breadcrumbs items={[{ label: 'Words', href: '/words' }, { label: word.word }]} />

      {definitionPending && (
        <div className="mb-6 rounded-2xl border border-[#f0dfae] bg-[#fff8e6] px-4 py-3 text-sm text-[#8a6d1b]">
          <span className="font-semibold">{word.word}</span> is in the WhatWord word graph.
          Its full dictionary definition is being verified — below is everything the engine already knows.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Word header */}
            <div className="rounded-3xl bg-[#f3f3f3] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <h1 className="break-words text-3xl font-bold leading-none text-[#141414] md:text-4xl">{word.word}</h1>
                    <span className="badge shrink-0">{word.difficulty}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm sm:gap-3">
                    {word.phonetic && <span className="break-all italic text-[#707070]">{word.phonetic}</span>}
                    {word.phonetic && <span className="hidden text-[#adadad] sm:inline">&middot;</span>}
                    <span className="text-[#707070]">{word.partOfSpeech}</span>
                    <span className="text-[#adadad]">&middot;</span>
                    <span className="text-[#707070]">Level {word.vocabularyLevel}</span>
                  </div>
                </div>
                <AudioPlayer audioUrl={word.audioUrl} word={word.word} />
              </div>

              {/* Definition */}
              {!definitionPending && (
                <>
                  <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Simple Definition</h2>
                    <p className="text-lg font-medium text-[#141414]">{word.definitions.simple}</p>
                  </div>
                  <div className="mt-4">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Full Definition</h2>
                    <p className="text-sm leading-relaxed text-[#707070]">{word.definitions.full}</p>
                  </div>
                </>
              )}

              {/* Examples */}
              {!definitionPending && word.examples.length > 0 && (
                <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Usage Examples</h2>
                  <ul className="space-y-2.5">
                    {word.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#707070]">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#141414]" />
                        <span className="italic">&ldquo;{ex}&rdquo;</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Etymology */}
              {!definitionPending && word.etymology && (
                <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                  <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">
                    <BookOpen className="h-3.5 w-3.5" /> Etymology
                  </h2>
                  <p className="text-sm leading-relaxed text-[#707070]">{word.etymology}</p>
                </div>
              )}

              {/* Synonyms & Antonyms */}
              {!definitionPending && (word.synonyms.length > 0 || word.antonyms.length > 0) && (
                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#e0e0e0] pt-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Synonyms</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {word.synonyms.map((syn) => (
                        <span key={syn} className="badge">{syn}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Antonyms</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {word.antonyms.map((ant) => (
                        <span key={ant} className="badge">{ant}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Word Forms */}
              {word.wordForms && Object.keys(word.wordForms).length > 0 && (
                <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Word Forms</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(word.wordForms).filter(([,v]) => v).map(([key, val]) => (
                      <span key={key} className="rounded-xl bg-white px-3 py-1.5 text-xs text-[#707070]">
                        <span className="font-medium text-[#141414]">{key}:</span> {val}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Word Intelligence — letter facts, anagrams, neighbours */}
              {intel && (
                <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#adadad]">
                    Word facts &amp; word games
                  </h2>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-xl bg-white px-3 py-2.5 text-center">
                      <div className="text-lg font-bold text-[#141414]">{intel.length}</div>
                      <div className="text-[11px] text-[#707070]">letters</div>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2.5 text-center">
                      <div className="text-lg font-bold text-[#141414]">{intel.scrabbleScore}</div>
                      <div className="text-[11px] text-[#707070]">Scrabble pts</div>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2.5 text-center">
                      <div className="text-lg font-bold uppercase text-[#141414]">{intel.startsWith}</div>
                      <div className="text-[11px] text-[#707070]">starts with</div>
                    </div>
                    <div className="rounded-xl bg-white px-3 py-2.5 text-center">
                      <div className="text-lg font-bold uppercase text-[#141414]">{intel.endsWith}</div>
                      <div className="text-[11px] text-[#707070]">ends with</div>
                    </div>
                  </div>

                  {intel.anagrams.length > 0 && (
                    <div className="mt-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">
                        Anagrams of {word.word}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {intel.anagrams.slice(0, 12).map((a) => (
                          <Link key={a} href={`/words/${a}`} className="badge hover:bg-[#e8e8e8]">
                            {a}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {intel.withinWords.length > 0 && (
                    <div className="mt-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">
                        Words you can make from {word.word}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {intel.withinWords.slice(0, 16).map((w) => (
                          <Link key={w} href={`/words/${w}`} className="badge hover:bg-[#e8e8e8]">
                            {w}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {intel.neighbours.length > 0 && (
                    <div className="mt-4">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">
                        One letter different
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {intel.neighbours.slice(0, 12).map((w) => (
                          <Link key={w} href={`/words/${w}`} className="badge hover:bg-[#e8e8e8]">
                            {w}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="mt-4 text-xs leading-relaxed text-[#707070]">
                    {intel.wordleCandidate
                      ? `${word.word} is 5 letters long, making it a possible Wordle answer shape.`
                      : `${word.word} is ${intel.length} letters (${intel.gameCandidate ? 'a casual' : 'not a typical'} word-game candidate).`}{' '}
                    <Link href={`/anagram-solver?letters=${word.slug}`} className="font-medium text-[#141414] underline">
                      Solve anagrams
                    </Link>{' '}
                    ·{' '}
                    <Link href={`/word-unscrambler?letters=${word.slug}`} className="font-medium text-[#141414] underline">
                      Unscramble
                    </Link>{' '}
                    ·{' '}
                    <Link href="/word-finder" className="font-medium text-[#141414] underline">
                      Word Finder
                    </Link>
                  </p>

                  {intel.regionalUsageNote && (
                    <div className="mt-4 rounded-2xl border border-[#e0e0e0] bg-white p-4">
                      <h3 className="text-sm font-semibold text-[#141414]">South African usage</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[#707070]">{intel.regionalUsageNote}</p>
                      {intel.regionalEquivalent && (
                        <p className="mt-1 text-xs text-[#adadad]">Standard equivalent: {intel.regionalEquivalent}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Fun Fact */}
              {word.funFact && (
                <div className="mt-6 rounded-2xl bg-[#141414] p-4">
                  <h3 className="text-sm font-semibold text-white">Did you know?</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#adadad]">{word.funFact}</p>
                </div>
              )}
            </div>

            {/* Quiz — needs a verified definition to ask meaningful questions */}
            {!definitionPending && (
              <div className="mt-8">
                <WordQuiz word={word} />
              </div>
            )}

            <p className="mt-8 text-[11px] leading-relaxed text-[#adadad]">
              Word data: lexical spelling graph (ESDB methodology, © 2000–2026 Kevin Atkinson) with
              dictionary enrichment via FreeDictionaryAPI.com from Wiktionary (CC BY-SA 4.0). Letter and
              game analysis computed by WhatWord. See our sources in WORD-SOURCES.md.
            </p>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="rounded-3xl bg-[#f3f3f3] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[#141414]">Quick Tools</h3>
            <div className="space-y-1">
              <Link href={`/synonyms/${word.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#707070] transition-colors hover:bg-[#e8e8e8] hover:text-[#141414]">
                <Search className="h-4 w-4" /> Synonyms of {word.word}
              </Link>
              <Link href={`/antonyms/${word.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#707070] transition-colors hover:bg-[#e8e8e8] hover:text-[#141414]">
                <Search className="h-4 w-4" /> Antonyms of {word.word}
              </Link>
              <Link href="/word-finder" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#707070] transition-colors hover:bg-[#e8e8e8] hover:text-[#141414]">
                <Puzzle className="h-4 w-4" /> Word Finder
              </Link>
              <Link href={`/words/by-length/${word.word.length}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#707070] transition-colors hover:bg-[#e8e8e8] hover:text-[#141414]">
                <Puzzle className="h-4 w-4" /> {word.word.length}-letter words
              </Link>
              <Link href={`/words/by-letter/${word.word.charAt(0).toLowerCase()}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#707070] transition-colors hover:bg-[#e8e8e8] hover:text-[#141414]">
                <Puzzle className="h-4 w-4" /> Words starting with {word.word.charAt(0).toUpperCase()}
              </Link>
              <Link href="/games" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#707070] transition-colors hover:bg-[#e8e8e8] hover:text-[#141414]">
                <Gamepad2 className="h-4 w-4" /> Word Games
              </Link>
            </div>
          </div>

          {/* Related Words */}
          {relatedWords.length > 0 && (
            <div className="rounded-3xl bg-[#f3f3f3] p-5">
              <h3 className="mb-3 text-sm font-semibold text-[#141414]">Related Words</h3>
              <ul className="space-y-1">
                {relatedWords.slice(0, 6).map((rw) => (
                  <li key={rw.slug}>
                    <Link href={`/words/${rw.slug}`} className="group flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-[#e8e8e8]">
                      <div>
                        <span className="font-medium text-[#141414]">{rw.word}</span>
                        <span className="ml-2 text-xs text-[#adadad]">{rw.partOfSpeech}</span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-[#adadad]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flashcard — needs definitions to be useful */}
          {!definitionPending && (
            <FlashcardWidget words={relatedWords.length > 0 ? [word, ...relatedWords.slice(0, 4)] : [word]} />
          )}

          {/* Quick Info */}
          <div className="rounded-3xl bg-[#f3f3f3] p-5">
            <h3 className="mb-3 text-sm font-semibold text-[#141414]">Quick Info</h3>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt className="text-[#707070]">Part of Speech</dt><dd className="font-medium text-[#141414]">{word.partOfSpeech}</dd></div>
              <div className="flex justify-between"><dt className="text-[#707070]">Level</dt><dd className="font-medium text-[#141414]">{word.vocabularyLevel}</dd></div>
              <div className="flex justify-between"><dt className="text-[#707070]">Difficulty</dt><dd className="font-medium capitalize text-[#141414]">{word.difficulty}</dd></div>
              <div className="flex justify-between"><dt className="text-[#707070]">Category</dt><dd className="font-medium text-[#141414]">{word.category}</dd></div>
              <div className="flex justify-between"><dt className="text-[#707070]">Frequency</dt><dd className="font-medium capitalize text-[#141414]">{word.frequency.replace('-', ' ')}</dd></div>
              <div className="flex justify-between"><dt className="text-[#707070]">Syllables</dt><dd className="font-medium text-[#141414]">{word.syllables.join(' &middot; ')}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
