import { NextRequest, NextResponse } from 'next/server';
import { getWord, getAllWords } from '@/lib/words';
import { isSupabaseConfigured } from '@/lib/supabase';

/**
 * Test endpoint to verify word fetching and caching
 * GET /api/test/words - Test fetching individual words
 * GET /api/test/words?all=true - Get all cached words
 * GET /api/test/words?word=hello - Fetch a specific word
 */
export async function GET(request: NextRequest) {
  try {
    const word = request.nextUrl.searchParams.get('word');
    const all = request.nextUrl.searchParams.get('all') === 'true';

    const response: any = {
      timestamp: new Date().toISOString(),
      supabaseConfigured: isSupabaseConfigured,
    };

    if (all) {
      // Get all cached words
      console.log('[Test] Fetching all words from Supabase...');
      const allWords = await getAllWords();
      response.allWords = {
        count: allWords.length,
        sample: allWords.slice(0, 5),
        sampleCount: Math.min(5, allWords.length),
      };
      console.log(`[Test] Found ${allWords.length} cached words`);
    } else if (word) {
      // Fetch a specific word
      console.log(`[Test] Fetching word: "${word}"`);
      const wordEntry = await getWord(word.toLowerCase());
      if (wordEntry) {
        response.word = {
          found: true,
          slug: wordEntry.slug,
          word: wordEntry.word,
          definition: wordEntry.definitions.simple,
          examples: wordEntry.examples.slice(0, 2),
        };
        console.log(`[Test] Successfully fetched: ${wordEntry.word}`);
      } else {
        response.word = { found: false };
        console.log(`[Test] Word not found: "${word}"`);
      }
    } else {
      // Default: test a few common words
      console.log('[Test] Testing word fetching with sample words...');
      const testWords = ['hello', 'serendipity', 'ephemeral', 'vivacious'];
      response.testResults = [];

      for (const testWord of testWords) {
        try {
          console.log(`[Test] Attempting to fetch: "${testWord}"`);
          const entry = await getWord(testWord);
          response.testResults.push({
            word: testWord,
            success: !!entry,
            definition: entry?.definitions.simple.substring(0, 50) + '...',
          });
          console.log(`[Test] ✓ ${testWord} - ${entry ? 'Success' : 'Failed'}`);
        } catch (err) {
          console.error(`[Test] ✗ ${testWord} - Error:`, err);
          response.testResults.push({
            word: testWord,
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error',
          });
        }
      }
    }

    return NextResponse.json(response);
  } catch (err) {
    console.error('[Test] API error:', err);
    return NextResponse.json(
      {
        error: 'Test failed',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
