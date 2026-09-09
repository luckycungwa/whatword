import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('...') &&
  !supabaseAnonKey.includes('...');

// Log configuration status in development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('[Supabase] Configuration status:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isConfigured,
    urlValid: supabaseUrl ? !supabaseUrl.includes('...') : false,
    keyValid: supabaseAnonKey ? !supabaseAnonKey.includes('...') : false,
  });
}

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = !!isConfigured;
