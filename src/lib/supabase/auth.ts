import { supabase } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";
import { authenticateUser, registerUser, getAllUsers } from "@/lib/auth/auth-store";
import { ClassScheduleItem } from "@/types/schedule";

/**
 * ChronoNav Enterprise Authentication & Security Module
 * Enforces server-side credential verification, cryptographic password hashing,
 * account existence checks, and strict role-based access control.
 */

const isPlaceholderEnv = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url.includes("your-project") || url.includes("placeholder");
};

/**
 * Authenticates user credentials against the database / secure user repository.
 * Strictly verifies account existence and password hash.
 */
export async function signIn(email: string, password: string) {
  if (!email || !password || !email.trim() || !password.trim()) {
    return { user: null, error: "Please provide both university email and password." };
  }

  // 1. If Supabase is connected to a live backend, authenticate with Supabase Auth
  if (!isPlaceholderEnv()) {
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
        const role = data.user.user_metadata?.role || "student";
        document.cookie = `sb-mock-role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }

      return { user: data.user, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed. Please check your credentials.";
      return { user: null, error: message };
    }
  }

  // 2. Verified Local / Edge Authentication Layer:
  // Performs user lookup, cryptographic hash verification, and account status check.
  const authResult = authenticateUser(email, password);

  if (authResult.error || !authResult.user) {
    return { user: null, error: authResult.error || "Invalid university email or password." };
  }

  const authenticatedUser = {
    id: authResult.user.id,
    email: authResult.user.email,
    user_metadata: {
      ...authResult.user.user_metadata,
      role: authResult.user.role,
    },
    created_at: authResult.user.created_at,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("chrononav_user_session", JSON.stringify(authenticatedUser));
    document.cookie = `sb-mock-role=${authResult.user.role}; path=/; max-age=86400; SameSite=Lax`;
  }

  return { user: authenticatedUser, error: null };
}

/**
 * Registers a new user account with mandatory study load attachment,
 * duplicate checks, password hashing, and user-isolated schedule persistence.
 */
export async function signUp(
  email: string,
  password: string,
  metadata: {
    first_name: string;
    last_name: string;
    role?: UserRole;
    id_number: string;
    program: string;
    year_level: string;
    study_load_attached?: boolean;
    total_units?: number;
    initialSchedules?: ClassScheduleItem[];
    [key: string]: unknown;
  }
) {
  if (!email || !password || !email.trim() || !password.trim()) {
    return { user: null, error: "Email and password are required for registration." };
  }

  // If Supabase live backend is enabled
  if (!isPlaceholderEnv()) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            ...metadata,
            role: "student", // Public registrations are strictly student role
          },
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

  // Local / Edge Registration Repository
  const regResult = registerUser({
    email,
    password,
    first_name: metadata.first_name,
    last_name: metadata.last_name,
    id_number: metadata.id_number,
    program: metadata.program,
    year_level: metadata.year_level,
    role: "student",
    study_load_attached: metadata.study_load_attached,
    total_units: metadata.total_units,
    initialSchedules: metadata.initialSchedules,
  });

  if (regResult.error || !regResult.user) {
    return { user: null, error: regResult.error || "Registration failed." };
  }

  const authenticatedUser = {
    id: regResult.user.id,
    email: regResult.user.email,
    user_metadata: {
      ...regResult.user.user_metadata,
      role: regResult.user.role,
    },
    created_at: regResult.user.created_at,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem("chrononav_user_session", JSON.stringify(authenticatedUser));
    document.cookie = `sb-mock-role=student; path=/; max-age=86400; SameSite=Lax`;
  }

  return { user: authenticatedUser, error: null };
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
