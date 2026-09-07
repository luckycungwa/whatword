import { getAllWords, getQuizWords, getGameWords, type WordEntry } from './words';

export interface GameState {
  score: number;
  currentRound: number;
  totalRounds: number;
  streak: number;
  bestStreak: number;
  timeStarted: number;
  timeEnded?: number;
  answers: GameAnswer[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameAnswer {
  word: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface GameConfig {
  type: 'whatword' | 'definition' | 'scramble' | 'spelling';
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rounds: number;
  timeLimit?: number;
}

export interface GameQuestion {
  type: 'whatword' | 'definition' | 'scramble' | 'spelling';
  word: string;
  question: string;
  answer: string;
  hints: string[];
  options?: string[];
}

export const GAME_CONFIGS: Record<GameConfig['type'], GameConfig> = {
  whatword: {
    type: 'whatword',
    title: 'WhatWord Challenge',
    description: 'Guess the word from clues about its meaning, synonyms, and usage.',
    icon: '🎯',
    difficulty: 'medium',
    rounds: 10,
    timeLimit: 30,
  },
  definition: {
    type: 'definition',
    title: 'Definition Challenge',
    description: 'Match words to their correct definitions from multiple choices.',
    icon: '📖',
    difficulty: 'easy',
    rounds: 10,
    timeLimit: 20,
  },
  scramble: {
    type: 'scramble',
    title: 'Word Scramble',
    description: 'Unscramble the letters to reveal the hidden word.',
    icon: '🔤',
    difficulty: 'medium',
    rounds: 10,
    timeLimit: 25,
  },
  spelling: {
    type: 'spelling',
    title: 'Spelling Challenge',
    description: 'Type the correct spelling of the word based on its definition.',
    icon: '✏️',
    difficulty: 'hard',
    rounds: 10,
    timeLimit: 30,
  },
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function scrambleWord(word: string): string {
  const letters = word.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  const scrambled = letters.join('');
  if (scrambled === word && word.length > 1) {
    return scrambleWord(word);
  }
  return scrambled;
}

function getWrongOptions(
  words: WordEntry[],
  correctWord: string,
  field: 'word' | 'definition',
  count: number
): string[] {
  const others = words.filter((w) => w.word !== correctWord);
  const shuffled = shuffleArray(others);
  return shuffled.slice(0, count).map((w) =>
    field === 'definition' ? w.definitions.simple : w.word
  );
}

function generateWhatWordQuestions(
  words: WordEntry[],
  count: number
): GameQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const hintTypes = ['definition', 'synonym', 'example'];
    const selectedHints = shuffleArray(hintTypes).slice(0, 2);
    const hints: string[] = [];
    selectedHints.forEach((type) => {
      if (type === 'definition') {
        hints.push(`Definition: ${word.definitions.simple}`);
      } else if (type === 'synonym' && word.synonyms.length > 0) {
        hints.push(`Synonyms: ${word.synonyms.slice(0, 2).join(', ')}`);
      } else if (type === 'example' && word.examples.length > 0) {
        hints.push(`Example: "${word.examples[0]}"`);
      }
    });
    const wrongOptions = getWrongOptions(words, word.word, 'word', 3);
    const options = shuffleArray([word.word, ...wrongOptions]);
    return {
      type: 'whatword' as const,
      word: word.word,
      question: 'What word matches these clues?',
      answer: word.word,
      hints,
      options,
    };
  });
}

function generateDefinitionQuestions(
  words: WordEntry[],
  count: number
): GameQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const wrongOptions = getWrongOptions(words, word.word, 'definition', 3);
    const options = shuffleArray([word.definitions.simple, ...wrongOptions]);
    return {
      type: 'definition' as const,
      word: word.word,
      question: `What is the definition of "${word.word}"?`,
      answer: word.definitions.simple,
      hints: [
        `Part of speech: ${word.partOfSpeech}`,
        `Category: ${word.category}`,
      ],
      options,
    };
  });
}

function generateScrambleQuestions(
  words: WordEntry[],
  count: number
): GameQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const scrambled = scrambleWord(word.word.toLowerCase());
    const wrongScrambles = getWrongOptions(words, word.word, 'word', 3).map((w) =>
      scrambleWord(w.toLowerCase())
    );
    const options = shuffleArray([word.word.toLowerCase(), ...wrongScrambles]);
    return {
      type: 'scramble' as const,
      word: word.word,
      question: `Unscramble: ${scrambled.toUpperCase()}`,
      answer: word.word.toLowerCase(),
      hints: [
        `Number of letters: ${word.word.length}`,
        `Starts with: ${word.word[0].toUpperCase()}`,
      ],
      options,
    };
  });
}

function generateSpellingQuestions(
  words: WordEntry[],
  count: number
): GameQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const hints: string[] = [];
    if (word.phonetic) {
      hints.push(`Pronunciation: ${word.phonetic}`);
    }
    hints.push(`Starts with: ${word.word[0].toUpperCase()}`);
    if (word.word.length > 3) {
      hints.push(`Length: ${word.word.length} letters`);
    }
    return {
      type: 'spelling' as const,
      word: word.word,
      question: `Spell the word: "${word.definitions.simple}"`,
      answer: word.word.toLowerCase(),
      hints,
    };
  });
}

export function generateGameQuestions(
  gameType: GameConfig['type'],
  difficulty: 'easy' | 'medium' | 'hard'
): GameQuestion[] {
  const wordDifficulty =
    difficulty === 'easy'
      ? 'beginner'
      : difficulty === 'medium'
        ? 'intermediate'
        : 'advanced';
  const words = getGameWords().filter(w => w.difficulty === wordDifficulty);
  const config = GAME_CONFIGS[gameType];

  if (words.length === 0) {
    return [];
  }

  const count = Math.min(config.rounds, words.length);

  switch (gameType) {
    case 'whatword':
      return generateWhatWordQuestions(words, count);
    case 'definition':
      return generateDefinitionQuestions(words, count);
    case 'scramble':
      return generateScrambleQuestions(words, count);
    case 'spelling':
      return generateSpellingQuestions(words, count);
    default:
      return [];
  }
}

export function getDailyChallenge(): {
  config: GameConfig;
  questions: GameQuestion[];
  date: string;
} {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );

  const gameTypes: GameConfig['type'][] = ['whatword', 'definition', 'scramble', 'spelling'];
  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];

  const gameType = gameTypes[dayOfYear % gameTypes.length];
  const difficulty = difficulties[Math.floor(dayOfYear / gameTypes.length) % difficulties.length];

  const config: GameConfig = {
    ...GAME_CONFIGS[gameType],
    difficulty,
    rounds: 10,
  };

  const seed = dayOfYear;
  const allWords = getGameWords();
  const deterministicWords: WordEntry[] = [];
  for (let i = 0; i < 10 && i < allWords.length; i++) {
    const index = (seed + i * 7) % allWords.length;
    deterministicWords.push(allWords[index]);
  }

  let questions: GameQuestion[];
  switch (gameType) {
    case 'whatword':
      questions = generateWhatWordQuestions(deterministicWords, 10);
      break;
    case 'definition':
      questions = generateDefinitionQuestions(deterministicWords, 10);
      break;
    case 'scramble':
      questions = generateScrambleQuestions(deterministicWords, 10);
      break;
    case 'spelling':
      questions = generateSpellingQuestions(deterministicWords, 10);
      break;
    default:
      questions = [];
  }

  return { config, questions, date: dateStr };
}

export function calculateScore(
  isCorrect: boolean,
  timeSpent: number,
  timeLimit: number | undefined,
  streak: number,
  difficulty: 'easy' | 'medium' | 'hard'
): number {
  if (!isCorrect) return 0;

  const basePoints: Record<string, number> = {
    easy: 100,
    medium: 200,
    hard: 300,
  };

  let score = basePoints[difficulty] || 100;

  if (timeLimit && timeSpent < timeLimit) {
    const timeRatio = (timeLimit - timeSpent) / timeLimit;
    score += Math.floor(timeRatio * 100);
  }

  if (streak > 1) {
    score = Math.floor(score * (1 + (streak - 1) * 0.1));
  }

  return score;
}

export interface GameStats {
  scores: Record<string, number[]>;
  streaks: Record<string, number>;
  bestTimes: Record<string, number>;
  gamesPlayed: Record<string, number>;
  bestStreaks: Record<string, number>;
}

const STATS_KEY = 'whatword-game-stats';

function getDefaultStats(): GameStats {
  return {
    scores: {},
    streaks: {},
    bestTimes: {},
    gamesPlayed: {},
    bestStreaks: {},
  };
}

export function getGameStats(): GameStats {
  if (typeof window === 'undefined') return getDefaultStats();
  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    return getDefaultStats();
  }
  return getDefaultStats();
}

export function saveGameStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Storage full or unavailable
  }
}

export function recordGameResult(
  gameType: string,
  score: number,
  timeCompleted: number,
  streak: number
): GameStats {
  const stats = getGameStats();

  if (!stats.scores[gameType]) stats.scores[gameType] = [];
  stats.scores[gameType].push(score);

  if (!stats.gamesPlayed[gameType]) stats.gamesPlayed[gameType] = 0;
  stats.gamesPlayed[gameType]++;

  stats.streaks[gameType] = streak;

  if (!stats.bestStreaks[gameType] || streak > stats.bestStreaks[gameType]) {
    stats.bestStreaks[gameType] = streak;
  }

  if (!stats.bestTimes[gameType] || timeCompleted < stats.bestTimes[gameType]) {
    stats.bestTimes[gameType] = timeCompleted;
  }

  saveGameStats(stats);
  return stats;
}

export function getHighScore(gameType: string): number {
  const stats = getGameStats();
  const scores = stats.scores[gameType];
  if (!scores || scores.length === 0) return 0;
  return Math.max(...scores);
}

export function getAverageScore(gameType: string): number {
  const stats = getGameStats();
  const scores = stats.scores[gameType];
  if (!scores || scores.length === 0) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return Math.round(sum / scores.length);
}

export function getTotalGamesPlayed(): number {
  const stats = getGameStats();
  return Object.values(stats.gamesPlayed).reduce((a, b) => a + b, 0);
}

export function createInitialState(
  difficulty: 'easy' | 'medium' | 'hard',
  totalRounds: number
): GameState {
  return {
    score: 0,
    currentRound: 0,
    totalRounds,
    streak: 0,
    bestStreak: 0,
    timeStarted: Date.now(),
    answers: [],
    difficulty,
  };
}
