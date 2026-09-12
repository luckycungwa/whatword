'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import type { WordEntry } from '@/lib/words';

const TOTAL = 10;

async function fetchWords(count: number): Promise<WordEntry[]> {
  const res = await fetch(`/api/words?type=game&count=${count}`);
  if (!res.ok) return [];
  return res.json();
}

export default function DefinitionChallengePage() {
  const [rounds, setRounds] = useState<WordEntry[]>([]);
  const [allWords, setAllWords] = useState<WordEntry[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; word: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(12);

  useEffect(() => {
    fetchWords(TOTAL).then(words => {
      setRounds(words);
      fetchWords(50).then(setAllWords);
    });
  }, []);

  const word = rounds[current];

  useEffect(() => {
    if (!word || selected || finished) return;
    setTimeLeft(12);
    const timer = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(timer); setSelected('TIMEOUT'); setAnswers(a => [...a, { correct: false, word: word.word }]); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, word, selected, finished]);

  const getOptions = useCallback((correctWord: WordEntry) => {
    const pool = allWords.length > 0 ? allWords : rounds;
    const wrong = pool.filter(w => w.slug !== correctWord.slug).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrong.map(w => ({ word: w.word, definition: w.definitions.simple })), { word: correctWord.word, definition: correctWord.definitions.simple }].sort(() => Math.random() - 0.5);
  }, [allWords, rounds]);

  const handleSelect = useCallback((option: string) => {
    if (selected) return;
    setSelected(option);
    const isCorrect = option === word.word;
    if (isCorrect) setScore(s => s + 10 + Math.min(timeLeft, 5));
    setAnswers(a => [...a, { correct: isCorrect, word: word.word }]);
  }, [selected, word, timeLeft]);

  const handleNext = useCallback(() => {
    if (current < rounds.length - 1) { setCurrent(c => c + 1); setSelected(null); }
    else setFinished(true);
  }, [current, rounds.length]);

  const handleRestart = () => {
    fetchWords(TOTAL).then(words => {
      setRounds(words);
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setFinished(false);
      setAnswers([]);
    });
  };

  if (rounds.length === 0) return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <div className="mx-auto max-w-xl text-center text-[#707070]">Loading words...</div>
    </div>
  );

  const options = word ? getOptions(word) : [];

  return (
    <div className="container-app pb-10 pt-2 sm:pb-12">
      <Breadcrumbs items={[{ label: 'Games', href: '/games' }, { label: 'Definition Challenge' }]} />
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-[#141414]">Definition Challenge</h1>
        <p className="mt-2 text-[#707070]">Match each definition to the correct word.</p>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#e0e0e0] bg-white px-5 py-3">
          <div className="text-center"><div className="text-lg font-bold text-[#141414]">{score}</div><div className="text-[10px] text-[#707070]">Score</div></div>
          <div className="text-center"><div className="text-lg font-bold text-[#141414]">{finished ? rounds.length : current + 1}/{rounds.length}</div><div className="text-[10px] text-[#707070]">Round</div></div>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f0f0f0]">
          <motion.div className="h-full rounded-full bg-game" animate={{ width: `${((finished ? rounds.length : current + 1) / rounds.length) * 100}%` }} />
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
              <Trophy className="mx-auto mb-4 h-12 w-12 text-game" />
              <h2 className="text-2xl font-bold text-[#141414]">Complete!</h2>
              <p className="mt-2 text-lg text-[#707070]">Score: <span className="font-bold text-[#141414]">{score}</span></p>
              <div className="mt-6 space-y-2 text-left">
                {answers.map((a, i) => (
                  <div key={i} className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm ${a.correct ? 'bg-green-50 text-[#141414]' : 'bg-red-50 text-[#141414]'}`}>
                    {a.correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}<span>{a.word}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={handleRestart} className="rounded-full bg-game px-6 py-3 text-sm font-medium text-white hover:bg-game-dark"><RotateCcw className="mr-2 inline h-4 w-4" />Play Again</button>
                <Link href="/games" className="rounded-full border border-[#e0e0e0] px-6 py-3 text-sm font-medium text-[#707070] hover:bg-[#f3f3f3]">All Games</Link>
              </div>
            </motion.div>
          ) : word ? (
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#707070]">Which word matches this definition?</span>
                <span className={`flex items-center gap-1 text-sm font-medium ${timeLeft <= 5 ? 'text-red-500' : 'text-[#707070]'}`}><Timer className="h-4 w-4" />{timeLeft}s</span>
              </div>
              <div className="mb-6 rounded-2xl border border-[#f0f0f0] bg-[#f3f3f3] p-5">
                <p className="text-[#141414]">{word.definitions.simple}</p>
              </div>
              <div className="space-y-3">
                {options.map(opt => {
                  const isSel = selected === opt.word;
                  const isAns = opt.word === word.word;
                  const show = selected !== null;
                  return (
                    <button key={opt.word} onClick={() => handleSelect(opt.word)} disabled={!!selected}
                      className={`w-full rounded-2xl border-2 px-5 py-3 text-left text-sm font-medium transition-all ${show && isAns ? 'border-green-500 bg-green-50 text-[#141414]' : show && isSel && !isAns ? 'border-red-500 bg-red-50 text-[#141414]' : 'border-[#f0f0f0] bg-white text-[#707070] hover:border-[#adadad] hover:bg-[#f3f3f3]'}`}>
                      <span className="flex items-center gap-3">{show && isAns && <CheckCircle2 className="h-5 w-5 text-green-500" />}{show && isSel && !isAns && <XCircle className="h-5 w-5 text-red-500" />}{opt.word}</span>
                    </button>
                  );
                })}
              </div>
              {selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5"><button onClick={handleNext} className="w-full rounded-full bg-game py-3 text-sm font-medium text-white hover:bg-game-dark">{current < rounds.length - 1 ? 'Next' : 'Results'}</button></motion.div>}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
