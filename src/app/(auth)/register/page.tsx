"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { signUp } from "@/lib/supabase/auth";

const ACADEMIC_PROGRAMS = [
  { code: "BSCS", name: "BS Computer Science" },
  { code: "BSIT", name: "BS Information Technology" },
  { code: "BSIS", name: "BS Information Systems" },
  { code: "ACT", name: "Associate in Computer Technology" },
  { code: "CpE", name: "BS Computer Engineering" },
];

export default function RegisterPage() {
  const router = useRouter();

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [program, setProgram] = useState("BSCS");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Live UC ID Validation (7 to 9 digits, typically 8 like 22684955)
  const isIdNumberValid = useMemo(() => {
    return /^\d{7,9}$/.test(idNumber.trim());
  }, [idNumber]);

  // Live Password Criteria Verification
  const passwordCriteria = useMemo(() => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }, [password]);

  // Calculate overall password score (0 to 5)
  const passwordScore = useMemo(() => {
    return Object.values(passwordCriteria).filter(Boolean).length;
  }, [passwordCriteria]);

  const isPasswordValid = passwordScore === 5;
  const isConfirmMatch = password.length > 0 && password === confirmPassword;

  const getStrengthMeta = () => {
    if (password.length === 0) return { label: "", color: "bg-muted", width: "0%" };
    if (passwordScore <= 2) return { label: "Weak", color: "bg-rose-500", width: "25%" };
    if (passwordScore === 3) return { label: "Fair", color: "bg-amber-500", width: "50%" };
    if (passwordScore === 4) return { label: "Good", color: "bg-indigo-500", width: "75%" };
    return { label: "Strong & Secure", color: "bg-emerald-500", width: "100%" };
  };

  const strengthMeta = getStrengthMeta();

  // Auto-suggest UC institutional email when ID number is typed
  const handleIdNumberChange = (val: string) => {
    const cleanDigits = val.replace(/\D/g, "").slice(0, 9);
    setIdNumber(cleanDigits);
    if (cleanDigits.length >= 7 && !email) {
      setEmail(`${cleanDigits}@uc.edu.ph`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !idNumber.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required registration fields.");
      return;
    }

    if (!isIdNumberValid) {
      setError("Please provide a valid UC Student ID number (7-9 numeric digits, e.g. 22684955).");
      return;
    }

    if (!isPasswordValid) {
      setError("Your password does not meet all the required security criteria.");
      return;
    }

    if (!isConfirmMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      role: "student",
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-lg px-4 py-8">
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
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Student Account
          </h1>
          <p className="text-xs sm:text-sm text-[#74777E]">
            University of Cebu • College of Computer Studies
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-destructive/15 border border-destructive/40 p-3.5 text-xs text-rose-400 font-bold animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Juan"
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 text-xs font-medium text-white placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Dela Cruz"
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 text-xs font-medium text-white placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>
          </div>

          {/* UC ID Number & Academic Program */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
                  UC Student ID Number
                </label>
                {idNumber && (
                  <span
                    className={`text-[10px] font-bold ${
                      isIdNumberValid ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isIdNumberValid ? "Valid ID" : "Invalid Format"}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => handleIdNumberChange(e.target.value)}
                placeholder="e.g. 22684955"
                maxLength={9}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-bold text-white placeholder:text-[#74777E] focus:outline-none focus:ring-2 transition-all ${
                  idNumber && isIdNumberValid
                    ? "border-emerald-500/50 bg-[#0E151B] focus:ring-emerald-500"
                    : idNumber && !isIdNumberValid
                    ? "border-rose-500/50 bg-[#0E151B] focus:ring-rose-500"
                    : "border-[#507495]/30 bg-[#0E151B] focus:ring-[#1D7DD7]"
                }`}
                required
              />
              <span className="text-[10px] text-[#74777E] block">
                Format: 7-9 digit UC ID (e.g. 22684955)
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
                Degree Program
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              >
                {ACADEMIC_PROGRAMS.map((prog) => (
                  <option key={prog.code} value={prog.code}>
                    {prog.code} - {prog.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
              University Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 22684955@uc.edu.ph"
              className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 text-xs font-medium text-white placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              required
            />
          </div>

          {/* Password with Visibility Toggle */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 pr-11 text-xs font-medium text-white placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74777E] hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {/* Dynamic Strength Bar */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-[#74777E]">Password Strength:</span>
                  <span
                    className={
                      passwordScore === 5
                        ? "text-emerald-400"
                        : passwordScore >= 3
                        ? "text-indigo-400"
                        : "text-rose-400"
                    }
                  >
                    {strengthMeta.label}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#0E151B] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthMeta.color}`}
                    style={{ width: strengthMeta.width }}
                  />
                </div>
              </div>
            )}

            {/* Interactive Password Requirements Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 rounded-2xl bg-[#0E151B]/80 border border-[#507495]/20 p-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                {passwordCriteria.minLength ? (
                  <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-[#74777E] shrink-0" />
                )}
                <span className={passwordCriteria.minLength ? "text-slate-200 font-bold" : "text-[#74777E]"}>
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasUpper ? (
                  <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-[#74777E] shrink-0" />
                )}
                <span className={passwordCriteria.hasUpper ? "text-slate-200 font-bold" : "text-[#74777E]"}>
                  1 uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasLower ? (
                  <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-[#74777E] shrink-0" />
                )}
                <span className={passwordCriteria.hasLower ? "text-slate-200 font-bold" : "text-[#74777E]"}>
                  1 lowercase letter (a-z)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasNumber ? (
                  <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-[#74777E] shrink-0" />
                )}
                <span className={passwordCriteria.hasNumber ? "text-slate-200 font-bold" : "text-[#74777E]"}>
                  1 numeric digit (0-9)
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:col-span-2">
                {passwordCriteria.hasSpecial ? (
                  <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-[#74777E] shrink-0" />
                )}
                <span className={passwordCriteria.hasSpecial ? "text-slate-200 font-bold" : "text-[#74777E]"}>
                  1 special character (!@#$%^&*)
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
                Confirm Password
              </label>
              {confirmPassword && (
                <span className={`text-[10px] font-bold ${isConfirmMatch ? "text-emerald-400" : "text-rose-400"}`}>
                  {isConfirmMatch ? "Passwords Match" : "Do Not Match"}
                </span>
              )}
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 text-xs font-medium text-white placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isIdNumberValid || !isPasswordValid || !isConfirmMatch}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D7DD7] px-4 py-3 text-sm font-extrabold text-white hover:bg-[#1D7DD7]/90 shadow-lg shadow-[#1D7DD7]/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <GraduationCap className="size-4" />
                <span>Register Student Account</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 border-t border-[#507495]/20 text-center space-y-2 text-xs">
          <p className="text-[#74777E]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#1D7DD7] hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-[11px] text-[#74777E]">
            Faculty and staff accounts are provisioned via the CCS Admin Portal.
          </p>
        </div>
      </div>
    </div>
  );
}
