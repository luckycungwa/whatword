import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for the words table
export interface Word {
  id: string;
  slug: string;
  word: string;
  phonetic: string;
  audio_url: string;
  part_of_speech: string;
  definition_simple: string;
  definition_full: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology: string;
  fun_fact: string;
  difficulty: string;
  vocabulary_level: string;
  category: string;
  subcategories: string[];
  frequency: string;
  syllables: string[];
  word_forms: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// Query helpers
export async function getAllWords(): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .order('word');
  if (error) throw error;
  return data || [];
}

export async function getWordBySlug(slug: string): Promise<Word | null> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export async function searchWords(query: string, limit = 20): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .or(`word.ilike.%${query}%,definition_simple.ilike.%${query}%`)
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getWordsByLetter(letter: string): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .ilike('slug', `${letter}%`)
    .order('word');
  if (error) throw error;
  return data || [];
}

export async function getWordsByLength(length: number): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .filter('slug', 'eq', length.toString());
  // Postgres doesn't have native string length, use RPC or filter in JS
  const { data: allWords } = await supabase.from('words').select('*');
  if (error) throw error;
  return (allWords || []).filter(w => w.slug.length === length);
}

export async function getWordsByCategory(category: string): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('category', category)
    .order('word');
  if (error) throw error;
  return data || [];
}

export async function getWordsByLevel(level: string): Promise<Word[]> {
  const { data, error } = await supabase
    .from('words')
    .select('*')
    .eq('vocabulary_level', level.toUpperCase())
    .order('word');
  if (error) throw error;
  return data || [];
}

export async function getRelatedWords(slug: string, limit = 5): Promise<Word[]> {
  const word = await getWordBySlug(slug);
  if (!word) return [];
  const { data } = await supabase
    .from('words')
    .select('*')
    .neq('slug', slug)
    .eq('category', word.category)
    .limit(limit);
  return data || [];
}

export async function getWordCount(): Promise<number> {
  const { count } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true });
  return count || 0;
}
