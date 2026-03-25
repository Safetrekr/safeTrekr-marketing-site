/**
 * ST-804: REQ-021 -- Server-side Supabase Client
 *
 * Creates a Supabase client configured for server-side usage with the
 * service role key. This client bypasses Row Level Security and should
 * only be used in trusted server contexts (API routes, server actions).
 *
 * Exported as a factory function (not a singleton) for edge compatibility
 * and to avoid sharing a single client instance across concurrent requests.
 *
 * Required environment variables:
 * - NEXT_PUBLIC_SUPABASE_URL  -- Supabase project URL
 * - SUPABASE_SERVICE_ROLE_KEY -- Service role key (never expose to the client)
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a new Supabase client for server-side operations.
 *
 * Each invocation returns a fresh client instance. This avoids shared
 * mutable state across requests and is safe to call from any server
 * runtime (Node.js, edge, serverless).
 *
 * @throws {Error} If required environment variables are missing.
 *
 * @example
 * ```ts
 * import { createServerSupabaseClient } from "@/lib/supabase/server";
 *
 * const supabase = createServerSupabaseClient();
 * const { data, error } = await supabase.from("contacts").select("*");
 * ```
 */
export function createServerSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. " +
        "Ensure it is set in your .env.local or deployment environment.",
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY. " +
        "Ensure it is set in your .env.local or deployment environment.",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      // The service role key bypasses RLS. Disable auto-refresh and
      // session persistence since this is a server-only client.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
