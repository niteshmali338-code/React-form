import { createClient, SupabaseClient } from '@supabase/supabase-js';

const defaultUrl = 'https://nglhhhrmudrxwzfvmdtn.supabase.co';
const defaultKey = 'sb_publishable_hhgyBE1JfvuI4dUALSOm8g_58JvLK7y';

function getValidUrl(rawUrl: string | undefined): string {
  if (!rawUrl || typeof rawUrl !== 'string') return defaultUrl;
  const trimmed = rawUrl.trim();
  if (trimmed.includes('YOUR_PROJECT_REF') || trimmed.includes('MY_SUPABASE') || !trimmed.startsWith('http')) {
    return defaultUrl;
  }
  try {
    const u = new URL(trimmed);
    if (u.protocol === 'http:' || u.protocol === 'https:') {
      return trimmed;
    }
  } catch {
    // Ignore invalid URL
  }
  return defaultUrl;
}

function getValidKey(rawKey: string | undefined): string {
  if (!rawKey || typeof rawKey !== 'string') return defaultKey;
  const trimmed = rawKey.trim();
  if (trimmed.includes('YOUR_PUBLIC') || trimmed.length < 10) {
    return defaultKey;
  }
  return trimmed;
}

const rawEnvUrl = import.meta.env?.VITE_SUPABASE_URL;
const rawEnvKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const SUPABASE_URL = getValidUrl(rawEnvUrl);
export const SUPABASE_ANON_KEY = getValidKey(rawEnvKey);

let client: SupabaseClient | null = null;

try {
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error);
}

export const supabase = client;
