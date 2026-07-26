"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Eye, EyeOff, Loader2 } from "lucide-react";
import { signUp } from "@/lib/supabase/auth";

/**
 * Registration Page — New user account creation form.
 * Collects name, email, password, and role (student/faculty).
 * Admin accounts are created through the admin panel, not self-registration.
 */
export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "faculty">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      role,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Redirect to login with success indicator
      router.push("/login?registered=true");
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
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Create Your Account</h1>
          <p className="text-sm text-muted-foreground">Join ChronoNav at UC Main Campus</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name fields — side by side on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="reg-first-name" className="text-xs font-bold text-muted-foreground uppercase">
                First Name
              </label>
              <input
                id="reg-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Juan"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="reg-last-name" className="text-xs font-bold text-muted-foreground uppercase">
                Last Name
              </label>
              <input
                id="reg-last-name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Dela Cruz"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-xs font-bold text-muted-foreground uppercase">
              University Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.delacruz@uc.edu.ph"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="email"
              required
            />
          </div>

          {/* Role selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors ${
                  role === "student"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("faculty")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors ${
                  role === "faculty"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-accent"
                }`}
              >
                Faculty
              </button>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-xs font-bold text-muted-foreground uppercase">
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoComplete="new-password"
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

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label htmlFor="reg-confirm-password" className="text-xs font-bold text-muted-foreground uppercase">
              Confirm Password
            </label>
            <input
              id="reg-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            <span>{loading ? "Creating account..." : "Create Account"}</span>
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center space-y-2 text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
