'use client';

import { useState } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordEntry } from '@/lib/words';

interface FlashcardWidgetProps {
  words: WordEntry[];
}

export function FlashcardWidget({ words }: FlashcardWidgetProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = words[current];
  if (!word) return null;

  const handlePrev = () => { setFlipped(false); setCurrent(c => c === 0 ? words.length - 1 : c - 1); };
  const handleNext = () => { setFlipped(false); setCurrent(c => c === words.length - 1 ? 0 : c + 1); };

  const handleExport = () => {
    const text = words.map(w => `${w.word}\n${w.definitions.simple}\nExample: ${w.examples[0] || 'N/A'}\n`).join('\n---\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'whatword-flashcards.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl bg-[#f3f3f3] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#141414]">Flashcards</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#707070]">{current + 1}/{words.length}</span>
          <button type="button" onClick={handleExport} className="rounded-full bg-white p-1.5 text-[#707070] hover:text-[#141414]" aria-label="Export flashcards">
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="cursor-pointer" onClick={() => setFlipped(!flipped)} role="button" tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setFlipped(!flipped); }}
        aria-label={`Flashcard: ${word.word}. Click to ${flipped ? 'hide' : 'reveal'} definition.`}>
        <AnimatePresence mode="wait">
          <motion.div key={`${current}-${flipped}`}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`rounded-2xl p-6 text-center ${flipped ? 'bg-[#141414] text-white' : 'bg-white text-[#141414]'}`}
            style={{ minHeight: '160px' }}>
            {!flipped ? (
              <div>
                <p className="text-xl font-bold">{word.word}</p>
                <p className="mt-1.5 text-xs text-[#707070]">{word.phonetic}</p>
                <p className="mt-1 text-[10px] text-[#adadad]">{word.partOfSpeech}</p>
                <p className="mt-3 text-[10px] text-[#adadad]">Click to reveal definition</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-medium uppercase text-[#707070]">Definition</p>
                <p className="mt-1.5 text-sm">{word.definitions.simple}</p>
                {word.examples[0] && <p className="mt-2 text-xs italic text-[#adadad]">&ldquo;{word.examples[0]}&rdquo;</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={handlePrev} className="rounded-full bg-white p-1.5 text-[#707070] hover:text-[#141414]" aria-label="Previous card">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setFlipped(!flipped)} className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[#707070] hover:text-[#141414]">
          <RotateCcw className="h-3 w-3" /> Flip
        </button>
        <button type="button" onClick={handleNext} className="rounded-full bg-white p-1.5 text-[#707070] hover:text-[#141414]" aria-label="Next card">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
