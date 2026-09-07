'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArrowRight, CheckCircle2, XCircle, RotateCcw, Trophy, Lightbulb, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllWords, getGameWords } from '@/lib/words';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const TOTAL_ROUNDS = 10;

interface Round {
  word: any;
  hint: string;
  options: string[];
  correct: string;
}

function generateRounds(): Round[] {
  const gameWords = getGameWords();
  const shuffled = [...gameWords].sort(() => Math.random() - 0.5).slice(0, TOTAL_ROUNDS);

  return shuffled.map(word => {
    const allWords = getAllWords();
    const wrongOptions = allWords
      .filter(w => w.slug !== word.slug)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);

    return {
      word,
      hint: word.definitions.simple,
      options: [...wrongOptions, word.word].sort(() => Math.random() - 0.5),
      correct: word.word,
    };
  });
}

export default function WhatWordGame() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; word: string }[]>([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    setRounds(generateRounds());
  }, []);

  const round = rounds[current];

  useEffect(() => {
    if (!round || selected || finished) return;
    setTimeLeft(15);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setSelected('TIMEOUT');
          const newStreak = 0;
          setStreak(newStreak);
          setAnswers(a => [...a, { correct: false, word: round.correct }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, round, selected, finished]);

  const handleSelect = useCallback((option: string) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === round.correct;
    if (isCorrect) {
      const newStreak = streak + 1;
      setScore(s => s + (hintUsed ? 8 : 10) + Math.min(timeLeft, 5));
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
    setAnswers(a => [...a, { correct: isCorrect, word: round.correct }]);
  }, [selected, round, streak, bestStreak, hintUsed, timeLeft]);

  const handleNext = useCallback(() => {
    if (current < rounds.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setHintUsed(false);
    } else {
      setFinished(true);
    }
  }, [current, rounds.length]);

  const handleRestart = useCallback(() => {
    setRounds(generateRounds());
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setFinished(false);
    setAnswers([]);
    setHintUsed(false);
  }, []);

  if (rounds.length === 0) return null;

  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Games', href: '/games' }, { label: 'WhatWord Challenge' }]} />

      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-[#141414] sm:text-3xl">WhatWord Challenge</h1>
        <p className="mt-2 text-[#707070]">Guess the word from its definition.</p>

        {/* Score bar */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#e0e0e0] bg-white px-5 py-3">
          <div className="text-center"><div className="text-lg font-bold text-[#141414]">{score}</div><div className="text-[10px] text-[#707070]">Score</div></div>
          <div className="text-center"><div className="text-lg font-bold text-black">{streak}🔥</div><div className="text-[10px] text-[#707070]">Streak</div></div>
          <div className="text-center"><div className="text-lg font-bold text-[#141414]">{finished ? rounds.length : current + 1}/{rounds.length}</div><div className="text-[10px] text-[#707070]">Round</div></div>
        </div>

        {/* Progress */}
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f0f0f0]">
          <motion.div className="h-full rounded-full bg-[#141414]" animate={{ width: `${((finished ? rounds.length : current + 1) / rounds.length) * 100}%` }} transition={{ duration: 0.3 }} />
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3f3]">
                <Trophy className="h-8 w-8 text-[#141414]" />
              </div>
              <h2 className="text-2xl font-bold text-[#141414]">Game Over!</h2>
              <p className="mt-2 text-lg text-[#707070]">Score: <span className="font-bold text-[#141414]">{score}</span></p>
              <p className="text-[#707070]">Best streak: {bestStreak}</p>

              <div className="mt-6 space-y-2 text-left">
                {answers.map((a, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm ${a.correct ? 'bg-green-50 text-[#141414]' : 'bg-red-50 text-[#141414]'}`}>
                    {a.correct ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <XCircle className="h-4 w-4 flex-shrink-0" />}
                    <span>{a.word}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button type="button" onClick={handleRestart} className="rounded-full bg-[#141414] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#141414]">
                  <RotateCcw className="mr-2 inline h-4 w-4" />Play Again
                </button>
                <Link href="/games" className="rounded-full border border-[#e0e0e0] px-6 py-3 text-sm font-medium text-[#707070] transition-colors hover:bg-[#f3f3f3]">
                  All Games
                </Link>
              </div>
            </motion.div>
          ) : round ? (
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-8">
              {/* Timer */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#707070]">What word matches this definition?</span>
                <span className={`flex items-center gap-1 text-sm font-medium ${timeLeft <= 5 ? 'text-red-500' : 'text-[#707070]'}`}>
                  <Timer className="h-4 w-4" />{timeLeft}s
                </span>
              </div>

              {/* Hint */}
              <div className="mb-6 rounded-2xl border border-[#f3f3f3] bg-[#f3f3f3] p-5">
                <p className="text-sm font-medium text-[#141414]">Hint</p>
                <p className="mt-1 text-[#707070]">{round.hint}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {round.options.map(option => {
                  const isSelected = selected === option;
                  const isAnswer = option === round.correct;
                  const showResult = selected !== null;
                  return (
                    <button key={option} type="button" onClick={() => handleSelect(option)} disabled={!!selected}
                      className={`w-full rounded-2xl border-2 px-5 py-3.5 text-left text-sm font-medium transition-all ${
                        showResult && isAnswer ? 'border-green-500 bg-green-50 text-[#141414]' :
                        showResult && isSelected && !isAnswer ? 'border-red-500 bg-red-50 text-[#141414]' :
                        'border-[#e0e0e0] bg-white text-[#707070] hover:border-[#e0e0e0] hover:bg-[#f3f3f3]'
                      }`}>
                      <span className="flex items-center gap-3">
                        {showResult && isAnswer && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                        {showResult && isSelected && !isAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selected && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
                  <button type="button" onClick={handleNext} className="w-full rounded-full bg-[#141414] py-3 text-sm font-medium text-white transition-colors hover:bg-[#141414]">
                    {current < rounds.length - 1 ? 'Next Round' : 'See Results'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
