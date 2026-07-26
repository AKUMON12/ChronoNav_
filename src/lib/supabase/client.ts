import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Client-side Supabase instance for browser-side operations.
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from env vars.
 * Throws a descriptive error if environment variables are missing or still set to placeholders.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard against missing or placeholder env vars to prevent silent failures
if (
  !supabaseUrl ||
  !supabaseAnonKey ||
  supabaseUrl.includes("placeholder") ||
  supabaseAnonKey.includes("placeholder")
) {
  console.warn(
    "[ChronoNav] Supabase environment variables are missing or contain placeholders.\n" +
    "Copy .env.example to .env.local and add your real Supabase URL and anon key.\n" +
    "Database and auth features will not work until this is configured."
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
