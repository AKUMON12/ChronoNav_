import { supabase } from "@/lib/supabase/client";
import type { User } from "@/types/database";

/**
 * ChronoNav Supabase Authentication Helpers
 * Wraps Supabase auth methods with typed returns.
 */

/** Sign in with email and password */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

/** Register a new user with email, password, and metadata */
export async function signUp(
  email: string,
  password: string,
  metadata: { first_name: string; last_name: string; role: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

/** Sign out the current user */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

/** Get the currently authenticated user, or null */
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

/** Subscribe to auth state changes */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
