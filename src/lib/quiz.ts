import { getAllWords, getQuizWords, type WordEntry } from './words';

export interface QuizQuestion {
  id: string;
  type: 'definition' | 'synonym' | 'antonym' | 'fill-blank' | 'correct-spelling' | 'word-origin';
  question: string;
  options: string[];
  correctAnswer: string;
  word: string;
  hint: string;
  difficulty: string;
  explanation: string;
}

export interface QuizConfig {
  title: string;
  description: string;
  questionCount: number;
  timeLimit?: number;
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  category?: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getWrongAnswers(
  words: WordEntry[],
  correctValue: string,
  field: 'word' | 'definition' | 'synonym' | 'antonym',
  count: number
): string[] {
  const candidates = words
    .filter((w) => {
      if (field === 'definition') return w.definitions.simple !== correctValue;
      if (field === 'synonym') return !w.synonyms.includes(correctValue);
      if (field === 'antonym') return !w.antonyms.includes(correctValue);
      return w.word !== correctValue;
    })
    .map((w) => {
      if (field === 'definition') return w.definitions.simple;
      if (field === 'synonym' && w.synonyms.length > 0) return w.synonyms[0];
      if (field === 'antonym' && w.antonyms.length > 0) return w.antonyms[0];
      return w.word;
    })
    .filter((v) => v && v !== correctValue);

  const unique = Array.from(new Set(candidates));
  return shuffleArray(unique).slice(0, count);
}

function generateId(): string {
  return `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateDefinitionQuiz(
  words: WordEntry[],
  count: number
): QuizQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const wrongDefs = getWrongAnswers(words, word.definitions.simple, 'definition', 3);
    const options = shuffleArray([word.definitions.simple, ...wrongDefs]);
    return {
      id: generateId(),
      type: 'definition' as const,
      question: `What is the definition of "${word.word}"?`,
      options,
      correctAnswer: word.definitions.simple,
      word: word.word,
      hint: `This word is a ${word.partOfSpeech} in the category "${word.category}".`,
      difficulty: word.difficulty,
      explanation: `"${word.word}" means ${word.definitions.simple}. ${word.etymology}`,
    };
  });
}

export function generateSynonymQuiz(
  words: WordEntry[],
  count: number
): QuizQuestion[] {
  const selected = shuffleArray(
    words.filter((w) => w.synonyms.length > 0)
  ).slice(0, count);
  return selected.map((word) => {
    const correctSynonym = word.synonyms[0];
    const wrongSynonyms = getWrongAnswers(words, correctSynonym, 'synonym', 3);
    const options = shuffleArray([correctSynonym, ...wrongSynonyms]);
    return {
      id: generateId(),
      type: 'synonym' as const,
      question: `Which word is a synonym of "${word.word}"?`,
      options,
      correctAnswer: correctSynonym,
      word: word.word,
      hint: `The word means: ${word.definitions.simple.substring(0, 50)}...`,
      difficulty: word.difficulty,
      explanation: `"${word.word}" means ${word.definitions.simple}. Synonyms include: ${word.synonyms.join(', ')}.`,
    };
  });
}

export function generateAntonymQuiz(
  words: WordEntry[],
  count: number
): QuizQuestion[] {
  const selected = shuffleArray(
    words.filter((w) => w.antonyms.length > 0)
  ).slice(0, count);
  return selected.map((word) => {
    const correctAntonym = word.antonyms[0];
    const wrongAntonyms = getWrongAnswers(words, correctAntonym, 'antonym', 3);
    const options = shuffleArray([correctAntonym, ...wrongAntonyms]);
    return {
      id: generateId(),
      type: 'antonym' as const,
      question: `Which word is an antonym of "${word.word}"?`,
      options,
      correctAnswer: correctAntonym,
      word: word.word,
      hint: `The word means: ${word.definitions.simple.substring(0, 50)}...`,
      difficulty: word.difficulty,
      explanation: `"${word.word}" means ${word.definitions.simple}. Antonyms include: ${word.antonyms.join(', ')}.`,
    };
  });
}

export function generateFillBlankQuiz(
  words: WordEntry[],
  count: number
): QuizQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const sentence =
      word.examples.length > 0
        ? word.examples[0].replace(new RegExp(word.word, 'gi'), '________')
        : `The word that means "${word.definitions.simple.substring(0, 30)}..." is ________.`;
    const wrongAnswers = getWrongAnswers(words, word.word, 'word', 3);
    const options = shuffleArray([word.word, ...wrongAnswers]);
    return {
      id: generateId(),
      type: 'fill-blank' as const,
      question: `Fill in the blank: ${sentence}`,
      options,
      correctAnswer: word.word,
      word: word.word,
      hint: `Part of speech: ${word.partOfSpeech}`,
      difficulty: word.difficulty,
      explanation: `The correct word is "${word.word}" which means ${word.definitions.simple}.`,
    };
  });
}

function generateCorrectSpellingQuiz(
  words: WordEntry[],
  count: number
): QuizQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const misspelled: string[] = [];
    if (word.word.length > 3) {
      const chars = word.word.split('');
      const i = Math.floor(Math.random() * (chars.length - 1));
      [chars[i], chars[i + 1]] = [chars[i + 1], chars[i]];
      misspelled.push(chars.join(''));
    }
    if (misspelled.length === 0 || misspelled[0] === word.word) {
      misspelled.push(word.word.substring(0, Math.floor(word.word.length / 2)) + 'x' + word.word.substring(Math.floor(word.word.length / 2) + 1));
    }
    const extraWrong = getWrongAnswers(words, word.word, 'word', 2);
    const options = shuffleArray([
      word.word,
      misspelled[0],
      ...extraWrong,
    ]);
    return {
      id: generateId(),
      type: 'correct-spelling' as const,
      question: `Which spelling is correct?`,
      options,
      correctAnswer: word.word,
      word: word.word,
      hint: `Definition: ${word.definitions.simple.substring(0, 40)}...`,
      difficulty: word.difficulty,
      explanation: `The correct spelling is "${word.word}". ${word.etymology}`,
    };
  });
}

function generateWordOriginQuiz(
  words: WordEntry[],
  count: number
): QuizQuestion[] {
  const selected = shuffleArray(words).slice(0, count);
  return selected.map((word) => {
    const wrongWords = getWrongAnswers(words, word.word, 'word', 3);
    const options = shuffleArray([word.word, ...wrongWords]);
    return {
      id: generateId(),
      type: 'word-origin' as const,
      question: `Which word has this etymology: "${word.etymology}"?`,
      options,
      correctAnswer: word.word,
      word: word.word,
      hint: `Category: ${word.category}`,
      difficulty: word.difficulty,
      explanation: `"${word.word}" ${word.etymology}`,
    };
  });
}

export function generateQuizFromWords(
  words: WordEntry[],
  count: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const questionTypes: Array<(w: WordEntry[], c: number) => QuizQuestion[]> = [
    generateDefinitionQuiz,
    generateSynonymQuiz,
    generateAntonymQuiz,
    generateFillBlankQuiz,
    generateCorrectSpellingQuiz,
    generateWordOriginQuiz,
  ];

  const wordsPerType = Math.ceil(count / questionTypes.length);
  let remaining = count;

  for (const generator of questionTypes) {
    if (remaining <= 0) break;
    const batchCount = Math.min(wordsPerType, remaining);
    const batch = generator(words, batchCount);
    questions.push(...batch);
    remaining -= batch.length;
  }

  return shuffleArray(questions).slice(0, count);
}

export function generateQuiz(config: QuizConfig): QuizQuestion[] {
  let words: WordEntry[];

  if (config.difficulty === 'all') {
    words = getAllWords();
  } else {
    words = getQuizWords().filter(w => w.difficulty === config.difficulty);
  }

  if (words.length === 0) {
    words = getAllWords();
  }

  if (config.category) {
    const categoryWords = words.filter(
      (w) => w.category.toLowerCase() === config.category!.toLowerCase()
    );
    if (categoryWords.length >= config.questionCount) {
      words = categoryWords;
    }
  }

  return generateQuizFromWords(words, config.questionCount);
}

export function getQuizCategories(): {
  name: string;
  description: string;
  count: number;
}[] {
  const words = getAllWords();
  const categoryMap = new Map<string, WordEntry[]>();

  words.forEach((word) => {
    const existing = categoryMap.get(word.category) || [];
    existing.push(word);
    categoryMap.set(word.category, existing);
  });

  const descriptions: Record<string, string> = {
    'Vocabulary Builder': 'Essential words to expand your everyday vocabulary.',
    'Academic English': 'Words commonly used in academic writing and lectures.',
    'Literary Words': 'Elegant words found in literature and creative writing.',
    'Psychology': 'Terms related to the mind, behaviour, and mental processes.',
    'Communication': 'Words that enhance speaking and writing clarity.',
    'Descriptive Words': 'Vivid words that bring writing to life.',
    'Business English': 'Professional vocabulary for the workplace.',
    'Formal English': 'Words suitable for formal and official contexts.',
    'Personality Words': 'Words describing character and temperament.',
    'Character Traits': 'Words that capture personal qualities and virtues.',
  };

  const categories: { name: string; description: string; count: number }[] = [];
  categoryMap.forEach((categoryWords, name) => {
    categories.push({
      name,
      description: descriptions[name] || `Words in the ${name} category.`,
      count: categoryWords.length,
    });
  });

  return categories.sort((a, b) => b.count - a.count);
}

export function getQuizStats(): {
  totalWords: number;
  byDifficulty: Record<string, number>;
  byType: Record<string, number>;
} {
  const words = getAllWords();
  const byDifficulty: Record<string, number> = {};
  const byType: Record<string, number> = {};

  words.forEach((word) => {
    byDifficulty[word.difficulty] = (byDifficulty[word.difficulty] || 0) + 1;
    byType[word.partOfSpeech] = (byType[word.partOfSpeech] || 0) + 1;
  });

  return {
    totalWords: words.length,
    byDifficulty,
    byType,
  };
}
