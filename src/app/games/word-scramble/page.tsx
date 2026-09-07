'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Timer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllWords } from '@/lib/words';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Breadcrumbs';

const TOTAL = 10;

function scramble(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const result = arr.join('');
  return result === word ? scramble(word) : result;
}

export default function WordScramblePage() {
  const [rounds, setRounds] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; word: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const [shuffled, setShuffled] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const words = getAllWords().sort(() => Math.random() - 0.5).slice(0, TOTAL);
    setRounds(words);
    if (words[0]) setShuffled(scramble(words[0].word.toLowerCase()));
  }, []);

  const word = rounds[current];

  useEffect(() => {
    if (!word || finished) return;
    setTimeLeft(20);
    const timer = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { clearInterval(timer); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [current, word, finished]);

  useEffect(() => {
    if (timeLeft === 0 && word && !selected) {
      handleTimeout();
    }
  }, [timeLeft, word, selected]);

  const handleTimeout = () => {
    setSelected('TIMEOUT');
    setAnswers(a => [...a, { correct: false, word: word.word }]);
    setInput('');
    if (current < rounds.length - 1) { setCurrent(c => c + 1); setSelected(null); setShuffled(scramble(rounds[current + 1].word.toLowerCase())); }
    else setFinished(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const isCorrect = input.toLowerCase() === word.word.toLowerCase();
    if (isCorrect) setScore(s => s + 10 + Math.min(timeLeft, 10));
    setSelected(isCorrect ? 'CORRECT' : 'WRONG');
    setAnswers(a => [...a, { correct: isCorrect, word: word.word }]);
    setInput('');
    if (current < rounds.length - 1) { setCurrent(c => c + 1); setSelected(null); setShuffled(scramble(rounds[current + 1].word.toLowerCase())); }
    else setFinished(true);
  };

  const handleHint = () => {
    const hint = word.word.slice(0, 2);
    setInput(hint);
  };

  if (rounds.length === 0) return null;

  return (
    <div className="container-app py-8 md:py-12">
      <Breadcrumbs items={[{ label: 'Games', href: '/games' }, { label: 'Word Scramble' }]} />
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-[#141414]">Word Scramble</h1>
        <p className="mt-2 text-[#707070]">Unscramble the letters to find the word.</p>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-[#e0e0e0] bg-white px-5 py-3">
          <div className="text-center"><div className="text-lg font-bold text-[#141414]">{score}</div><div className="text-[10px] text-[#707070]">Score</div></div>
          <div className="text-center"><div className="text-lg font-bold text-[#141414]">{finished ? rounds.length : current + 1}/{rounds.length}</div><div className="text-[10px] text-[#707070]">Round</div></div>
        </div>

        <AnimatePresence mode="wait">
          {finished ? (
            <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
              <Trophy className="mx-auto mb-4 h-12 w-12 text-[#141414]" />
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
                <button onClick={() => { const w = getAllWords().sort(() => Math.random() - 0.5).slice(0, TOTAL); setRounds(w); setCurrent(0); setInput(''); setScore(0); setFinished(false); setAnswers([]); setSelected(null); setShuffled(scramble(w[0].word.toLowerCase())); }} className="rounded-full bg-[#141414] px-6 py-3 text-sm font-medium text-white hover:bg-[#141414]"><RotateCcw className="mr-2 inline h-4 w-4" />Play Again</button>
                <Link href="/games" className="rounded-full border border-[#e0e0e0] px-6 py-3 text-sm font-medium text-[#707070] hover:bg-[#f3f3f3]">All Games</Link>
              </div>
            </motion.div>
          ) : word ? (
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#707070]">Unscramble these letters</span>
                <span className={`flex items-center gap-1 text-sm font-medium ${timeLeft <= 5 ? 'text-red-500' : 'text-[#707070]'}`}><Timer className="h-4 w-4" />{timeLeft}s</span>
              </div>

              <div className="mb-6 rounded-2xl border border-[#f0f0f0] bg-[#f3f3f3] p-8 text-center">
                <div className="text-3xl font-bold tracking-[0.3em] text-black">{shuffled.toUpperCase()}</div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type the word..."
                  className="w-full rounded-2xl border border-[#e0e0e0] bg-white px-5 py-3.5 text-center text-lg font-medium text-[#141414] placeholder:text-[#adadad] focus:border-[#141414] focus:outline-none focus:ring-2 focus:ring-[#141414]/20"
                  autoFocus autoComplete="off" />
                <div className="flex gap-3">
                  <button type="button" onClick={handleHint} className="rounded-full border border-[#e0e0e0] px-4 py-3 text-sm font-medium text-[#707070] hover:bg-[#f3f3f3]">Hint</button>
                  <button type="submit" className="flex-1 rounded-full bg-[#141414] py-3 text-sm font-medium text-white hover:bg-[#141414]">Submit</button>
                </div>
              </form>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
