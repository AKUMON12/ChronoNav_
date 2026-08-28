import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

/**
 * ChronoNav Supabase Authentication Helpers
 * Production-ready authentication module supporting role-based user sessions.
 */

const isPlaceholderEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("your-project") || url.includes("placeholder");
};

/** Sign in with email and password */
export async function signIn(email: string, password: string) {
  if (!email || !password) {
    return { user: null, error: "Please provide both email and password." };
  }

  // If Supabase environment variables are placeholders (e.g. initial dev/offline sandbox),
  // derive role cleanly from email domain/prefix for testing without hardcoded passwords.
  if (isPlaceholderEnv()) {
    const cleanEmail = email.trim().toLowerCase();
    const role: UserRole = cleanEmail.startsWith("admin")
      ? "admin"
      : cleanEmail.startsWith("faculty")
      ? "faculty"
      : "student";

    const nameParts = cleanEmail.split("@")[0].split(".");
    const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : "University";
    const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : "Member";

    const demoUser = {
      id: `usr_${role}_${Date.now().toString(36)}`,
      email: cleanEmail,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role,
      },
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("chrononav_user_session", JSON.stringify(demoUser));
      // Set session cookie for middleware fallback in development
      document.cookie = `sb-mock-role=${role}; path=/; max-age=86400; SameSite=Lax`;
    }
    return { user: demoUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (typeof window !== "undefined" && data.user) {
      localStorage.setItem("chrononav_user_session", JSON.stringify(data.user));
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed. Please check your credentials.";
    return { user: null, error: message };
  }
}

export async function signUp(
  email: string,
  password: string,
  metadata: {
    first_name: string;
    last_name: string;
    role: UserRole;
    id_number?: string;
    program?: string;
    year_level?: string;
    study_load_attached?: boolean;
    total_units?: number;
    [key: string]: unknown;
  }
) {
  if (isPlaceholderEnv()) {
    const demoUser = {
      id: `usr_${metadata.role}_${Date.now().toString(36)}`,
      email: email.trim().toLowerCase(),
      user_metadata: metadata,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("chrononav_user_session", JSON.stringify(demoUser));
      document.cookie = `sb-mock-role=${metadata.role}; path=/; max-age=86400; SameSite=Lax`;
    }
    return { user: demoUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
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

/** Sign out the current user session and thoroughly destroy all auth cookies/tokens */
export async function signOut() {
  if (typeof window !== "undefined") {
    // 1. Purge all local storage tokens & cached profile payloads
    localStorage.removeItem("chrononav_user_session");
    localStorage.removeItem("sb-access-token");
    localStorage.removeItem("sb-refresh-token");
    sessionStorage.clear();

    // 2. Expire development and edge middleware cookies across domain
    const cookieNames = [
      "sb-mock-role",
      "sb-access-token",
      "sb-refresh-token",
      "supabase-auth-token",
    ];

    cookieNames.forEach((name) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
      document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    });
  }

  if (!isPlaceholderEnv()) {
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" });
      return { error: error?.message || null };
    } catch {
      return { error: null };
    }
  }
  return { error: null };
}

/** Update user profile information across active session and Supabase */
export async function updateUserProfile(updates: {
  first_name?: string;
  last_name?: string;
  id_number?: string;
  program?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  phone?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  bio?: string;
}) {
  if (typeof window !== "undefined") {
    const current = await getCurrentUser();
    if (current) {
      const updatedMetadata = {
        ...(current.user_metadata || {}),
        ...updates,
      };
      const updatedUser = {
        ...current,
        user_metadata: updatedMetadata,
      };
      localStorage.setItem("chrononav_user_session", JSON.stringify(updatedUser));
    }
  }

  if (!isPlaceholderEnv()) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (error) return { user: null, error: error.message };
      return { user: data.user, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile.";
      return { user: null, error: msg };
    }
  }

  const user = await getCurrentUser();
  return { user, error: null };
}

/** Get the currently authenticated user profile */
export async function getCurrentUser() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("chrononav_user_session");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback to supabase auth
      }
    }
  }

  if (!isPlaceholderEnv()) {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return null;
      return data.user;
    } catch {
      return null;
    }
  }

  return null;
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

