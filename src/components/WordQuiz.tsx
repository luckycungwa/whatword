'use client';

import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Trophy, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordEntry } from '@/lib/words';

interface QuizQuestion {
  type: 'definition' | 'synonym' | 'antonym' | 'fill-blank';
  question: string;
  correctAnswer: string;
  options: string[];
  hint: string;
}

function generateQuizQuestions(word: WordEntry): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  questions.push({
    type: 'definition',
    question: `Which definition matches "${word.word}"?`,
    correctAnswer: word.definitions.simple,
    options: [word.definitions.simple, 'The opposite of this concept', 'A common greeting', 'Related to science'].sort(() => Math.random() - 0.5),
    hint: `This word is a ${word.partOfSpeech}.`,
  });

  if (word.synonyms.length > 0) {
    questions.push({
      type: 'synonym',
      question: `Which word is a synonym of "${word.word}"?`,
      correctAnswer: word.synonyms[0],
      options: [word.synonyms[0], ...(word.antonyms.length > 0 ? [word.antonyms[0]] : ['unrelated']), 'ambiguous', 'random'].filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5).slice(0, 4),
      hint: 'Think about words with similar meanings.',
    });
  }

  if (word.antonyms.length > 0) {
    questions.push({
      type: 'antonym',
      question: `Which word is an antonym of "${word.word}"?`,
      correctAnswer: word.antonyms[0],
      options: [word.antonyms[0], ...(word.synonyms.length > 0 ? [word.synonyms[0]] : ['related']), 'neutral', 'standard'].filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5).slice(0, 4),
      hint: 'Think about words with opposite meanings.',
    });
  }

  if (word.examples.length > 0) {
    const example = word.examples[0];
    const blanked = example.replace(new RegExp(word.word, 'gi'), '________');
    questions.push({
      type: 'fill-blank',
      question: `Fill in the blank: "${blanked}"`,
      correctAnswer: word.word,
      options: [word.word, 'enigmatic', 'eloquent', 'ubiquitous'].filter(w => w !== word.word).sort(() => Math.random() - 0.5).slice(0, 3).concat(word.word).sort(() => Math.random() - 0.5),
      hint: `The word starts with "${word.word[0].toUpperCase()}".`,
    });
  }

  return questions;
}

interface WordQuizProps {
  word: WordEntry;
}

export function WordQuiz({ word }: WordQuizProps) {
  const [questions] = useState<QuizQuestion[]>(() => generateQuizQuestions(word));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; question: string }[]>([]);

  const question = questions[currentQ];
  const isCorrect = selected === question?.correctAnswer;

  const handleSelect = useCallback((option: string) => {
    if (selected) return;
    setSelected(option);
    const correct = option === question.correctAnswer;
    if (correct) setScore(s => s + 1);
    setAnswers(p => [...p, { correct, question: question.question }]);
  }, [selected, question]);

  const handleNext = useCallback(() => {
    if (currentQ < questions.length - 1) { setCurrentQ(q => q + 1); setSelected(null); setShowHint(false); }
    else setFinished(true);
  }, [currentQ, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentQ(0); setSelected(null); setScore(0); setShowHint(false); setFinished(false); setAnswers([]);
  }, []);

  if (questions.length === 0) return null;

  return (
    <div className="rounded-3xl bg-[#f3f3f3] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#141414]">Test Your Knowledge</h3>
        <span className="text-sm text-[#707070]">{finished ? 'Complete' : `${currentQ + 1}/${questions.length}`}</span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-[#e0e0e0]">
        <motion.div className="h-full rounded-full bg-[#141414]" initial={{ width: 0 }} animate={{ width: `${((finished ? questions.length : currentQ + 1) / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        {finished ? (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#141414]"><Trophy className="h-8 w-8 text-white" /></div>
            <h4 className="text-xl font-bold text-[#141414]">Quiz Complete!</h4>
            <p className="mt-2 text-lg text-[#707070]">Score: <span className="font-bold text-[#141414]">{score}/{questions.length}</span></p>
            <div className="mt-6 space-y-2 text-left">
              {answers.map((a, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl bg-white px-3 py-2">
                  {a.correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" /> : <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />}
                  <span className="text-sm text-[#707070]">{a.question}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={handleRestart} className="mt-6 btn-primary">
              <RotateCcw className="h-4 w-4" />Try Again
            </button>
          </motion.div>
        ) : (
          <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-4 text-sm font-medium text-[#707070]">{question.question}</p>
            <div className="space-y-3">
              {question.options.map(option => {
                const isSelected = selected === option;
                const isAnswer = option === question.correctAnswer;
                const showResult = selected !== null;
                return (
                  <button key={option} type="button" onClick={() => handleSelect(option)} disabled={!!selected}
                    className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      showResult && isAnswer ? 'bg-[#141414] text-white' :
                      showResult && isSelected && !isAnswer ? 'bg-red-50 text-red-800' :
                      isSelected ? 'bg-[#141414] text-white' :
                      'bg-white text-[#141414] hover:bg-[#e8e8e8]'
                    }`}>
                    <span className="flex items-center gap-3">
                      {showResult && isAnswer && <CheckCircle2 className="h-5 w-5 text-white" />}
                      {showResult && isSelected && !isAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {!selected && (
              <div className="mt-4">
                {!showHint ? (
                  <button type="button" onClick={() => setShowHint(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#707070] hover:text-[#141414]">
                    <Lightbulb className="h-3.5 w-3.5" />Need a hint?
                  </button>
                ) : (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1.5 text-xs text-[#707070]">
                    <Lightbulb className="h-3.5 w-3.5" />{question.hint}
                  </motion.p>
                )}
              </div>
            )}

            {selected && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                <p className={`text-sm font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>{isCorrect ? 'Correct!' : 'Not quite. The answer is highlighted above.'}</p>
                <button type="button" onClick={handleNext} className="mt-3 btn-primary !py-2 !px-4 !text-sm">
                  {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
