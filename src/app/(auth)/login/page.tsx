"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Eye,
  EyeOff,
  Loader2,
  Map,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { signIn } from "@/lib/supabase/auth";

/**
 * Production Secure Login Page
 * Zero credential leaks: Eliminates all mock account quick-fill toggles and hardcoded passwords.
 * Provides direct Supabase password authentication and a guest campus explorer entry point.
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

    if (!email.trim() || !password.trim()) {
      setError("Please enter your university email and password.");
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      const role = result.user?.user_metadata?.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "faculty") {
        router.push("/faculty/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8">
      <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Link
              href="/"
              className="flex size-14 items-center justify-center rounded-2xl bg-[#1D7DD7] text-white shadow-lg shadow-[#1D7DD7]/30 hover:scale-105 transition-transform"
              aria-label="ChronoNav Home"
            >
              <Compass className="size-8" />
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Sign In to ChronoNav
          </h1>
          <p className="text-xs sm:text-sm text-[#74777E]">
            University of Cebu • College of Computer Studies
          </p>
        </div>

        {/* Guest Mode Action Banner */}
        <div className="rounded-2xl border border-[#507495]/30 bg-[#0E151B]/80 p-4 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Map className="size-3.5 text-[#1D7DD7]" />
              <span>Visiting Campus as a Guest?</span>
            </p>
            <p className="text-[11px] text-[#74777E]">
              View the interactive CCS building map without signing in.
            </p>
          </div>
          <Link
            href="/explore"
            className="flex items-center gap-1.5 rounded-xl bg-[#1D7DD7]/15 border border-[#1D7DD7]/40 px-3 py-2 text-xs font-extrabold text-[#1D7DD7] hover:bg-[#1D7DD7] hover:text-white transition-all shrink-0"
          >
            <span>Explore</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Visual Error Banner */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-destructive/15 border border-destructive/40 p-3.5 text-xs text-rose-400 font-bold animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Secure Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block"
            >
              University Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. j.delacruz@uc.edu.ph"
              className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-3 text-sm font-medium text-foreground placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7] transition-all"
              autoComplete="email"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-3 pr-11 text-sm font-medium text-foreground placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7] transition-all"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74777E] hover:text-foreground transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D7DD7] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#1D7DD7]/90 shadow-lg shadow-[#1D7DD7]/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" />
                <span>Sign In Securely</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="pt-2 border-t border-[#507495]/20 text-center space-y-3 text-xs">
          <p className="text-[#74777E]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-[#1D7DD7] hover:underline"
            >
              Create Account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-[#74777E]">
            <Link href="/" className="hover:text-foreground transition-colors">
              Return Home
            </Link>
            <span>•</span>
            <Link href="/explore" className="hover:text-foreground transition-colors">
              Campus Map
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Notice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
