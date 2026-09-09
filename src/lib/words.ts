import { supabase, isSupabaseConfigured } from './supabase';
import { getLocalCorpus, type EnrichedCorpusWord } from './word-intelligence/corpus';

// ============================================================
// WordEntry type — the single source of truth for word shape
// ============================================================
export interface WordEntry {
  slug: string;
  word: string;
  phonetic: string;
  audioUrl: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'conjunction' | 'pronoun';
  definitions: { simple: string; full: string };
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  relatedWords: string[];
  wordForms: {
    plural?: string;
    pastTense?: string;
    pastParticiple?: string;
    comparative?: string;
    superlative?: string;
    adverb?: string;
    adjective?: string;
    noun?: string;
    verb?: string;
  };
  syllables: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  vocabularyLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  subcategories: string[];
  frequency: 'very-common' | 'common' | 'uncommon' | 'rare';
  quizEligible: boolean;
  gameEligible: boolean;
  etymology: string;
  funFact: string;
}

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const categories = [
  'Everyday', 'Academic', 'Business', 'Literary', 'Science',
  'Technology', 'Art', 'Nature', 'Emotions', 'Character',
  'Communication', 'Formal', 'Informal', 'Legal', 'Medical',
] as const;

// ============================================================
// dictionaryapi.dev types
// ============================================================
interface DDApiResponse {
  word: string;
  phonetic?: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string; synonyms?: string[]; antonyms?: string[] }[];
    synonyms?: string[];
    antonyms?: string[];
  }[];
  license?: { name: string; url: string };
  sourceUrls?: string[];
}

// ============================================================
// Transform dictionaryapi.dev response → WordEntry
// ============================================================
function transformApiWord(data: DDApiResponse): WordEntry {
  const meanings = data.meanings || [];
  if (meanings.length === 0) return minimalEntry(data.word);

  const firstMeaning = meanings[0];
  const pos = firstMeaning.partOfSpeech || 'noun';

  const allDefs: string[] = [];
  const allExamples: string[] = [];
  const synSet = new Set<string>();
  const antSet = new Set<string>();

  for (const m of meanings) {
    for (const d of m.definitions) {
      if (d.definition) allDefs.push(d.definition);
      if (d.example) allExamples.push(d.example);
      (d.synonyms || []).forEach(s => synSet.add(s));
      (d.antonyms || []).forEach(a => antSet.add(a));
    }
    (m.synonyms || []).forEach(s => synSet.add(s));
    (m.antonyms || []).forEach(a => antSet.add(a));
  }

  const firstDef = firstMeaning.definitions[0]?.definition || '';
  const fullDefs = allDefs.join(' | ');
  const examples = allExamples.slice(0, 3);
  const synonyms = Array.from(synSet).slice(0, 8);
  const antonyms = Array.from(antSet).slice(0, 5);

  const phonetics = data.phonetics || [];
  const audioEntry = phonetics.find(p => p.audio);
  const phoneticText = data.phonetic || phonetics.find(p => p.text)?.text || '';

  const syllables = phoneticText.split(/[.·]/).map(s => s.replace(/[^a-zA-Z]/g, '')).filter(Boolean);

  const posCategory: Record<string, string> = {
    noun: 'Everyday', verb: 'Everyday', adjective: 'Character',
    adverb: 'Communication', preposition: 'Formal', conjunction: 'Formal',
    pronoun: 'Everyday',
  };

  return {
    slug: data.word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    word: data.word.charAt(0).toUpperCase() + data.word.slice(1).toLowerCase(),
    phonetic: phoneticText,
    audioUrl: audioEntry?.audio || '',
    partOfSpeech: pos as WordEntry['partOfSpeech'],
    definitions: { simple: firstDef, full: fullDefs || firstDef },
    examples,
    synonyms,
    antonyms,
    relatedWords: [],
    wordForms: {},
    syllables,
    difficulty: 'beginner',
    vocabularyLevel: 'A1',
    category: posCategory[pos] || 'Everyday',
    subcategories: [],
    frequency: 'common',
    quizEligible: true,
    gameEligible: true,
    etymology: '',
    funFact: '',
  };
}

function minimalEntry(word: string): WordEntry {
  return {
    slug: word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    word: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    phonetic: '',
    audioUrl: '',
    partOfSpeech: 'noun',
    definitions: { simple: '', full: '' },
    examples: [],
    synonyms: [],
    antonyms: [],
    relatedWords: [],
    wordForms: {},
    syllables: [],
    difficulty: 'beginner',
    vocabularyLevel: 'A1',
    category: 'Everyday',
    subcategories: [],
    frequency: 'common',
    quizEligible: false,
    gameEligible: false,
    etymology: '',
    funFact: '',
  };
}

// ============================================================
// Supabase row → WordEntry
// ============================================================
function rowToEntry(row: any): WordEntry {
  return {
    slug: row.slug,
    word: row.word,
    phonetic: row.phonetic || '',
    audioUrl: row.audio_url || row.audioUrl || '',
    partOfSpeech: row.part_of_speech || row.partOfSpeech || 'noun',
    definitions: typeof row.definitions === 'object' && row.definitions
      ? row.definitions
      : { simple: row.definition_simple || '', full: row.definition_full || row.definition_simple || '' },
    examples: row.examples || [],
    synonyms: row.synonyms || [],
    antonyms: row.antonyms || [],
    relatedWords: row.related_words || row.relatedWords || [],
    wordForms: row.word_forms || row.wordForms || {},
    syllables: row.syllables || [],
    difficulty: row.difficulty || 'beginner',
    vocabularyLevel: row.vocabulary_level || row.vocabularyLevel || 'A1',
    category: row.category || 'Everyday',
    subcategories: row.subcategories || [],
    frequency: row.frequency || 'common',
    quizEligible: row.quiz_eligible ?? true,
    gameEligible: row.game_eligible ?? true,
    etymology: row.etymology || '',
    funFact: row.fun_fact || '',
  };
}

// ============================================================
// Fetch from dictionaryapi.dev (free, no key, unlimited)
// ============================================================
const API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

export async function fetchFromApi(word: string): Promise<WordEntry | null> {
  try {
    const url = `${API_BASE}/${encodeURIComponent(word)}`;
    const res = await fetch(url, {
      next: { revalidate: 86400 },
    });
    
    if (!res.ok) {
      console.warn(`[Dictionary API] Failed to fetch "${word}": ${res.status}`);
      return null;
    }
    
    const data = await res.json();
    
    if (!data || !Array.isArray(data) || !data.length) {
      console.debug(`[Dictionary API] No data for "${word}"`);
      return null;
    }
    
    const transformed = transformApiWord(data[0]);
    if (transformed && transformed.definitions.simple) {
      return transformed;
    }
    
    console.debug(`[Dictionary API] Failed to transform "${word}" data`);
    return null;
  } catch (err) {
    console.error(`[Dictionary API] Error fetching "${word}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

// ============================================================
// Core: get a word (Supabase cache → API fallback → store)
// ============================================================
export async function getWord(slug: string): Promise<WordEntry | null> {
  // 1. Check Supabase cache (if configured)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: cached, error } = await supabase
        .from('words')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = "no rows found" which is expected
        console.warn('[Words] Supabase query error:', error.message);
      }

      if (cached) return rowToEntry(cached);
    } catch (err) {
      console.warn('[Words] Supabase cache lookup failed:', err);
      // Fall through to API fetch
    }
  }

  // 2. Fetch from API
  const entry = await fetchFromApi(slug);
  if (!entry || !entry.definitions.simple) return null;

  // 3. Cache in Supabase (fire and forget, if configured)
  if (isSupabaseConfigured && supabase) {
    (async () => {
      try {
        const { error } = await supabase.from('words').upsert({
          slug: entry.slug,
          word: entry.word,
          phonetic: entry.phonetic,
          audio_url: entry.audioUrl,
          part_of_speech: entry.partOfSpeech,
          definition_simple: entry.definitions.simple,
          definition_full: entry.definitions.full,
          examples: entry.examples,
          synonyms: entry.synonyms,
          antonyms: entry.antonyms,
          etymology: entry.etymology,
          fun_fact: entry.funFact,
          difficulty: entry.difficulty,
          vocabulary_level: entry.vocabularyLevel,
          category: entry.category,
          subcategories: entry.subcategories,
          frequency: entry.frequency,
          syllables: entry.syllables,
          word_forms: entry.wordForms,
        }, { onConflict: 'slug' });
        
        if (error) {
          console.warn('[Words] Supabase cache write error:', error.message);
        }
      } catch (err) {
        console.warn('[Words] Supabase cache write failed:', err instanceof Error ? err.message : err);
      }
    })();
  }

  return entry;
}

// ============================================================
// Backward-compatible exports
// ============================================================

export async function getAllWords(): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').order('word');
  return (data || []).map(rowToEntry);
}

export async function getWordBySlug(slug: string): Promise<WordEntry | undefined> {
  const entry = await getWord(slug);
  return entry || undefined;
}

export async function getAllSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('slug');
  return (data || []).map(r => r.slug);
}

export async function searchWords(query: string, limit = 20): Promise<WordEntry[]> {
  const lower = query.toLowerCase();

  // If Supabase is configured, search there first
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase
      .from('words')
      .select('*')
      .or(`word.ilike.%${query}%,definition_simple.ilike.%${query}%`)
      .limit(limit);

    const results = (data || []).map(rowToEntry);
    if (results.length >= limit) return results;

    // If not enough, fetch exact word from API
    if (!results.find(r => r.slug === lower)) {
      const entry = await getWord(lower);
      if (entry && !results.find(r => r.slug === entry.slug)) {
        results.unshift(entry);
      }
    }
    return results.slice(0, limit);
  }

  // No Supabase — just fetch the exact word from API
  const entry = await getWord(lower);
  return entry ? [entry] : [];
}

export async function getWordsByCategory(category: string): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').eq('category', category).order('word');
  return (data || []).map(rowToEntry);
}

export async function getWordsByDifficulty(difficulty: string): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').eq('difficulty', difficulty).order('word');
  return (data || []).map(rowToEntry);
}

export async function getWordsByLevel(level: string): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').eq('vocabulary_level', level).order('word');
  return (data || []).map(rowToEntry);
}

export async function getWordsByFrequency(frequency: string): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').eq('frequency', frequency).order('word');
  return (data || []).map(rowToEntry);
}

export async function getDailyChallenge(): Promise<WordEntry> {
  // Prefer a verified Supabase definition (deterministic per day); fall back to live API.
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from('words')
        .select('*')
        .not('definition_simple', 'is', null)
        .neq('definition_simple', '')
        .limit(200);
      const rows = (data || []).map(rowToEntry).filter((e) => e.definitions.simple);
      if (rows.length > 0) {
        return rows[Math.floor(Date.now() / 86400000) % rows.length];
      }
    } catch {
      // fall through to API list
    }
  }
  // Fetch a random word from the API
  const randomWords = ['serendipity', 'ephemeral', 'luminous', 'whimsical', 'resilient',
    'eloquent', 'mellifluous', 'ubiquitous', 'pragmatic', 'enigmatic'];
  const word = randomWords[Math.floor(Math.random() * randomWords.length)];
  const entry = await getWord(word);
  return entry || minimalEntry(word);
}

export async function getRelatedWords(slug: string, limit = 5): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const word = await getWord(slug);
  if (!word) return [];
  const { data } = await supabase
    .from('words')
    .select('*')
    .neq('slug', slug)
    .eq('category', word.category)
    .limit(limit);
  return (data || []).map(rowToEntry);
}

export async function getWordsByLetter(letter: string): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').ilike('word', `${letter}%`).order('word');
  return (data || []).map(rowToEntry);
}

export async function getWordsByLength(length: number): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*');
  return (data || []).filter(r => r.slug.length === length).map(rowToEntry);
}

export async function getQuizWords(): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').eq('quiz_eligible', true).limit(100);
  return (data || []).map(rowToEntry);
}

export async function getGameWords(): Promise<WordEntry[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  const { data } = await supabase.from('words').select('*').eq('game_eligible', true).limit(100);
  return (data || []).map(rowToEntry);
}

export async function getSynonymsForWord(slug: string): Promise<{ word: string; synonyms: string[] } | undefined> {
  const entry = await getWord(slug);
  if (!entry) return undefined;
  return { word: entry.word, synonyms: entry.synonyms };
}

export async function getAntonymsForWord(slug: string): Promise<{ word: string; antonyms: string[] } | undefined> {
  const entry = await getWord(slug);
  if (!entry) return undefined;
  return { word: entry.word, antonyms: entry.antonyms };
}

// ============================================================
// Dictionary universe: local word graph (guaranteed floor) ∪
// Supabase verified rows (enrichment overlay wins on conflict).
// Pages MUST use this — never getAllWords() alone — so the site
// always has content even when Supabase is empty/offline.
// ============================================================

const POS_VALUES = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun'] as const;

/** A graph-only word as a WordEntry with empty definition fields (definition-pending). */
export function corpusToEntry(c: EnrichedCorpusWord): WordEntry {
  const pos = (POS_VALUES as readonly string[]).includes(c.pos || '')
    ? (c.pos as WordEntry['partOfSpeech'])
    : 'noun';
  return {
    slug: c.word,
    word: c.word.charAt(0).toUpperCase() + c.word.slice(1),
    phonetic: '',
    audioUrl: '',
    partOfSpeech: pos,
    definitions: { simple: '', full: '' },
    examples: [],
    synonyms: [],
    antonyms: [],
    relatedWords: [],
    wordForms: {},
    syllables: [],
    difficulty: c.frequencyBand === 'rare' ? 'advanced' : c.frequencyBand === 'uncommon' ? 'intermediate' : 'beginner',
    vocabularyLevel: c.frequencyBand === 'very-common' ? 'A1' : c.frequencyBand === 'common' ? 'A2' : c.frequencyBand === 'uncommon' ? 'B1' : 'C1',
    category: 'Everyday',
    subcategories: [],
    frequency: c.frequencyBand || 'common',
    quizEligible: false,
    gameEligible: true,
    etymology: '',
    funFact: '',
  };
}

export async function getDictionaryEntries(): Promise<WordEntry[]> {
  const { words: corpus, byWord } = getLocalCorpus();
  const base = corpus.map(corpusToEntry);

  if (!isSupabaseConfigured || !supabase) return base;
  try {
    const { data } = await supabase.from('words').select('*');
    if (!data || data.length === 0) return base;
    const overlay = new Map<string, WordEntry>();
    for (const row of data) {
      try {
        const entry = rowToEntry(row);
        if (entry.slug) overlay.set(entry.slug, entry);
      } catch {
        // skip malformed rows, keep the graph floor intact
      }
    }
    if (overlay.size === 0) return base;
    const merged = base.map((e) => overlay.get(e.slug) ?? e);
    for (const [slug, entry] of overlay) {
      if (!byWord.has(slug)) merged.push(entry);
    }
    merged.sort((a, b) => a.word.localeCompare(b.word));
    return merged;
  } catch {
    return base;
  }
}
