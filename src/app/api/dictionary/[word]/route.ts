import { NextRequest, NextResponse } from 'next/server';
import { getWord } from '@/lib/words';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ word: string }> }
) {
  const { word: raw } = await params;
  const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (!slug || slug.length < 1) {
    return NextResponse.json({ error: 'Word is required' }, { status: 400 });
  }

  const entry = await getWord(slug);
  if (!entry) {
    return NextResponse.json({ error: 'Word not found' }, { status: 404 });
  }

  return NextResponse.json(entry);
}
