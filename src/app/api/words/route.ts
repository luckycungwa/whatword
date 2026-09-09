import { NextRequest, NextResponse } from 'next/server';
import { getAllWords } from '@/lib/words';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'random';
  const count = parseInt(request.nextUrl.searchParams.get('count') || '10');

  const allWords = await getAllWords();
  if (allWords.length === 0) {
    return NextResponse.json([]);
  }

  let selected;
  if (type === 'quiz') {
    selected = allWords.filter(w => w.quizEligible && w.definitions.simple);
  } else if (type === 'game') {
    selected = allWords.filter(w => w.gameEligible && w.definitions.simple);
  } else {
    selected = allWords.filter(w => w.definitions.simple);
  }

  // Shuffle and pick
  const shuffled = [...selected].sort(() => Math.random() - 0.5);
  return NextResponse.json(shuffled.slice(0, Math.min(count, shuffled.length)));
}
