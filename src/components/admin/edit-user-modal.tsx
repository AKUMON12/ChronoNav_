"use client";

import React, { useState, useEffect } from "react";
import { X, UserCog, Shield, GraduationCap, User, Loader2 } from "lucide-react";
import type { UserRole } from "@/types/database";

export interface ManagedUser {
  id: string;
  id_number?: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  program?: string;
  status: "Active" | "Suspended";
  created_at: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  user: ManagedUser | null;
  onClose: () => void;
  onUpdate: (user: ManagedUser) => Promise<void> | void;
}

export function EditUserModal({ isOpen, user, onClose, onUpdate }: EditUserModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [program, setProgram] = useState("BSCS");
  const [status, setStatus] = useState<"Active" | "Suspended">("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setIdNumber(user.id_number || "22684955");
      setEmail(user.email || "");
      setRole(user.role || "student");
      setProgram(user.program || "BSCS");
      setStatus(user.status || "Active");
      setError(null);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !idNumber.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await onUpdate({
        ...user,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        id_number: idNumber.trim(),
        role,
        program,
        status,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update user profile.");
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
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <UserCog className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Edit User Profile & Permissions</h3>
              <p className="text-[11px] text-[#74777E]">{user.email}</p>
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
              Role Authority Level
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

          {/* UC ID Number & Program */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">UC ID Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                maxLength={9}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Program / Dept</label>
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

          {/* Account Status */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Account Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Active" | "Suspended")}
              className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
            >
              <option value="Active">Active User (Allowed Ingress & Session)</option>
              <option value="Suspended">Suspended (Blocked Access)</option>
            </select>
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
