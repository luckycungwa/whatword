import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Prevent timeout on long-running requests
export const maxDuration = 300; // 5 minutes

// Mock word data for seeding - matches exact schema
const mockWords = [
  {
    slug: 'hello',
    word: 'Hello',
    phonetic: '/həˈloʊ/',
    audio_url: '',
    part_of_speech: 'interjection',
    definition_simple: 'A polite word used when you meet someone.',
    definition_full: 'Used as a greeting or to begin a conversation.',
    examples: ['Hello, how are you?', 'She said hello to everyone.'],
    synonyms: ['hi', 'greetings'],
    antonyms: ['goodbye'],
    difficulty: 'beginner',
    vocabulary_level: 'A1',
    category: 'Communication',
    subcategories: ['greetings'],
    frequency: 'very-common',
    syllables: ['hel', 'lo'],
    word_forms: {},
    etymology: 'From Middle English hallo.',
    fun_fact: 'Hello became popular with the telephone.',
  },
  {
    slug: 'happy',
    word: 'Happy',
    phonetic: '/ˈhæp.i/',
    audio_url: '',
    part_of_speech: 'adjective',
    definition_simple: 'Feeling or showing pleasure or contentment.',
    definition_full: 'Feeling or showing pleasure or satisfaction about something. Willing to do something.',
    examples: ['I am happy to help you.', 'She has a happy smile.'],
    synonyms: ['pleased', 'cheerful', 'joyful'],
    antonyms: ['sad', 'unhappy'],
    difficulty: 'beginner',
    vocabulary_level: 'A1',
    category: 'Emotions',
    subcategories: ['feelings'],
    frequency: 'very-common',
    syllables: ['hap', 'py'],
    word_forms: { comparative: 'happier', superlative: 'happiest' },
    etymology: 'From Old Norse "happ" meaning luck.',
    fun_fact: 'The smiley emoticon was inspired by happiness.',
  },
  {
    slug: 'beautiful',
    word: 'Beautiful',
    phonetic: '/ˈbjuː.tə.fəl/',
    audio_url: '',
    part_of_speech: 'adjective',
    definition_simple: 'Pleasing to look at; attractive.',
    definition_full: 'Pleasing to the senses or to the mind. Of such a high standard as to deserve admiration.',
    examples: ['She wore a beautiful dress.', 'The sunset was beautiful.'],
    synonyms: ['pretty', 'lovely', 'attractive'],
    antonyms: ['ugly', 'unattractive'],
    difficulty: 'beginner',
    vocabulary_level: 'A2',
    category: 'Character',
    subcategories: ['appearance'],
    frequency: 'very-common',
    syllables: ['beau', 'ti', 'ful'],
    word_forms: { adverb: 'beautifully' },
    etymology: 'From French "beauté".',
    fun_fact: 'Beauty standards vary greatly across cultures.',
  },
  {
    slug: 'intelligent',
    word: 'Intelligent',
    phonetic: '/ɪnˈtel.ɪ.dʒənt/',
    audio_url: '',
    part_of_speech: 'adjective',
    definition_simple: 'Having or showing the ability to learn and understand things quickly.',
    definition_full: 'Smart; showing the ability to learn, understand, and think about things. Good at making correct decisions.',
    examples: ['She is a very intelligent student.', 'That was an intelligent decision.'],
    synonyms: ['smart', 'clever', 'brilliant'],
    antonyms: ['stupid', 'dumb'],
    difficulty: 'intermediate',
    vocabulary_level: 'B1',
    category: 'Character',
    subcategories: ['abilities'],
    frequency: 'common',
    syllables: ['in', 'tel', 'li', 'gent'],
    word_forms: { adverb: 'intelligently' },
    etymology: 'From Latin "intelligentia".',
    fun_fact: 'Intelligence is not just one ability but many.',
  },
  {
    slug: 'create',
    word: 'Create',
    phonetic: '/kriˈeɪt/',
    audio_url: '',
    part_of_speech: 'verb',
    definition_simple: 'To make or produce something new.',
    definition_full: 'To cause something new to come into being; to make something that did not exist before.',
    examples: ['She created a beautiful painting.', 'They created a new company.'],
    synonyms: ['make', 'produce', 'build'],
    antonyms: ['destroy', 'demolish'],
    difficulty: 'beginner',
    vocabulary_level: 'A2',
    category: 'Everyday',
    subcategories: ['actions'],
    frequency: 'common',
    syllables: ['cre', 'ate'],
    word_forms: { past_tense: 'created', present_participle: 'creating' },
    etymology: 'From Latin "creare".',
    fun_fact: 'Creation is central to human expression.',
  },
  {
    slug: 'adventure',
    word: 'Adventure',
    phonetic: '/ədˈven.tʃɚ/',
    audio_url: '',
    part_of_speech: 'noun',
    definition_simple: 'An exciting or unusual experience.',
    definition_full: 'An exciting or unusual experience. A journey or activity that involves some risk or excitement.',
    examples: ['Going to the mountains was an adventure.', 'She loved adventure and excitement.'],
    synonyms: ['experience', 'journey', 'expedition'],
    antonyms: ['routine'],
    difficulty: 'beginner',
    vocabulary_level: 'A2',
    category: 'Everyday',
    subcategories: ['experiences'],
    frequency: 'common',
    syllables: ['ad', 'ven', 'ture'],
    word_forms: { adjective: 'adventurous' },
    etymology: 'From Old French "aventure".',
    fun_fact: 'Adventure travel is a growing industry.',
  },
];

export async function GET(request: NextRequest) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  try {
    // Prepare data with only required/known columns
    const wordsToInsert = mockWords.map(w => ({
      slug: w.slug,
      word: w.word,
      phonetic: w.phonetic,
      audio_url: w.audio_url || null,
      part_of_speech: w.part_of_speech,
      definition_simple: w.definition_simple,
      definition_full: w.definition_full || null,
      examples: w.examples || [],
      synonyms: w.synonyms || [],
      antonyms: w.antonyms || [],
      difficulty: w.difficulty || 'beginner',
      vocabulary_level: w.vocabulary_level || 'A1',
      category: w.category || 'Everyday',
      subcategories: w.subcategories || [],
      frequency: w.frequency || 'common',
      syllables: w.syllables || [],
      word_forms: w.word_forms || {},
      etymology: w.etymology || '',
      fun_fact: w.fun_fact || '',
    }));

    // Upsert all mock words
    const { error } = await supabase
      .from('words')
      .upsert(wordsToInsert, { onConflict: 'slug' });

    if (error) {
      console.error('[Seed] Database error:', error);
      return NextResponse.json(
        { error: 'Failed to seed database', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      wordCount: mockWords.length,
      words: mockWords.map(w => ({ slug: w.slug, word: w.word })),
    });
  } catch (err) {
    console.error('[Seed] Error:', err);
    return NextResponse.json(
      { error: 'Seeding failed', message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

