import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Anon-key client for public reads. RLS restricts every query made through
 * this client to approved, publicly-readable rows — see the migration.
 * Returns null (never throws) when env vars are absent so pages can render
 * an honest empty state instead of crashing the build.
 */
export function getPublicSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_TECHMELD_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_TECHMELD_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: false },
  });

  return cachedClient;
}
