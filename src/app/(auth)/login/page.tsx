"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "@/lib/supabase/auth";

/**
 * Login Page — Email + Password authentication form.
 * Uses Supabase signInWithPassword. Redirects to /admin on success.
 * Wrapped by (auth)/layout.tsx which centers it on the screen.
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // TODO: Route based on user role (student vs admin)
      router.push("/admin");
    }
  };

  return (
    <div className="w-full max-w-md px-4">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-lg space-y-6">
        {/* Logo and heading */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Compass className="size-7" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your ChronoNav account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="text-xs font-bold text-muted-foreground uppercase">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@uc.edu.ph"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="text-xs font-bold text-muted-foreground uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center space-y-2 text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
