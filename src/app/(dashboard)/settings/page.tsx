"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { SettingsSkeleton } from "@/components/skeletons/settings-skeleton";

export default function AccountSettingsPage() {
  // Profile Fields
  const [firstName, setFirstName] = useState("Tristan");
  const [lastName, setLastName] = useState("Developer");
  const [idNumber, setIdNumber] = useState("22684955");
  const [email, setEmail] = useState("22684955@uc.edu.ph");
  const [program, setProgram] = useState("BSCS");
  const [userRole, setUserRole] = useState("student");

  // Password Security Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Preferences
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableAudioGuidance, setEnableAudioGuidance] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chrononav_voice_guidance");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  // Status
  const [profileNotification, setProfileNotification] = useState<string | null>(null);
  const [securityNotification, setSecurityNotification] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    async function loadUser() {
      const user = await getCurrentUser();
      if (user) {
        if (user.user_metadata?.first_name) setFirstName(user.user_metadata.first_name);
        if (user.user_metadata?.last_name) setLastName(user.user_metadata.last_name);
        if (user.user_metadata?.id_number) setIdNumber(user.user_metadata.id_number);
        if (user.email) setEmail(user.email);
        if (user.user_metadata?.role) setUserRole(user.user_metadata.role);
        if (user.user_metadata?.program) setProgram(user.user_metadata.program);
      }
    }
    loadUser();
  }, []);

  if (!mounted) {
    return <SettingsSkeleton />;
  }

  // Password Criteria Validation
  const passwordCriteria = useMemo(() => {
    return {
      minLength: newPassword.length >= 8,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    };
  }, [newPassword]);

  const passwordScore = useMemo(() => {
    return Object.values(passwordCriteria).filter(Boolean).length;
  }, [passwordCriteria]);

  const isPasswordValid = passwordScore === 5;
  const isConfirmMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotification("Profile information updated successfully!");
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("chrononav:user_updated"));
    }
    setTimeout(() => setProfileNotification(null), 4000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    if (!currentPassword) {
      setSecurityError("Please enter your current password to authorize this change.");
      return;
    }

    if (!isPasswordValid) {
      setSecurityError("New password must fulfill all 5 security criteria.");
      return;
    }

    if (!isConfirmMatch) {
      setSecurityError("New passwords do not match.");
      return;
    }

    setSecurityNotification("Your password has been changed securely!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSecurityNotification(null), 4000);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
          <User className="size-7 text-primary" />
          <span>Account Settings & Profile Control</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your personal details, institutional identifiers, security credentials, and app preferences.
        </p>
      </div>

      {/* ── SECTION 1: PROFILE REDIRECTION BANNER ── */}
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/25 shrink-0">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-foreground">
                {firstName} {lastName}
              </h2>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">
                {userRole}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              UC ID: <span className="font-mono font-bold text-foreground">{idNumber}</span> • {program}
            </p>
          </div>
        </div>

        <a
          href="/profile"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-black text-xs hover:bg-primary/90 shadow-md shadow-primary/30 transition-all shrink-0"
        >
          <User className="size-4" />
          <span>Edit Profile & Address</span>
        </a>
      </div>


      {/* ── SECTION 2: PASSWORD & SECURITY ── */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-border pb-3">
          <h2 className="text-base font-black text-foreground flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            <span>Change Password</span>
          </h2>
          <p className="text-xs text-muted-foreground">Update your password to keep your account secure.</p>
        </div>

        {securityError && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/15 border border-destructive/30 p-3 text-xs font-bold text-rose-500">
            <AlertCircle className="size-4 shrink-0" />
            <span>{securityError}</span>
          </div>
        )}

        {securityNotification && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-500">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{securityNotification}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-border bg-background p-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={showCurrent ? "Hide current password" : "Show current password"}
                aria-pressed={showCurrent}
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full rounded-xl border border-border bg-background p-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={showNew ? "Hide new password" : "Show new password"}
                  aria-pressed={showNew}
                >
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-border bg-background p-2.5 pr-10 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={showConfirm ? "Hide confirm new password" : "Show confirm new password"}
                  aria-pressed={showConfirm}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Checklist */}
          {newPassword.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.minLength ? "text-emerald-500" : "text-muted-foreground"}`} />
                <span className={passwordCriteria.minLength ? "text-foreground font-bold" : "text-muted-foreground"}>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasUpper ? "text-emerald-500" : "text-muted-foreground"}`} />
                <span className={passwordCriteria.hasUpper ? "text-foreground font-bold" : "text-muted-foreground"}>1 uppercase letter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasLower ? "text-emerald-500" : "text-muted-foreground"}`} />
                <span className={passwordCriteria.hasLower ? "text-foreground font-bold" : "text-muted-foreground"}>1 lowercase letter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasNumber ? "text-emerald-500" : "text-muted-foreground"}`} />
                <span className={passwordCriteria.hasNumber ? "text-foreground font-bold" : "text-muted-foreground"}>1 number</span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasSpecial ? "text-emerald-500" : "text-muted-foreground"}`} />
                <span className={passwordCriteria.hasSpecial ? "text-foreground font-bold" : "text-muted-foreground"}>1 special character</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isPasswordValid || !isConfirmMatch || !currentPassword}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <KeyRound className="size-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── SECTION 3: PREFERENCES & GUIDANCE ── */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-5">
        <div className="border-b border-border pb-3">
          <h2 className="text-base font-black text-foreground flex items-center gap-2">
            <Volume2 className="size-5 text-primary" />
            <span>Map & Notification Preferences</span>
          </h2>
          <p className="text-xs text-muted-foreground">Adjust voice navigation and class reminders.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
            <div>
              <p className="text-xs font-bold text-foreground">Voice Directions</p>
              <p className="text-[11px] text-muted-foreground">Play voice instructions while walking between campus rooms.</p>
            </div>
            <input
              type="checkbox"
              checked={enableAudioGuidance}
              onChange={(e) => {
                const nextVal = e.target.checked;
                setEnableAudioGuidance(nextVal);
                if (typeof window !== "undefined") {
                  localStorage.setItem("chrononav_voice_guidance", String(nextVal));
                }
              }}
              className="size-5 accent-primary rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 border border-border">
            <div>
              <p className="text-xs font-bold text-foreground">Class Start Reminders</p>
              <p className="text-[11px] text-muted-foreground">Get a notification 15 minutes before your scheduled class.</p>
            </div>
            <input
              type="checkbox"
              checked={enableNotifications}
              onChange={(e) => setEnableNotifications(e.target.checked)}
              className="size-5 accent-primary rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

