import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Creates a server-side Supabase client instance.
 * For Next.js Server Components, Server Actions, and API Route Handlers.
 * Logs a warning if env vars are missing or still set to placeholders.
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Guard against missing or placeholder env vars
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("placeholder") ||
    supabaseAnonKey.includes("placeholder")
  ) {
    console.warn(
      "[ChronoNav Server] Supabase environment variables are missing or contain placeholders.\n" +
      "Copy .env.example to .env.local and add your real Supabase URL and anon key.\n" +
      "Server-side database operations will not work until this is configured."
    );
  }

  return createClient<Database>(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key",
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
