import { NextRequest, NextResponse } from 'next/server';
import { solverAnagrams } from '@/lib/word-intelligence/service';
import { getWord } from '@/lib/words';
import { canonicalKey } from '@/lib/word-intelligence/normalize';

/** GET /api/anagrams?letters=listen — full-corpus signature solver. */
export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('letters') || '';
  const letters = canonicalKey(raw).replace(/[^a-z]/g, '');
  if (letters.length < 2 || letters.length > 15) {
    return NextResponse.json({ error: 'Provide 2-15 letters via ?letters=' }, { status: 400 });
  }
  const hits = await solverAnagrams(letters, 50);
  const enriched = await Promise.all(
    hits.map(async (h) => {
      let definition = '';
      try {
        definition = (await getWord(h.word))?.definitions?.simple || '';
      } catch {
        definition = '';
      }
      return { ...h, slug: canonicalKey(h.word), definition };
    }),
  );
  return NextResponse.json({ letters, count: enriched.length, results: enriched });
}
