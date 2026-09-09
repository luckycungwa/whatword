-- WhatWord Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main words table
CREATE TABLE IF NOT EXISTS words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  word TEXT NOT NULL,
  phonetic TEXT,
  audio_url TEXT,
  part_of_speech TEXT NOT NULL,
  definition_simple TEXT NOT NULL,
  definition_full TEXT,
  examples TEXT[] DEFAULT '{}',
  synonyms TEXT[] DEFAULT '{}',
  antonyms TEXT[] DEFAULT '{}',
  etymology TEXT,
  fun_fact TEXT,
  difficulty TEXT DEFAULT 'beginner',
  vocabulary_level TEXT DEFAULT 'A1',
  category TEXT DEFAULT 'Everyday',
  subcategories TEXT[] DEFAULT '{}',
  frequency TEXT DEFAULT 'common',
  syllables TEXT[] DEFAULT '{}',
  word_forms JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_words_slug ON words(slug);
CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);
CREATE INDEX IF NOT EXISTS idx_words_part_of_speech ON words(part_of_speech);
CREATE INDEX IF NOT EXISTS idx_words_category ON words(category);
CREATE INDEX IF NOT EXISTS idx_words_vocabulary_level ON words(vocabulary_level);
CREATE INDEX IF NOT EXISTS idx_words_difficulty ON words(difficulty);
CREATE INDEX IF NOT EXISTS idx_words_frequency ON words(frequency);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_words_search ON words
  USING gin(to_tsvector('english', word || ' ' || coalesce(definition_simple, '')));

-- Enable Row Level Security (read-only for public)
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Public read access (no write from client)
CREATE POLICY "Words are viewable by everyone" ON words
  FOR SELECT USING (true);

-- Grant access to anon role
GRANT SELECT ON words TO anon;
GRANT SELECT ON words TO authenticated;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_words_updated_at
  BEFORE UPDATE ON words
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
