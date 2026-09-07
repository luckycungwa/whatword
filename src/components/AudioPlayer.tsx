'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  word: string;
}

export function AudioPlayer({ audioUrl, word }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopAll = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  const handlePlay = async () => {
    if (isPlaying) {
      stopAll();
      return;
    }

    setIsLoading(true);
    setError(false);

    if (audioUrl) {
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl);
          audioRef.current.addEventListener('ended', () => setIsPlaying(false));
          audioRef.current.addEventListener('error', () => {
            useSpeechSynthesis();
          });
        }
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      } catch {
        // Fall through to speech synthesis
      }
    }

    useSpeechSynthesis();
  };

  const useSpeechSynthesis = () => {
    if (!window.speechSynthesis) {
      setError(true);
      setIsLoading(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setError(true);
      setIsPlaying(false);
    };
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
        error
          ? 'bg-[#f3f3f3] text-[#adadad]'
          : isPlaying
          ? 'bg-[#141414] text-white'
          : 'bg-[#f3f3f3] text-[#141414] hover:bg-[#e8e8e8]'
      }`}
      aria-label={isPlaying ? `Pause pronunciation of ${word}` : `Play pronunciation of ${word}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      {error ? 'Audio unavailable' : isPlaying ? 'Stop' : 'Listen'}
    </button>
  );
}
