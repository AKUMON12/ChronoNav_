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
  Sparkles,
  KeyRound,
  UserCheck,
} from "lucide-react";
import { signIn } from "@/lib/supabase/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";
import { Logo } from "@/components/shared/logo";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

/**
 * Verified University Accounts for Quick Demo Testing
 */
const DEMO_PRESETS = [
  {
    label: "Admin Portal",
    badge: "Admin",
    email: "admin@uc.edu.ph",
    password: "Admin@ChronoNav2026!",
    role: "admin",
  },
  {
    label: "Faculty Workload",
    badge: "Faculty",
    email: "maria.santos@uc.edu.ph",
    password: "Faculty@ChronoNav2026!",
    role: "faculty",
  },
  {
    label: "Student (Vince • BSIT 4)",
    badge: "Student",
    email: "22682702@uc.edu.ph",
    password: "Student@ChronoNav2026!",
    role: "student",
  },
  {
    label: "Student (Tristan • BSCS 3)",
    badge: "Student",
    email: "22684955@uc.edu.ph",
    password: "Student@ChronoNav2026!",
    role: "student",
  },
];

/**
 * Production Secure Login Page
 * Supports flexible identifier lookup (Email or Student/Faculty ID), verified password authentication,
 * and quick-fill university testing presets.
 */
export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <AuthSkeleton />;
  }

  const handleQuickFill = (preset: (typeof DEMO_PRESETS)[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your university email / ID and password.");
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
              className="hover:scale-105 transition-transform"
              aria-label="ChronoNav Home"
            >
              <Logo size="lg" priority={true} />
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
              University Email / Student ID
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 22682702@uc.edu.ph or 22682702"
              autoCapitalize="none"
              autoCorrect="off"
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
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

        {/* ── Quick Demo Accounts Quick-Fill Panel ── */}
        {/* <div className="rounded-2xl border border-border/80 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <KeyRound className="size-3 text-primary" />
            <span>Pre-Configured University Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.email}
                type="button"
                onClick={() => handleQuickFill(preset)}
                className="flex items-center justify-between p-2 rounded-xl border border-border/60 bg-card hover:border-primary/50 hover:bg-accent/40 transition-all text-left group"
              >
                <div className="truncate">
                  <p className="text-[11px] font-black text-foreground truncate leading-tight">
                    {preset.label}
                  </p>
                  <p className="text-[9px] text-muted-foreground truncate">{preset.email}</p>
                </div>
                <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0 ml-1">
                  Fill
                </span>
              </button>
            ))}
          </div>
        </div> */}

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
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs sm:text-sm font-extrabold text-foreground hover:bg-accent hover:border-primary/50 transition-all"
        >
          <Compass className="size-4 text-primary" />
          <span>Explore Campus Map as Guest</span>
        </Link>

        {/* Register Account Link */}
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-extrabold text-primary hover:underline underline-offset-4"
          >
            Register with Study Load
          </Link>
        </p>
      </div>
    </div>
  );
}
