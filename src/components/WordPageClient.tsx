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
}

export function WordPageClient({ word, relatedWords }: WordPageClientProps) {
  return (
    <div className="container-app py-6 md:py-10">
      <Breadcrumbs items={[{ label: 'Words', href: '/words' }, { label: word.word }]} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {/* Word header */}
            <div className="rounded-3xl bg-[#f3f3f3] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-[#141414] md:text-4xl">{word.word}</h1>
                    <span className="badge">{word.difficulty}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <span className="italic text-[#707070]">{word.phonetic}</span>
                    <span className="text-[#adadad]">&middot;</span>
                    <span className="text-[#707070]">{word.partOfSpeech}</span>
                    <span className="text-[#adadad]">&middot;</span>
                    <span className="text-[#707070]">Level {word.vocabularyLevel}</span>
                  </div>
                </div>
                <AudioPlayer audioUrl={word.audioUrl} word={word.word} />
              </div>

              {/* Definition */}
              <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Simple Definition</h2>
                <p className="text-lg font-medium text-[#141414]">{word.definitions.simple}</p>
              </div>
              <div className="mt-4">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">Full Definition</h2>
                <p className="text-sm leading-relaxed text-[#707070]">{word.definitions.full}</p>
              </div>

              {/* Examples */}
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

              {/* Etymology */}
              <div className="mt-6 border-t border-[#e0e0e0] pt-6">
                <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#adadad]">
                  <BookOpen className="h-3.5 w-3.5" /> Etymology
                </h2>
                <p className="text-sm leading-relaxed text-[#707070]">{word.etymology}</p>
              </div>

              {/* Synonyms & Antonyms */}
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

              {/* Fun Fact */}
              <div className="mt-6 rounded-2xl bg-[#141414] p-4">
                <h3 className="text-sm font-semibold text-white">Did you know?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#adadad]">{word.funFact}</p>
              </div>
            </div>

            {/* Quiz */}
            <div className="mt-8">
              <WordQuiz word={word} />
            </div>
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

          {/* Flashcard */}
          <FlashcardWidget words={relatedWords.length > 0 ? [word, ...relatedWords.slice(0, 4)] : [word]} />

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
