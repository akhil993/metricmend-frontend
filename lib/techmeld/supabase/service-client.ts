import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null | undefined;

/**
 * Service-role client. Bypasses RLS — every ingestion write, admin mutation,
 * newsletter signup, and community submission goes through this client, and
 * ONLY from server code (API routes / lib/techmeld). Never import this file
 * from a "use client" component or from lib/techmeld/queries.ts.
 */
export function getServiceSupabaseClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error(
      "[techmeld] getServiceSupabaseClient must never be called from the browser"
    );
  }

  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.TECHMELD_SUPABASE_URL;
  const serviceRoleKey = process.env.TECHMELD_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedClient;
}
