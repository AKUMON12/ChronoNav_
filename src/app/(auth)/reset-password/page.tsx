"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";
import { Logo } from "@/components/shared/logo";
import { validatePasswordStrength } from "@/lib/auth/password-manager";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";

/**
 * Reset Password Content Component (wrapped in Suspense for useSearchParams)
 */
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [accountInfo, setAccountInfo] = useState<{
    userName?: string;
    accountIdentifier?: string;
    role?: string;
  } | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate token on mount
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setVerifying(false);
        setTokenValid(false);
        setTokenError("Missing password reset authorization token.");
        return;
      }

      try {
        const res = await fetch(`/api/auth/password/verify-token?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        setVerifying(false);

        if (res.ok && data.valid) {
          setTokenValid(true);
          setAccountInfo({
            userName: data.user_name,
            accountIdentifier: data.account_identifier,
            role: data.role,
          });
        } else {
          setTokenValid(false);
          setTokenError(data.error || "This reset token is invalid or has already expired.");
        }
      } catch {
        setVerifying(false);
        setTokenValid(false);
        setTokenError("Failed to verify authorization token. Please try again.");
      }
    }

    checkToken();
  }, [token]);

  const strength = useMemo(() => {
    return validatePasswordStrength(newPassword);
  }, [newPassword]);

  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!strength.valid) {
      setErrorMessage(strength.errors[0] || "Password does not meet security requirements.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update password.");
      } else {
        setIsSuccess(true);
      }
    } catch {
      setSubmitting(false);
      setErrorMessage("A network error occurred. Please try again.");
    }
  };

  if (verifying) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-4 text-center">
        <Loader2 className="size-8 text-primary animate-spin mx-auto" />
        <h2 className="text-base font-black text-foreground">Verifying Reset Authorization...</h2>
        <p className="text-xs text-muted-foreground">Checking cryptographic token validity</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="size-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
          <ShieldAlert className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-foreground">Invalid or Expired Token</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tokenError || "This password reset link is invalid, has expired, or has already been used."}
          </p>
        </div>
        <div className="space-y-2 pt-2">
          <Link
            href="/forgot-password"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs sm:text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
          >
            <span>Request New Reset Token</span>
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className="block text-xs font-bold text-muted-foreground hover:text-foreground pt-2"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="rounded-3xl border border-emerald-500/40 bg-card p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in">
        <div className="size-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-foreground">Password Successfully Updated</h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your account credentials have been securely updated with a new cryptographic hash. All prior sessions have been terminated.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-muted/30 p-3.5 text-[11px] text-muted-foreground text-left space-y-1">
          <p className="font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>Security Verification:</span>
          </p>
          <p>Your single-use authorization token has been consumed and deactivated.</p>
        </div>
        <Link
          href="/login"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
        >
          <span>Sign In with New Password</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
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
          Create New Password
        </h1>
        {accountInfo && (
          <p className="text-xs text-muted-foreground">
            Account: <span className="font-bold text-foreground">{accountInfo.userName}</span> ({accountInfo.accountIdentifier})
          </p>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-destructive/15 border border-destructive/40 p-3.5 text-xs text-rose-500 font-bold animate-in fade-in">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
            New Secure Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new account password"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new account password"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Password Strength Requirements Checklist */}
        <div className="rounded-2xl border border-border bg-muted/20 p-3.5 space-y-2 text-xs">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            Institutional Password Policy
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
            <div className={`flex items-center gap-1.5 ${strength.checks.minLength ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>At least 8 characters</span>
            </div>
            <div className={`flex items-center gap-1.5 ${strength.checks.hasUpper ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>1 uppercase letter (A-Z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${strength.checks.hasLower ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>1 lowercase letter (a-z)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${strength.checks.hasNumber ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>1 number digit (0-9)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${strength.checks.hasSpecial ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>1 special character (!@#$)</span>
            </div>
            <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-emerald-500 font-bold" : "text-muted-foreground"}`}>
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>Passwords match</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !strength.valid || !passwordsMatch}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Updating Password & Invalidating Sessions...</span>
            </>
          ) : (
            <>
              <span>Save & Finalize Password</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

/**
 * Root Page Wrapper with Suspense Boundary for search parameters
 */
export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md px-4 py-8 relative">
      <div className="flex items-center justify-between mb-4">
        <BackButton fallbackUrl="/login" showLabel={false} />
        <ThemeToggle compact={false} />
      </div>

      <Suspense fallback={<AuthSkeleton />}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
