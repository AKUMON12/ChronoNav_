"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  GraduationCap,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  X,
  Sparkles,
  Lock,
  UserCheck,
  UserX,
} from "lucide-react";
import { CreateUserModal, CreateUserData } from "@/components/admin/create-user-modal";
import { EditUserModal, ManagedUser } from "@/components/admin/edit-user-modal";
import type { UserRole } from "@/types/database";
import { BackButton } from "@/components/shared/back-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

import {
  getAllUsers,
  getUserSchedule,
  adminUpdateUser,
  adminDeleteUser,
  saveAllUsers,
  UserAccount,
} from "@/lib/auth/auth-store";

interface DetailedManagedUser extends ManagedUser {
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  year_level?: string;
  enrolled_or_teaching_count?: number;
  last_login?: string;
  bio?: string;
}

const initialUsers: DetailedManagedUser[] = [
  {
    id: "usr_student_22682702",
    id_number: "22682702",
    first_name: "Vince Andrew",
    last_name: "Santoya",
    email: "22682702@uc.edu.ph",
    role: "student",
    program: "BSIT",
    year_level: "4th Year",
    status: "Active",
    phone: "+63 917 234 5678",
    address: "155A Sanciangko St, Sambag I, Cebu City",
    emergency_contact: "Dionisio Santoya (Parent)",
    emergency_phone: "+63 918 234 5678",
    enrolled_or_teaching_count: 7,
    last_login: "2026-08-28 15:30",
    bio: "BSIT 4th year student with official UC Study Load uploaded. Specializing in Artificial Intelligence and Web Technologies.",
    created_at: "2026-08-01",
  },
  {
    id: "usr_student_22684955",
    id_number: "22684955",
    first_name: "Tristan",
    last_name: "Developer",
    email: "22684955@uc.edu.ph",
    role: "student",
    program: "BSCS",
    year_level: "3rd Year",
    status: "Active",
    phone: "+63 917 123 4567",
    address: "Sanciangko St, Sambag I, Cebu City",
    emergency_contact: "Elena Developer (Parent)",
    emergency_phone: "+63 918 987 6543",
    enrolled_or_teaching_count: 5,
    last_login: "2026-08-22 21:40",
    bio: "Undergraduate computer science student researching graph-based indoor wayfinding and algorithms.",
    created_at: "2026-08-01",
  },
  {
    id: "usr_faculty_santos",
    id_number: "21589412",
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos@uc.edu.ph",
    role: "faculty",
    program: "CCS",
    year_level: "Faculty Instructor",
    status: "Active",
    phone: "+63 920 445 1122",
    address: "Banilad, Cebu City",
    emergency_contact: "Dr. Roberto Santos (Spouse)",
    emergency_phone: "+63 917 555 4321",
    enrolled_or_teaching_count: 4,
    last_login: "2026-08-22 18:30",
    bio: "Professor in Computer Science handling Data Structures, Algorithms, and Software Engineering.",
    created_at: "2026-07-15",
  },
  {
    id: "usr_admin_master",
    id_number: "20194821",
    first_name: "Admin",
    last_name: "Superuser",
    email: "admin@uc.edu.ph",
    role: "admin",
    program: "CCS",
    year_level: "System Administrator",
    status: "Active",
    phone: "+63 919 000 1111",
    address: "UC Main Campus Administration Suite",
    emergency_contact: "CCS Dean Office",
    emergency_phone: "+63 (032) 255-7777",
    enrolled_or_teaching_count: 0,
    last_login: "2026-08-22 23:15",
    bio: "Chief campus administrator overseeing ChronoNav database, user provisioning, and indoor navigation calibration.",
    created_at: "2026-06-10",
  },
  {
    id: "usr_student_22784910",
    id_number: "22784910",
    first_name: "Pedro",
    last_name: "Cruz",
    email: "22784910@uc.edu.ph",
    role: "student",
    program: "BSIT",
    year_level: "3rd Year",
    status: "Active",
    phone: "+63 922 789 0123",
    address: "Urgello St, Sambag II, Cebu City",
    emergency_contact: "Carlos Cruz (Brother)",
    emergency_phone: "+63 917 888 9999",
    enrolled_or_teaching_count: 6,
    last_login: "2026-08-21 14:10",
    bio: "Information Technology undergraduate specializing in network infrastructure and systems administration.",
    created_at: "2026-08-05",
  },
  {
    id: "usr_faculty_reyes",
    id_number: "22490123",
    first_name: "Ana",
    last_name: "Reyes",
    email: "ana.reyes@uc.edu.ph",
    role: "faculty",
    program: "CCS",
    year_level: "Associate Professor",
    status: "Active",
    phone: "+63 933 654 3210",
    address: "Mandaue City, Cebu",
    emergency_contact: "Prof. Miguel Reyes",
    emergency_phone: "+63 918 111 2233",
    enrolled_or_teaching_count: 3,
    last_login: "2026-08-22 09:20",
    bio: "Cisco Certified Instructor heading Enterprise Networking and Cybersecurity courses in CCS 301.",
    created_at: "2026-07-20",
  },
  {
    id: "usr_student_21984712",
    id_number: "21984712",
    first_name: "Carlos",
    last_name: "Tan",
    email: "21984712@uc.edu.ph",
    role: "student",
    program: "ACT",
    year_level: "2nd Year",
    status: "Suspended",
    phone: "+63 915 999 8888",
    address: "Guadalupe, Cebu City",
    emergency_contact: "Lucia Tan (Mother)",
    emergency_phone: "+63 920 333 4444",
    enrolled_or_teaching_count: 4,
    last_login: "2026-08-10 11:00",
    bio: "Associate in Computer Technology student.",
    created_at: "2026-07-28",
  },
];

/**
 * Enterprise Admin User Management Suite
 * Full CRUD, role elevation/reassignment, active/suspended status toggling,
 * and comprehensive User Inspection Modal with detailed personal & academic data.
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<DetailedManagedUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DetailedManagedUser | null>(null);
  const [inspectingUser, setInspectingUser] = useState<DetailedManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<DetailedManagedUser | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [mounted, setMounted] = useState<boolean>(false);
  React.useEffect(() => {
    setMounted(true);
    try {
      const storedUsers = getAllUsers();
      if (storedUsers && storedUsers.length > 0) {
        // Map storedUsers to DetailedManagedUser format, combining with initialUsers details
        const merged: DetailedManagedUser[] = storedUsers.map((su) => {
          const matchingPreset = initialUsers.find(
            (iu) =>
              iu.email.toLowerCase() === su.email.toLowerCase() ||
              (iu.id_number && iu.id_number === su.user_metadata?.id_number)
          );

          const schedCount = getUserSchedule(su.id)?.length || 0;

          if (matchingPreset) {
            return {
              ...matchingPreset,
              id: su.id,
              role: su.role,
              status: (su.status === "suspended" ? "Suspended" : "Active") as "Active" | "Suspended",
              first_name: su.user_metadata?.first_name || matchingPreset.first_name,
              last_name: su.user_metadata?.last_name || matchingPreset.last_name,
              id_number: su.user_metadata?.id_number || matchingPreset.id_number,
              email: su.email,
              program: su.user_metadata?.program || matchingPreset.program,
              year_level: su.user_metadata?.year_level || matchingPreset.year_level,
              enrolled_or_teaching_count: matchingPreset.enrolled_or_teaching_count || (schedCount > 0 ? schedCount : undefined) || (su.role === "student" ? 5 : 3),
            };
          }

          return {
            id: su.id,
            id_number: su.user_metadata?.id_number || "—",
            first_name: su.user_metadata?.first_name || su.email.split("@")[0],
            last_name: su.user_metadata?.last_name || "User",
            email: su.email,
            role: su.role,
            program: su.user_metadata?.program || "CCS",
            year_level: su.user_metadata?.year_level || (su.role === "student" ? "1st Year" : "Faculty"),
            status: (su.status === "suspended" ? "Suspended" : "Active") as "Active" | "Suspended",
            phone: "+63 900 000 0000",
            address: "Cebu City, Philippines",
            emergency_contact: "University Registrar File",
            emergency_phone: "+63 (032) 255-7777",
            enrolled_or_teaching_count: schedCount || (su.role === "student" ? 5 : 3),
            last_login: "Today",
            bio: `${su.user_metadata?.program || "CCS"} academic user account.`,
            created_at: su.created_at ? su.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
          };
        });

        // Ensure any presets that might not yet be in storedUsers are retained
        for (const preset of initialUsers) {
          if (!merged.some((m) => m.email.toLowerCase() === preset.email.toLowerCase())) {
            merged.push(preset);
          }
        }

        setUsers(merged);
      }
    } catch (e) {
      console.error("Error syncing users with auth-store:", e);
    }
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.id_number && u.id_number.includes(searchQuery));

      const matchesRole =
        roleFilter === "ALL" || u.role.toLowerCase() === roleFilter.toLowerCase();
      const matchesStatus =
        statusFilter === "ALL" || u.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Paginated Slices
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Create User Handler
  const handleCreateUser = (data: CreateUserData) => {
    const newUserId = `u-${Date.now()}`;
    const newUser: DetailedManagedUser = {
      id: newUserId,
      id_number: data.id_number,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
      program: data.program,
      year_level: data.role === "student" ? "1st Year" : "Faculty",
      status: data.status,
      phone: "+63 900 000 0000",
      address: "Cebu City, Philippines",
      emergency_contact: "University Registrar File",
      emergency_phone: "+63 (032) 255-7777",
      enrolled_or_teaching_count: 0,
      last_login: "Never",
      bio: `${data.program || "CCS"} academic user account.`,
      created_at: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [newUser, ...prev]);

    // Also persist into auth-store
    try {
      const stored = getAllUsers();
      const newAuthAccount: UserAccount = {
        id: newUserId,
        email: data.email.trim().toLowerCase(),
        passwordHash: "h_dev_admin_created",
        salt: "s_admin_created",
        role: data.role,
        status: data.status.toLowerCase() as any,
        user_metadata: {
          first_name: data.first_name,
          last_name: data.last_name,
          id_number: data.id_number,
          program: data.program,
          year_level: data.role === "student" ? "1st Year" : "Faculty",
          role: data.role,
        },
        created_at: new Date().toISOString(),
      };
      stored.push(newAuthAccount);
      saveAllUsers(stored);
    } catch (e) {
      console.error("Failed to sync new user to auth store:", e);
    }

    showNotification(`Account created for ${newUser.first_name} ${newUser.last_name}!`);
  };

  // Update User Handler
  const handleUpdateUser = (updatedUser: ManagedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );

    // Persist to auth-store
    adminUpdateUser(updatedUser.id, {
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      id_number: updatedUser.id_number,
      email: updatedUser.email,
      role: updatedUser.role,
      program: updatedUser.program,
      status: updatedUser.status.toLowerCase() as any,
    });

    showNotification(`Updated profile for ${updatedUser.first_name} ${updatedUser.last_name}.`);
    setEditingUser(null);
  };

  // Toggle User Status (Active <-> Suspended)
  const handleToggleStatus = (user: DetailedManagedUser) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    if (inspectingUser?.id === user.id) {
      setInspectingUser({ ...inspectingUser, status: newStatus });
    }

    // Persist status change to auth-store to immediately enforce auth blocks
    adminUpdateUser(user.id, { status: newStatus.toLowerCase() as any });

    showNotification(`Status for ${user.first_name} set to ${newStatus}.`);
  };

  // Role Elevation Handler
  const handleChangeRole = (user: DetailedManagedUser, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
    );
    if (inspectingUser?.id === user.id) {
      setInspectingUser({ ...inspectingUser, role: newRole });
    }

    // Persist role change to auth-store
    adminUpdateUser(user.id, { role: newRole });

    showNotification(`Role for ${user.first_name} changed to ${newRole.toUpperCase()}.`);
  };

  // Delete User Handler
  const handleDeleteUser = () => {
    if (!deletingUser || deleteConfirmationText !== "DELETE") return;

    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));

    // Persist deletion to auth-store
    adminDeleteUser(deletingUser.id);

    showNotification(`Account ${deletingUser.email} has been permanently deleted.`);
    setDeletingUser(null);
    setDeleteConfirmationText("");
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-rose-500">
            <Shield className="size-3" /> Admin
          </span>
        );
      case "faculty":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-indigo-500">
            <GraduationCap className="size-3" /> Faculty
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
            <User className="size-3" /> Student
          </span>
        );
    }
  };

  if (!mounted) {
    return <TableSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* ── Top Header Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <BackButton fallbackUrl="/admin/dashboard" showLabel={false} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <Users className="size-7 text-primary" />
              <span>User Accounts Directory & Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Administrative master registry for Student, Faculty, and Staff accounts with full CRUD & RBAC control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <ThemeToggle />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-black text-xs hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all shrink-0"
          >
            <UserPlus className="size-4" />
            <span>Provision User Account</span>
          </button>
        </div>
      </div>

      {/* ── Status Toast ── */}
      {notification && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in shadow-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Role Count Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              TOTAL ACCOUNTS
            </span>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <span className="text-2xl font-black text-foreground block">{users.length}</span>
          <span className="text-[11px] font-bold text-primary block">Active Registered</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              STUDENTS
            </span>
            <User className="size-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-foreground block">
            {users.filter((u) => u.role === "student").length}
          </span>
          <span className="text-[11px] font-bold text-emerald-500 block">Enrolled Portal</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              FACULTY MEMBERS
            </span>
            <GraduationCap className="size-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-foreground block">
            {users.filter((u) => u.role === "faculty").length}
          </span>
          <span className="text-[11px] font-bold text-indigo-500 block">Teaching Instructors</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
              ADMINISTRATORS
            </span>
            <Shield className="size-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-rose-500 block">
            {users.filter((u) => u.role === "admin").length}
          </span>
          <span className="text-[11px] font-bold text-muted-foreground block">Full System Control</span>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by UC ID, name, email, or degree program..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="FACULTY">Faculty</option>
            <option value="ADMIN">Administrators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* ── User Directory Data Table ── */}
      <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[10px] font-black tracking-wider">
                <th className="py-3.5 px-4">UC ID Number</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Institutional Email</th>
                <th className="py-3.5 px-4">Role & Dept</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Users className="size-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-foreground">No user accounts found matching query.</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {user.id_number || "—"}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-foreground">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">{user.email}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        {user.program && (
                          <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                            {user.program}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        title="Click to Toggle Status"
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black transition-transform active:scale-90 ${
                          user.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                            : "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25"
                        }`}
                      >
                        {user.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">{user.created_at}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectingUser(user)}
                          className="p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                          title="Inspect Detailed Profile"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="Edit User Info"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          <span>
            Showing <strong>{paginatedUsers.length}</strong> of <strong>{filteredUsers.length}</strong> accounts
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-xl border border-border hover:bg-accent disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-bold text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-xl border border-border hover:bg-accent disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── DETAILED USER INSPECTION MODAL ── */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-primary font-black text-xl">
                  {inspectingUser.first_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-foreground">
                      {inspectingUser.first_name} {inspectingUser.last_name}
                    </h3>
                    {getRoleBadge(inspectingUser.role)}
                  </div>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    UC ID: <span className="text-foreground font-bold">{inspectingUser.id_number}</span> •{" "}
                    {inspectingUser.program} ({inspectingUser.year_level || "Academic Member"})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingUser(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">
                  STATUS
                </span>
                <span
                  className={`text-sm font-black ${
                    inspectingUser.status === "Active" ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {inspectingUser.status}
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">
                  {inspectingUser.role === "faculty" ? "TEACHING LOAD" : "ENROLLED CLASSES"}
                </span>
                <span className="text-sm font-black text-primary">
                  {inspectingUser.enrolled_or_teaching_count || 4} Subjects
                </span>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center">
                <span className="text-[10px] font-black text-muted-foreground uppercase block">
                  LAST SESSION
                </span>
                <span className="text-xs font-bold text-foreground truncate block">
                  {inspectingUser.last_login || "Today"}
                </span>
              </div>
            </div>

            {/* In-depth details */}
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                  Contact & Permanent Residence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground font-mono">{inspectingUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground font-mono">{inspectingUser.phone || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin className="size-4 text-primary shrink-0" />
                    <span className="text-foreground">{inspectingUser.address || "Cebu City, Cebu"}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                  Emergency Contact Record
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Contact Person:</span>
                    <span className="font-bold text-foreground">
                      {inspectingUser.emergency_contact || "Registrar Emergency File"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Emergency Phone:</span>
                    <span className="font-mono font-bold text-foreground">
                      {inspectingUser.emergency_phone || "+63 900 000 0000"}
                    </span>
                  </div>
                </div>
              </div>

              {inspectingUser.bio && (
                <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-1.5">
                  <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                    Bio / Academic Profile
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{inspectingUser.bio}</p>
                </div>
              )}
            </div>

            {/* Quick Admin Privileges on User */}
            <div className="border-t border-border pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-muted-foreground">Assign Role:</span>
                <button
                  onClick={() => handleChangeRole(inspectingUser, "student")}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                    inspectingUser.role === "student"
                      ? "bg-primary text-white border-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => handleChangeRole(inspectingUser, "faculty")}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                    inspectingUser.role === "faculty"
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Faculty
                </button>
                <button
                  onClick={() => handleChangeRole(inspectingUser, "admin")}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                    inspectingUser.role === "admin"
                      ? "bg-rose-600 text-white border-rose-600"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Admin
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(inspectingUser)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-colors ${
                    inspectingUser.status === "Active"
                      ? "bg-rose-500/10 text-rose-500 border border-rose-500/30 hover:bg-rose-500/20"
                      : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20"
                  }`}
                >
                  {inspectingUser.status === "Active" ? "Suspend Account" : "Activate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE USER MODAL ── */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

      {/* ── EDIT USER MODAL ── */}
      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={handleUpdateUser}
      />

      {/* ── SECURE DELETE DIALOG ── */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/20">
                <AlertTriangle className="size-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">Purge User Account</h3>
                <p className="text-xs text-muted-foreground">Irreversible Account Action</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {deletingUser.first_name} {deletingUser.last_name} ({deletingUser.email})
              </strong>
              ? This will revoke all campus indoor navigation and schedule data immediately.
            </p>

            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-black text-muted-foreground uppercase">
                Type <strong className="text-rose-500">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border border-rose-500/40 bg-background p-2.5 text-xs font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setDeletingUser(null);
                  setDeleteConfirmationText("");
                }}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText !== "DELETE"}
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl bg-destructive text-xs font-black text-white hover:bg-destructive/90 transition-all disabled:opacity-40"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
