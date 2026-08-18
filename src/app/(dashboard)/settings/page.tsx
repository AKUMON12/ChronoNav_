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
  Laptop,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { getCurrentUser } from "@/lib/supabase/auth";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function AccountSettingsPage() {
  const { theme, setTheme } = useTheme();

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

  // Preferences
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableAudioGuidance, setEnableAudioGuidance] = useState(true);
  const [enableHaptic, setEnableHaptic] = useState(true);

  // Status
  const [profileNotification, setProfileNotification] = useState<string | null>(null);
  const [securityNotification, setSecurityNotification] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);

  useEffect(() => {
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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="border-b border-[#507495]/20 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
          <User className="size-7 text-[#1D7DD7]" />
          <span>Account Settings & Profile Control</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#74777E] mt-1">
          Manage your personal details, institutional identifiers, security credentials, and app preferences.
        </p>
      </div>

      {/* ── SECTION 1: PROFILE DETAILS ── */}
      <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#507495]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1D7DD7]/20 border border-[#1D7DD7]/40 text-[#1D7DD7] font-black text-lg">
              {firstName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {firstName} {lastName}
              </h2>
              <span className="text-[10px] font-bold text-[#1D7DD7] bg-[#1D7DD7]/15 px-2 py-0.5 rounded-md uppercase">
                {userRole} Account
              </span>
            </div>
          </div>
        </div>

        {profileNotification && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{profileNotification}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">UC ID Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Program / Dept</label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-xl border border-[#507495]/20 bg-[#0E151B]/60 p-2.5 text-[#74777E] cursor-not-allowed"
            />
            <span className="text-[10px] text-[#74777E]">Institutional email address is managed via CCS Registry.</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D7DD7] text-white font-black hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all"
            >
              <Save className="size-4" />
              <span>Save Profile Details</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── SECTION 2: PASSWORD & SECURITY ── */}
      <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-[#507495]/20 pb-3">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <KeyRound className="size-5 text-[#1D7DD7]" />
            <span>Password & Security Controls</span>
          </h2>
          <p className="text-xs text-[#74777E]">Update your login password and manage session authentication.</p>
        </div>

        {securityError && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/15 border border-rose-500/30 p-3 text-xs font-bold text-rose-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{securityError}</span>
          </div>
        )}

        {securityNotification && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{securityNotification}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777E]"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74777E]"
                >
                  {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Confirm New Password</label>
              <input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              />
            </div>
          </div>

          {/* Password Checklist */}
          {newPassword.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-[#0E151B] border border-[#507495]/20 text-[11px]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.minLength ? "text-emerald-400" : "text-[#74777E]"}`} />
                <span className={passwordCriteria.minLength ? "text-white" : "text-[#74777E]"}>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasUpper ? "text-emerald-400" : "text-[#74777E]"}`} />
                <span className={passwordCriteria.hasUpper ? "text-white" : "text-[#74777E]"}>1 uppercase letter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasLower ? "text-emerald-400" : "text-[#74777E]"}`} />
                <span className={passwordCriteria.hasLower ? "text-white" : "text-[#74777E]"}>1 lowercase letter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasNumber ? "text-emerald-400" : "text-[#74777E]"}`} />
                <span className={passwordCriteria.hasNumber ? "text-white" : "text-[#74777E]"}>1 numeric digit</span>
              </div>
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <CheckCircle2 className={`size-3.5 ${passwordCriteria.hasSpecial ? "text-emerald-400" : "text-[#74777E]"}`} />
                <span className={passwordCriteria.hasSpecial ? "text-white" : "text-[#74777E]"}>1 special symbol (!@#$%^&*)</span>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isPasswordValid || !isConfirmMatch || !currentPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D7DD7] text-white font-black hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all disabled:opacity-40"
            >
              <KeyRound className="size-4" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* ── SECTION 3: PREFERENCES & GUIDANCE ── */}
      <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-6 sm:p-8 shadow-xl space-y-5">
        <div className="border-b border-[#507495]/20 pb-3">
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Volume2 className="size-5 text-[#1D7DD7]" />
            <span>Navigation & System Preferences</span>
          </h2>
          <p className="text-xs text-[#74777E]">Configure speech guidance, interface theme, and broadcast notifications.</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0E151B] border border-[#507495]/20">
            <div>
              <p className="text-xs font-bold text-white">Color Theme Interface</p>
              <p className="text-[11px] text-[#74777E]">Toggle between Light, Dark, or System synchronization.</p>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0E151B] border border-[#507495]/20">
            <div>
              <p className="text-xs font-bold text-white">Audio Turn-by-Turn Guidance</p>
              <p className="text-[11px] text-[#74777E]">Synthesize voice directions during indoor walking transitions.</p>
            </div>
            <input
              type="checkbox"
              checked={enableAudioGuidance}
              onChange={(e) => setEnableAudioGuidance(e.target.checked)}
              className="size-5 accent-[#1D7DD7] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0E151B] border border-[#507495]/20">
            <div>
              <p className="text-xs font-bold text-white">Class Schedule Alerts</p>
              <p className="text-[11px] text-[#74777E]">Receive countdown reminders 15 minutes before next lecture.</p>
            </div>
            <input
              type="checkbox"
              checked={enableNotifications}
              onChange={(e) => setEnableNotifications(e.target.checked)}
              className="size-5 accent-[#1D7DD7] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
