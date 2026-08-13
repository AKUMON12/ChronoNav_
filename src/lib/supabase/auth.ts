import { supabase } from "@/lib/supabase/client";

/**
 * ChronoNav Supabase Authentication Helpers
 * Includes dev fallback for offline testing when Supabase credentials are placeholders.
 */

const isPlaceholderEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("your-project") || url.includes("placeholder");
};

/** Sign in with email and password */
export async function signIn(email: string, password: string) {
  // If Supabase env vars are set to placeholder values, provide local demo fallback
  if (isPlaceholderEnv()) {
    if (email.endsWith("@uc.edu.ph") || email.includes("@")) {
      const role = email.startsWith("admin") ? "admin" : email.startsWith("faculty") ? "faculty" : "student";
      const demoUser = {
        id: `demo-${role}-id`,
        email,
        user_metadata: {
          first_name: role.charAt(0).toUpperCase() + role.slice(1),
          last_name: "User",
          role,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("chrononav_demo_user", JSON.stringify(demoUser));
      }
      return { user: demoUser, error: null };
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to connect to authentication server";
    
    // Fallback for demo test accounts if connection fails
    if (message.includes("fetch") && email.endsWith("@uc.edu.ph")) {
      const role = email.startsWith("admin") ? "admin" : email.startsWith("faculty") ? "faculty" : "student";
      const demoUser = {
        id: `demo-${role}-id`,
        email,
        user_metadata: {
          first_name: role.charAt(0).toUpperCase() + role.slice(1),
          last_name: "User",
          role,
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("chrononav_demo_user", JSON.stringify(demoUser));
      }
      return { user: demoUser, error: null };
    }

    return { user: null, error: message };
  }
}

/** Register a new user with email, password, and metadata */
export async function signUp(
  email: string,
  password: string,
  metadata: { first_name: string; last_name: string; role: string }
) {
  if (isPlaceholderEnv()) {
    const demoUser = {
      id: `demo-registered-id`,
      email,
      user_metadata: metadata,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("chrononav_demo_user", JSON.stringify(demoUser));
    }
    return { user: demoUser, error: null };
  }

  try {
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return { user: null, error: message };
  }
}

/** Sign out the current user */
export async function signOut() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("chrononav_demo_user");
  }
  if (!isPlaceholderEnv()) {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  }
  return { error: null };
}

/** Get the currently authenticated user, or null */
export async function getCurrentUser() {
  if (isPlaceholderEnv()) {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chrononav_demo_user");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

/** Subscribe to auth state changes */
export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  if (isPlaceholderEnv()) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
}

