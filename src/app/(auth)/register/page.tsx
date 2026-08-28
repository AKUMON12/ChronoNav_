"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
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
  UploadCloud,
  FileText,
  ScanLine,
  CheckCheck,
  Building2,
  MapPin,
  Clock,
  X,
  FileCheck,
  RefreshCw,
} from "lucide-react";
import { signUp } from "@/lib/supabase/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";
import { Logo } from "@/components/shared/logo";
import { AuthSkeleton } from "@/components/skeletons/auth-skeleton";
import { processOCRFile, getSampleUCStudyLoadVince } from "@/lib/ocr/parser";
import { OCRScheduleResult } from "@/types/schedule";

const ACADEMIC_PROGRAMS = [
  { code: "BSIT", name: "BS Information Technology" },
  { code: "BSCS", name: "BS Computer Science" },
  { code: "BSIS", name: "BS Information Systems" },
  { code: "ACT", name: "Associate in Computer Technology" },
  { code: "CpE", name: "BS Computer Engineering" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Study Load Attachment State (Mandatory)
  const [studyLoadFile, setStudyLoadFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRScheduleResult | null>(null);
  const [studyLoadError, setStudyLoadError] = useState<string | null>(null);

  // Form Fields (Auto-filled from Study Load)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [program, setProgram] = useState("BSIT");
  const [yearLevel, setYearLevel] = useState("4th Year");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live UC ID Validation (7 to 9 digits, typically 8 like 22682702)
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

  if (!mounted) {
    return <AuthSkeleton />;
  }

  const isPasswordValid = passwordScore === 5;
  const isConfirmMatch = password.length > 0 && password === confirmPassword;
  const isStudyLoadAttached = !!ocrResult && ocrResult.parsedItems.length > 0;

  const getStrengthMeta = () => {
    if (password.length === 0) return { label: "", color: "bg-muted", width: "0%" };
    if (passwordScore <= 2) return { label: "Weak", color: "bg-rose-500", width: "25%" };
    if (passwordScore === 3) return { label: "Fair", color: "bg-amber-500", width: "50%" };
    if (passwordScore === 4) return { label: "Good", color: "bg-indigo-500", width: "75%" };
    return { label: "Strong & Secure", color: "bg-emerald-500", width: "100%" };
  };

  const strengthMeta = getStrengthMeta();

  // Apply OCR Extraction to Form Fields
  const applyExtractedStudentData = (res: OCRScheduleResult, filename = "Official_Study_Load.pdf") => {
    setOcrResult(res);
    setStudyLoadError(null);

    const stud = res.extractedStudent;
    if (stud) {
      if (stud.firstName) setFirstName(stud.firstName);
      if (stud.lastName) setLastName(stud.lastName);
      if (stud.idNumber) {
        setIdNumber(stud.idNumber);
        setEmail(`${stud.idNumber}@uc.edu.ph`);
      }
      if (stud.program) {
        const found = ACADEMIC_PROGRAMS.find(
          (p) => p.code.toLowerCase() === stud.program?.toLowerCase()
        );
        if (found) setProgram(found.code);
        else setProgram(stud.program);
      }
      if (stud.yearLevel) setYearLevel(stud.yearLevel);
    }
  };

  // Handle User File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type (PDF or Image)
    const isValidType =
      file.type === "application/pdf" ||
      file.type.startsWith("image/") ||
      file.name.endsWith(".pdf");

    if (!isValidType) {
      setStudyLoadError("Please upload a valid University of Cebu Official Study Load document (PDF, PNG, JPG).");
      return;
    }

    setStudyLoadFile(file);
    setIsScanning(true);
    setStudyLoadError(null);

    try {
      const result = await processOCRFile(file);
      applyExtractedStudentData(result, file.name);
    } catch (err) {
      setStudyLoadError("Unable to extract schedule. Please check the document format and re-upload.");
    } finally {
      setIsScanning(false);
    }
  };

  // Quick Action: Load Sample Study Load (PDF Demo)
  const handleLoadSampleStudyLoad = async () => {
    setIsScanning(true);
    setStudyLoadError(null);
    await new Promise((r) => setTimeout(r, 800));
    const sampleResult = getSampleUCStudyLoadVince();
    applyExtractedStudentData(sampleResult, "Official_Study_Load_SY2025_2026.pdf");
    setIsScanning(false);
  };

  // Clear attached study load
  const handleClearStudyLoad = () => {
    setOcrResult(null);
    setStudyLoadFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

    // Mandatory Study Load Check
    if (!isStudyLoadAttached) {
      setError("Official Study Load attachment is required. Please upload your university study load (PDF or Image) to calibrate your dedicated rooms and floors.");
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !idNumber.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required registration fields.");
      return;
    }

    if (!isIdNumberValid) {
      setError("Please provide a valid UC Student ID number (7-9 numeric digits, e.g. 22682702).");
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

    const parsedScheduleItems = ocrResult?.parsedItems || [];

    const result = await signUp(email, password, {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      id_number: idNumber.trim(),
      program: program.trim(),
      year_level: yearLevel,
      role: "student",
      study_load_attached: true,
      total_units: ocrResult?.extractedStudent?.totalUnits || (parsedScheduleItems.length ? parsedScheduleItems.length * 3 : 15),
      initialSchedules: parsedScheduleItems,
    });
    setLoading(false);

    if (result.error || !result.user) {
      setError(result.error || "Registration failed. Please check your credentials.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-2xl px-4 py-8 relative">
      {/* Top Header: Back Button (Left) & Theme Toggle (Right) */}
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
            Register Student Account
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

        {/* ── MANDATORY STEP 1: OFFICIAL STUDY LOAD ATTACHMENT CARD ── */}
        <section className="rounded-3xl border border-primary/40 bg-primary/5 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-primary/20 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/30">
                <ScanLine className="size-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-foreground flex items-center gap-2">
                  <span>1. Attach Official Study Load</span>
                  <span className="rounded-md bg-primary text-white text-[9px] px-1.5 py-0.2 font-black uppercase">
                    Mandatory
                  </span>
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Required to calibrate your dedicated classroom rooms and floor routes.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLoadSampleStudyLoad}
              disabled={isScanning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/40 bg-card hover:bg-accent text-xs font-bold text-primary transition-all self-start sm:self-auto shadow-sm"
              title="Load sample UC Study Load PDF"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>Load Sample Study Load (PDF Demo)</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/webp"
            onChange={handleFileUpload}
            className="hidden"
            id="study-load-upload"
          />

          {!ocrResult && !isScanning && (
            <label
              htmlFor="study-load-upload"
              className="group flex flex-col items-center justify-center border-2 border-dashed border-primary/40 rounded-2xl p-6 bg-card/60 hover:bg-card hover:border-primary cursor-pointer transition-all text-center space-y-2"
            >
              <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <UploadCloud className="size-8" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-foreground block">
                  Click to Upload Official Study Load (PDF or Image)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Accepts official University of Cebu enrollment documents (.pdf, .png, .jpg)
                </span>
              </div>
            </label>
          )}

          {/* Scanning Progress Spinner */}
          {isScanning && (
            <div className="rounded-2xl border border-border bg-card p-6 text-center space-y-3 animate-in fade-in">
              <RefreshCw className="size-8 mx-auto text-primary animate-spin" />
              <div>
                <p className="text-xs font-black text-foreground">
                  Scanning Study Load & Calibrating Campus Rooms...
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Extracting student identity, enrolled subjects, and 8-floor room assignments.
                </p>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {studyLoadError && (
            <div className="flex items-center gap-2 rounded-xl bg-destructive/15 border border-destructive/30 p-3 text-xs text-rose-500 font-bold">
              <AlertCircle className="size-4 shrink-0" />
              <span>{studyLoadError}</span>
            </div>
          )}

          {/* Extracted Study Load Preview Card */}
          {ocrResult && (
            <div className="rounded-2xl border border-emerald-500/40 bg-card p-4 space-y-3.5 shadow-md animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black">
                    <FileCheck className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black text-foreground">
                        {ocrResult.extractedStudent?.fullName || `${firstName} ${lastName}`}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase">
                        <CheckCheck className="size-3" /> Verified Study Load
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono font-semibold">
                      UC ID: <span className="text-foreground">{ocrResult.extractedStudent?.idNumber || idNumber}</span> •{" "}
                      {ocrResult.extractedStudent?.program || program} • {ocrResult.extractedStudent?.totalUnits || 15} Units
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClearStudyLoad}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-destructive/10 transition-colors self-end sm:self-auto"
                  title="Remove Attached Study Load"
                  aria-label="Remove study load"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Extracted Classrooms & Floors Summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
                  CALIBRATED ROOMS & FLOORS ({ocrResult.parsedItems.length} SESSIONS)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {ocrResult.parsedItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-border bg-muted/30 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-foreground text-xs">{item.courseCode}</span>
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-1.5 py-0.2 rounded">
                          {item.dayOfWeek}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-bold text-foreground">
                          <MapPin className="size-3 text-primary" />
                          <span>Room {item.room}</span>
                        </span>
                        <span className="font-bold text-primary">
                          {item.floor === "M" ? "Mezzanine" : `Floor ${item.floor}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── STEP 2: REGISTRATION FORM & CREDENTIALS ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="text-xs font-black text-foreground uppercase tracking-wider">
              2. Student Identity & Security Credentials
            </h3>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Vince Andrew"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Santoya"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                required
              />
            </div>
          </div>

          {/* UC ID Number & Academic Program */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                  UC Student ID Number
                </label>
                {idNumber && (
                  <span
                    className={`text-[10px] font-bold ${
                      isIdNumberValid ? "text-emerald-500" : "text-rose-500"
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
                placeholder="e.g. 22682702"
                maxLength={9}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all shadow-sm ${
                  idNumber && isIdNumberValid
                    ? "border-emerald-500/50 bg-background focus:ring-emerald-500"
                    : idNumber && !isIdNumberValid
                    ? "border-rose-500/50 bg-background focus:ring-rose-500"
                    : "border-border bg-background focus:ring-primary"
                }`}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Degree Program
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
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
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              University Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. 22682702@uc.edu.ph"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              required
            />
          </div>

          {/* Password with Visibility Toggle */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-11 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
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

            {/* Dynamic Strength Bar */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1 animate-in fade-in">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-muted-foreground">Password Strength:</span>
                  <span
                    className={
                      passwordScore === 5
                        ? "text-emerald-500"
                        : passwordScore >= 3
                        ? "text-indigo-500"
                        : "text-rose-500"
                    }
                  >
                    {strengthMeta.label}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthMeta.color}`}
                    style={{ width: strengthMeta.width }}
                  />
                </div>
              </div>
            )}

            {/* Interactive Password Requirements Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 rounded-2xl bg-muted/40 border border-border p-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                {passwordCriteria.minLength ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <span className={passwordCriteria.minLength ? "text-foreground font-bold" : "text-muted-foreground"}>
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasUpper ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <span className={passwordCriteria.hasUpper ? "text-foreground font-bold" : "text-muted-foreground"}>
                  1 uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasLower ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <span className={passwordCriteria.hasLower ? "text-foreground font-bold" : "text-muted-foreground"}>
                  1 lowercase letter (a-z)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {passwordCriteria.hasNumber ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <span className={passwordCriteria.hasNumber ? "text-foreground font-bold" : "text-muted-foreground"}>
                  1 numeric digit (0-9)
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:col-span-2">
                {passwordCriteria.hasSpecial ? (
                  <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                )}
                <span className={passwordCriteria.hasSpecial ? "text-foreground font-bold" : "text-muted-foreground"}>
                  1 special character (!@#$%^&*)
                </span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider block">
                Confirm Password
              </label>
              {confirmPassword && (
                <span className={`text-[10px] font-bold ${isConfirmMatch ? "text-emerald-500" : "text-rose-500"}`}>
                  {isConfirmMatch ? "Passwords Match" : "Do Not Match"}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 pr-11 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          {/* Registration Submit Button */}
          <button
            type="submit"
            disabled={loading || !isStudyLoadAttached || !isIdNumberValid || !isPasswordValid || !isConfirmMatch}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Creating Account & Calibrating Navigation...</span>
              </>
            ) : (
              <>
                <GraduationCap className="size-4" />
                <span>
                  {isStudyLoadAttached
                    ? "Complete Registration with Study Load"
                    : "Attach Study Load to Register"}
                </span>
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 border-t border-border text-center space-y-2 text-xs">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Faculty and staff accounts are provisioned via the CCS Admin Portal.
          </p>
        </div>
      </div>
    </div>
  );
}
