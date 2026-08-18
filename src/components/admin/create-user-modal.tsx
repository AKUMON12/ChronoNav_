"use client";

import React, { useState } from "react";
import { X, UserPlus, Shield, GraduationCap, User, Eye, EyeOff, Loader2 } from "lucide-react";
import type { UserRole } from "@/types/database";

export interface CreateUserData {
  id_number: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  program?: string;
  password?: string;
  status: "Active" | "Suspended";
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (user: CreateUserData) => Promise<void> | void;
}

export function CreateUserModal({ isOpen, onClose, onCreate }: CreateUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [program, setProgram] = useState("BSCS");
  const [password, setPassword] = useState("UcCebu2026!");
  const [status, setStatus] = useState<"Active" | "Suspended">("Active");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIdChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 9);
    setIdNumber(digits);
    if (digits.length >= 7 && !email) {
      setEmail(`${digits}@uc.edu.ph`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !idNumber.trim() || !email.trim()) {
      setError("Please fill in all required user information fields.");
      return;
    }

    if (!/^\d{7,9}$/.test(idNumber.trim())) {
      setError("UC ID number must be 7 to 9 numeric digits.");
      return;
    }

    setLoading(true);
    try {
      await onCreate({
        id_number: idNumber.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        role,
        program: role === "student" ? program : undefined,
        password,
        status,
      });
      onClose();
      // Reset form
      setFirstName("");
      setLastName("");
      setIdNumber("");
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create user account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-[#507495]/30 bg-[#141E28] p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#507495]/20">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1D7DD7]/20 text-[#1D7DD7]">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Provision New User Account</h3>
              <p className="text-[11px] text-[#74777E]">Admin System User Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#74777E] hover:text-white transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Role Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold text-[#74777E] uppercase tracking-wider block">
              Account Role Assignment
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  role === "student"
                    ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                    : "bg-[#0E151B] border border-[#507495]/20 text-[#74777E] hover:text-white"
                }`}
              >
                <GraduationCap className="size-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("faculty")}
                className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  role === "faculty"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-[#0E151B] border border-[#507495]/20 text-[#74777E] hover:text-white"
                }`}
              >
                <User className="size-3.5" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                  role === "admin"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "bg-[#0E151B] border border-[#507495]/20 text-[#74777E] hover:text-white"
                }`}
              >
                <Shield className="size-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Maria"
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
                placeholder="e.g. Santos"
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>
          </div>

          {/* UC ID Number & Program */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">UC ID Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => handleIdChange(e.target.value)}
                placeholder="e.g. 22684955"
                maxLength={9}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">
                {role === "student" ? "Program / Major" : "Department"}
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              >
                <option value="BSCS">BS Computer Science</option>
                <option value="BSIT">BS Information Technology</option>
                <option value="BSIS">BS Information Systems</option>
                <option value="ACT">Associate in Computer Technology</option>
                <option value="CpE">BS Computer Engineering</option>
                <option value="CCS">College of Computer Studies</option>
              </select>
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. maria.santos@uc.edu.ph"
              className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              required
            />
          </div>

          {/* Temporary Password & Account Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Temporary Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Temp password"
                  className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#74777E]"
                >
                  {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Account Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "Active" | "Suspended")}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
              >
                <option value="Active">Active Status</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#507495]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#507495]/30 text-[#74777E] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1D7DD7] text-white font-black hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="size-3.5 animate-spin" />}
              <span>Provision User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
