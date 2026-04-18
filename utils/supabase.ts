/**
 * supabase.ts — Singleton Supabase client for the frontend.
 *
 * Rules:
 *  - Only the public anon key is used here. Never import server-side
 *    service-role keys in client components.
 *  - The client is created once and reused (singleton pattern) to
 *    prevent multiple GoTrue auth instances being spawned.
 *  - We validate env vars at module load time so missing config is
 *    caught immediately during development, not silently at runtime.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Env Validation ──────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    '[Supabase] Missing env var: NEXT_PUBLIC_SUPABASE_URL\n' +
    'Create a .env.local file with your Supabase project URL.'
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    '[Supabase] Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
    'Create a .env.local file with your Supabase anon key.'
  );
}

// ─── Singleton Client ─────────────────────────────────────────────────────────

let _supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  _supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      // This dashboard has no user auth — disable persistent sessions
      // to avoid unnecessary localStorage writes.
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: {
      // Increase timeout for unstable connections (e.g. IoT environments).
      timeout: 30_000,
    },
  });

  return _supabase;
}

// Re-export a convenient default instance
export const supabase = getSupabaseClient();