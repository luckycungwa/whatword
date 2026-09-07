import { NextRequest, NextResponse } from 'next/server';
import { getAllWords } from '@/lib/words';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (q.length < 2) return NextResponse.json([]);

  const lower = q.toLowerCase();
  const allWords = getAllWords();
  const results = allWords
    .filter(
      (w) =>
        w.word.toLowerCase().includes(lower) ||
        w.definitions.simple.toLowerCase().includes(lower)
    )
    .slice(0, 8)
    .map((w) => ({
      word: w.word,
      slug: w.slug,
      simple: w.definitions.simple,
      pos: w.partOfSpeech,
      level: w.vocabularyLevel,
    }));

  return NextResponse.json(results);
}
