import { NextRequest, NextResponse } from 'next/server';
import { finderQuery, type FinderQuery } from '@/lib/word-intelligence/service';
import { getWord } from '@/lib/words';
import { canonicalKey } from '@/lib/word-intelligence/normalize';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const query: FinderQuery = { limit: 100 };

  if (sp.has('length')) query.length = parseInt(sp.get('length')!);
  if (sp.has('startsWith')) query.startsWith = sp.get('startsWith')!;
  if (sp.has('endsWith')) query.endsWith = sp.get('endsWith')!;
  if (sp.has('contains')) query.contains = sp.get('contains')!;
  if (sp.has('notContains')) query.notContains = sp.get('notContains')!;
  if (sp.has('knownLetters')) query.knownLetters = sp.get('knownLetters')!;
  if (sp.has('pattern')) query.pattern = sp.get('pattern')!;
  if (sp.has('letters')) query.letters = sp.get('letters')!;
  if (sp.has('minLength')) query.minLength = parseInt(sp.get('minLength')!) || 2;
  else if (sp.has('letters')) query.minLength = 2; // unscrambler: skip single letters
  if (sp.has('limit')) query.limit = Math.min(parseInt(sp.get('limit')!) || 100, 200);

  const { hits, total } = await finderQuery(query);
  const results = await Promise.all(
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
  return NextResponse.json({ total, count: results.length, results });
}
