import { MetadataRoute } from 'next';
import { getAllWords, categories } from '@/lib/words';
import { getLocalCorpus } from '@/lib/word-intelligence/corpus';
import { listPageDecision } from '@/lib/word-intelligence/seo-score';

const BASE_URL = 'https://whatword.co.za';

/**
 * Sitemap contains ONLY URLs intended for indexing:
 * - word pages with verified definitions (thin pages noindex themselves AND stay out here)
 * - discovery list pages whose result sets pass the quality gate (>= 5 useful results)
 * - static tool/content hubs
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/words`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/word-finder`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/anagram-solver`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/word-unscrambler`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/synonyms`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/antonyms`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/learn`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/learn/a1`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/learn/a2`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/learn/b1`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/learn/b2`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/learn/c1`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/learn/c2`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/games`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/games/whatword`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/games/definition-challenge`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/games/word-scramble`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/games/spelling`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Only verified-definition words are sitemap-eligible.
  let wordPages: MetadataRoute.Sitemap = [];
  try {
    const all = await getAllWords();
    wordPages = all
      .filter((w) => w.definitions?.simple)
      .map((w) => ({
        url: `${BASE_URL}/words/${w.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
  } catch {
    wordPages = [];
  }

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/learn/${cat.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Discovery pages gated by result-set quality (local corpus = fast, build-safe).
  const { words } = getLocalCorpus();
  const lengthCounts = new Map<number, number>();
  const letterCounts = new Map<string, number>();
  for (const w of words) {
    lengthCounts.set(w.length, (lengthCounts.get(w.length) || 0) + 1);
    const first = w.word[0];
    if (first) letterCounts.set(first, (letterCounts.get(first) || 0) + 1);
  }

  const wordLengthPages: MetadataRoute.Sitemap = [...lengthCounts.entries()]
    .filter(([, count]) => listPageDecision(count) !== 'noindex')
    .map(([len]) => ({
      url: `${BASE_URL}/words/by-length/${len}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  const letterPages: MetadataRoute.Sitemap = [...letterCounts.entries()]
    .filter(([, count]) => listPageDecision(count) !== 'noindex')
    .map(([letter]) => ({
      url: `${BASE_URL}/words/by-letter/${letter}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

  return [...staticPages, ...wordPages, ...categoryPages, ...wordLengthPages, ...letterPages];
}
