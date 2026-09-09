import { NextRequest, NextResponse } from 'next/server';
import { searchWords, corpusToEntry } from '@/lib/words';
import { getLocalCorpus } from '@/lib/word-intelligence/corpus';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (q.length < 2) return NextResponse.json([]);

  const results = await searchWords(q, 8);
  const seen = new Set(results.map((w) => w.slug));

  // Backfill from the local word graph so search works even when Supabase is thin.
  if (results.length < 8) {
    const lower = q.toLowerCase();
    const { words } = getLocalCorpus();
    const starts = words.filter((w) => w.word.startsWith(lower) && !seen.has(w.word));
    const contains = words.filter(
      (w) => !w.word.startsWith(lower) && w.word.includes(lower) && !seen.has(w.word),
    );
    for (const w of [...starts, ...contains].slice(0, 8 - results.length)) {
      seen.add(w.word);
      results.push(corpusToEntry(w));
    }
  }

  return NextResponse.json(results.slice(0, 8).map((w) => ({
    word: w.word,
    slug: w.slug,
    simple: w.definitions.simple,
    pos: w.partOfSpeech,
    level: w.vocabularyLevel,
  })));
}
