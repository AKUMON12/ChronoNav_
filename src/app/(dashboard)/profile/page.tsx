"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Shield,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  Sparkles,
  HeartPulse,
  BookOpen,
  Compass,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { getCurrentUser, updateUserProfile } from "@/lib/supabase/auth";
import type { UserRole } from "@/types/database";
import { BackButton } from "@/components/shared/back-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";

const AVATAR_PALETTES = [
  "from-blue-600 to-indigo-600",
  "from-emerald-500 to-teal-700",
  "from-purple-600 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-red-700",
  "from-cyan-500 to-blue-600",
];

/**
 * Enterprise User Profile Management Page
 * Supports modifying avatar, personal information, residential/permanent address,
 * contact numbers, emergency contact, academic details, and biography.
 */
export default function ProfilePage() {
  // Synchronously fetch cached user session to eliminate any UI layout shifts
  const getCachedProfile = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("chrononav_user_session");
        if (stored) return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const cached = getCachedProfile();
  const cachedMeta = cached?.user_metadata || {};

  // Identity Fields
  const [firstName, setFirstName] = useState<string>(() => cachedMeta.first_name || "Tristan");
  const [lastName, setLastName] = useState<string>(() => cachedMeta.last_name || "Developer");
  const [idNumber, setIdNumber] = useState<string>(() => cachedMeta.id_number || "22684955");
  const [email, setEmail] = useState<string>(() => cached?.email || "22684955@uc.edu.ph");
  const [userRole, setUserRole] = useState<UserRole>(() => cachedMeta.role || "student");
  const [program, setProgram] = useState<string>(() => cachedMeta.program || "BSCS - Computer Science");
  const [yearLevel, setYearLevel] = useState<string>(() => cachedMeta.year_level || "3rd Year");

  // Contact & Address Fields
  const [phone, setPhone] = useState<string>(() => cachedMeta.phone || "+63 917 123 4567");
  const [streetAddress, setStreetAddress] = useState<string>(() => cachedMeta.address || "Sanciangko Street, Sambag I");
  const [city, setCity] = useState<string>(() => cachedMeta.city || "Cebu City, 6000 Cebu");
  const [emergencyContact, setEmergencyContact] = useState<string>(() => cachedMeta.emergency_contact || "Elena Developer (Parent)");
  const [emergencyPhone, setEmergencyPhone] = useState<string>(() => cachedMeta.emergency_phone || "+63 918 987 6543");
  const [bio, setBio] = useState<string>(() => cachedMeta.bio || "Undergraduate student specialized in software engineering and algorithms at University of Cebu Main Campus (CCS).");

  // Avatar & Theme customization
  const [avatarGradient, setAvatarGradient] = useState<string>(() => cachedMeta.avatar_gradient || AVATAR_PALETTES[0]);
  const [avatarUrl, setAvatarUrl] = useState<string>(() => cachedMeta.avatar_url || "");

  // Form Status
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    async function loadUserData() {
      const user = await getCurrentUser();
      if (user) {
        if (user.user_metadata?.first_name) setFirstName(user.user_metadata.first_name);
        if (user.user_metadata?.last_name) setLastName(user.user_metadata.last_name);
        if (user.user_metadata?.id_number) setIdNumber(user.user_metadata.id_number);
        if (user.email) setEmail(user.email);
        if (user.user_metadata?.role) setUserRole(user.user_metadata.role);
        if (user.user_metadata?.program) setProgram(user.user_metadata.program);
        if (user.user_metadata?.year_level) setYearLevel(user.user_metadata.year_level);
        if (user.user_metadata?.phone) setPhone(user.user_metadata.phone);
        if (user.user_metadata?.address) setStreetAddress(user.user_metadata.address);
        if (user.user_metadata?.city) setCity(user.user_metadata.city);
        if (user.user_metadata?.emergency_contact) setEmergencyContact(user.user_metadata.emergency_contact);
        if (user.user_metadata?.emergency_phone) setEmergencyPhone(user.user_metadata.emergency_phone);
        if (user.user_metadata?.bio) setBio(user.user_metadata.bio);
        if (user.user_metadata?.avatar_gradient) setAvatarGradient(user.user_metadata.avatar_gradient);
        if (user.user_metadata?.avatar_url) setAvatarUrl(user.user_metadata.avatar_url);
      }
    }
    loadUserData();
  }, []);

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  const handleAvatarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setNotification(null);

    const updatePayload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      id_number: idNumber.trim(),
      program: program.trim(),
      year_level: yearLevel,
      phone: phone.trim(),
      address: streetAddress.trim(),
      city: city.trim(),
      emergency_contact: emergencyContact.trim(),
      emergency_phone: emergencyPhone.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl,
      avatar_gradient: avatarGradient,
    };

    const result = await updateUserProfile(updatePayload);
    setIsSaving(false);

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setNotification("Profile information updated and synchronized successfully!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("chrononav:user_updated"));
      }
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-rose-500/15 border-rose-500/30 text-rose-500 dark:text-rose-400";
      case "faculty":
        return "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400";
      default:
        return "bg-primary/15 border-primary/30 text-primary";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <BackButton fallbackUrl="/dashboard" showLabel={false} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <User className="size-7 text-primary" />
              <span>My Profile</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              View and update your personal and contact details
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-bold text-foreground hover:bg-accent transition-colors shadow-sm"
          >
            <Shield className="size-3.5 text-primary" />
            <span>Password & Security</span>
          </Link>
        </div>
      </div>

      {/* ── Status Notifications ── */}
      {notification && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in shadow-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-destructive/15 border border-destructive/30 p-4 text-xs font-bold text-rose-500 animate-in fade-in shadow-sm">
          <AlertCircle className="size-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}


      {/* ── SECTION 1: PROFILE HERO CARD & AVATAR EDITOR ── */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors duration-200">
        {/* Subtle Decorative Background Gradient */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
            {/* Avatar with Custom Image or Gradient Initials */}
            <div className="relative group">
              <div
                className={`size-24 sm:size-28 rounded-3xl p-1 bg-gradient-to-tr ${avatarGradient} shadow-xl flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover rounded-[22px]"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-white select-none">
                    {firstName.charAt(0).toUpperCase()}
                    {lastName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Upload trigger overlay */}
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-primary text-white shadow-lg cursor-pointer hover:bg-primary/90 transition-transform active:scale-90"
                title="Upload Profile Picture"
              >
                <Camera className="size-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Summary Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  {firstName} {lastName}
                </h2>
                <span
                  className={`rounded-lg border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${getRoleBadge(
                    userRole
                  )}`}
                >
                  {userRole}
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                <span>UC ID:</span>
                <span className="text-foreground">{idNumber}</span>
                <span>•</span>
                <span>{program}</span>
              </p>
              <p className="text-xs text-muted-foreground max-w-md line-clamp-2">{bio}</p>
            </div>
          </div>

          {/* Quick Stat Pill Indicators */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border">
            <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
              <span className="text-[10px] font-black text-muted-foreground uppercase block">ENROLLED</span>
              <span className="text-lg font-black text-foreground">5 Classes</span>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
              <span className="text-[10px] font-black text-muted-foreground uppercase block">SAVED PATHS</span>
              <span className="text-lg font-black text-primary">3 Routes</span>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
              <span className="text-[10px] font-black text-muted-foreground uppercase block">STATUS</span>
              <span className="text-lg font-black text-emerald-500">Active</span>
            </div>
          </div>
        </div>

        {/* Avatar Preset Themes Selector */}
        <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
            Avatar Accent Color
          </span>
          <div className="flex items-center gap-2">
            {AVATAR_PALETTES.map((grad, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setAvatarGradient(grad)}
                className={`size-6 rounded-full bg-gradient-to-tr ${grad} transition-transform ${
                  avatarGradient === grad
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110"
                    : "opacity-80 hover:opacity-100"
                }`}
                aria-label={`Select Color Theme ${i + 1}`}
              />
            ))}
            {avatarUrl && (
              <button
                type="button"
                onClick={() => setAvatarUrl("")}
                className="text-[10px] font-bold text-destructive hover:underline ml-2"
              >
                Reset Photo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: EDITABLE PROFILE DETAILS FORM ── */}
      <form onSubmit={handleSaveProfile} className="space-y-6 sm:space-y-8">
        {/* Academic Details */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-border pb-3 flex items-center gap-2.5">
            <GraduationCap className="size-5 text-primary" />
            <div>
              <h3 className="text-base font-black text-foreground">School Information</h3>
              <p className="text-xs text-muted-foreground">Your student ID, program, and year level</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Student ID Number
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Degree Program / Department
              </label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Year Level
              </label>
              <select
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Faculty / Instructor">Faculty / Instructor</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                School Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-border bg-muted/40 p-3 pl-9 text-muted-foreground font-mono cursor-not-allowed text-xs"
                />
                <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
              About Me / Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none"
            />
          </div>
        </div>

        {/* Residential Address & Contact Info */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-border pb-3 flex items-center gap-2.5">
            <MapPin className="size-5 text-primary" />
            <div>
              <h3 className="text-base font-black text-foreground">Address & Contact Info</h3>
              <p className="text-xs text-muted-foreground">Your home address and mobile number</p>
            </div>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Street Address / Barangay / House No.
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. Sanciangko St, Sambag I"
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                City / Province / Postal Code
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Cebu City, 6000 Cebu"
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Contact Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full rounded-xl border border-border bg-background p-3 pl-9 text-foreground font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <Phone className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Information */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-border pb-3 flex items-center gap-2.5">
            <HeartPulse className="size-5 text-rose-500" />
            <div>
              <h3 className="text-base font-black text-foreground">Emergency Contact Details</h3>
              <p className="text-xs text-muted-foreground">Primary emergency point of contact in case of campus incidents</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Contact Person Name & Relationship
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. Maria Developer (Guardian)"
                className="w-full rounded-xl border border-border bg-background p-3 text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
                Emergency Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="+63 9XX XXX XXXX"
                  className="w-full rounded-xl border border-border bg-background p-3 pl-9 text-foreground font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
                <Phone className="size-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Submit / Save Button Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/dashboard"
            className="text-xs font-extrabold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return to Overview
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-primary text-white font-black text-xs hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Save & Update Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
