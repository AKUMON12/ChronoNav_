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
  GraduationCap,
} from "lucide-react";
import { signIn } from "@/lib/supabase/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";

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
    <div className="w-full max-w-md px-4 py-8 relative">
      {/* Top Header Navigation: Back Button (Left) & Theme Toggle (Right) */}
      <div className="flex items-center justify-between mb-4">
        <BackButton fallbackUrl="/" showLabel={false} />
        <ThemeToggle compact={false} />
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 transition-colors duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Link
              href="/"
              className="flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
              aria-label="ChronoNav Home"
            >
              <Compass className="size-8" />
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Sign In to ChronoNav
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            University of Cebu • College of Computer Studies
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-destructive/15 border border-destructive/40 p-3.5 text-xs text-rose-500 font-bold animate-in fade-in">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              University Email / ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 22684955@uc.edu.ph"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] font-black uppercase">
            <span className="bg-card px-2 text-muted-foreground">Guest Access</span>
          </div>
        </div>

        {/* Explore as Guest CTA Button */}
        <Link
          href="/explore"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 hover:bg-accent px-4 py-3 text-xs sm:text-sm font-extrabold text-foreground transition-all shadow-sm group"
        >
          <Map className="size-4 text-primary group-hover:scale-110 transition-transform" />
          <span>Explore Campus Map as Guest</span>
          <ArrowRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* Footer */}
        <div className="pt-2 border-t border-border text-center space-y-2 text-xs">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Create Student Account
            </Link>
          </p>
          <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>Strict End-to-End Session RBAC & Supabase SSR Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
