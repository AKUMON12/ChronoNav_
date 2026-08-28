"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Building,
  GraduationCap,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";
import { Logo } from "@/components/shared/logo";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";
import { createForgotPasswordRequest } from "@/lib/auth/password-manager";

/**
 * Production Forgot Password Request Page
 *
 * Allows students, faculty, and administrators to submit an account recovery request.
 * Enforces zero-password leakage and routes directly to the administrative security queue.
 */
export default function ForgotPasswordPage() {
  const [mounted, setMounted] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <AuthSkeleton />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Please provide your university email or ID number.");
      return;
    }

    setLoading(true);

    try {
      // 1. Direct client-side store sync for immediate reactive updates & notifications
      const localResult = createForgotPasswordRequest(identifier.trim(), reason.trim() || undefined);

      // 2. Server API call
      const res = await fetch("/api/auth/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          reason: reason.trim() || undefined,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit password reset request.");
      } else {
        setSuccessMessage(data.message || localResult.message);
      }
    } catch {
      setLoading(false);
      setErrorMessage("A network error occurred. Please check your connection and try again.");
    }
  };

  return (
    <div className="w-full max-w-md px-4 py-8 relative">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-4">
        <BackButton fallbackUrl="/login" showLabel={false} />
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-black text-primary">
            <KeyRound className="size-3.5" />
            <span>Account Security Recovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Forgot Password
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Submit an authorized administrative password reset request for your University of Cebu account
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-destructive/15 border border-destructive/40 p-3.5 text-xs text-rose-500 font-bold animate-in fade-in">
            <AlertCircle className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Confirmation Card */}
        {successMessage ? (
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2 text-center">
              <div className="flex justify-center">
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="size-6" />
                </div>
              </div>
              <h3 className="text-sm font-black text-foreground">Reset Request Submitted</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {successMessage}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-muted/30 p-3.5 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground font-bold text-[11px]">
                <ShieldCheck className="size-4 text-primary" />
                <span>What happens next?</span>
              </div>
              <ul className="space-y-1.5 text-[11px] pl-5 list-disc">
                <li>Your request is now in the CCS Administrator approval queue.</li>
                <li>Once authorized, a secure, single-use reset authorization token will be generated.</li>
                <li>Your old password remains protected and is never visible to administrators.</li>
              </ul>
            </div>

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                University Email or ID Number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 22682702@uc.edu.ph or 22682702"
                autoCapitalize="none"
                autoCorrect="off"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Reason for Reset Request <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Forgotten password, device change, or security precaution"
                rows={2}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Reset Request to Admin</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Remember your password? Sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
