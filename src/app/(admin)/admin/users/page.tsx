"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { CreateUserModal, CreateUserData } from "@/components/admin/create-user-modal";
import { EditUserModal, ManagedUser } from "@/components/admin/edit-user-modal";
import type { UserRole } from "@/types/database";

const initialUsers: ManagedUser[] = [
  {
    id: "u-1",
    id_number: "22684955",
    first_name: "Tristan",
    last_name: "Developer",
    email: "22684955@uc.edu.ph",
    role: "student",
    program: "BSCS",
    status: "Active",
    created_at: "2026-08-01",
  },
  {
    id: "u-2",
    id_number: "21589412",
    first_name: "Maria",
    last_name: "Santos",
    email: "maria.santos@uc.edu.ph",
    role: "faculty",
    program: "CCS",
    status: "Active",
    created_at: "2026-07-15",
  },
  {
    id: "u-3",
    id_number: "20194821",
    first_name: "Admin",
    last_name: "Superuser",
    email: "admin@uc.edu.ph",
    role: "admin",
    program: "CCS",
    status: "Active",
    created_at: "2026-06-10",
  },
  {
    id: "u-4",
    id_number: "22784910",
    first_name: "Pedro",
    last_name: "Cruz",
    email: "22784910@uc.edu.ph",
    role: "student",
    program: "BSIT",
    status: "Active",
    created_at: "2026-08-05",
  },
  {
    id: "u-5",
    id_number: "22490123",
    first_name: "Ana",
    last_name: "Reyes",
    email: "ana.reyes@uc.edu.ph",
    role: "faculty",
    program: "CCS",
    status: "Active",
    created_at: "2026-07-20",
  },
  {
    id: "u-6",
    id_number: "21984712",
    first_name: "Carlos",
    last_name: "Tan",
    email: "21984712@uc.edu.ph",
    role: "student",
    program: "ACT",
    status: "Suspended",
    created_at: "2026-07-28",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    const newUser: ManagedUser = {
      id: `u-${Date.now()}`,
      id_number: data.id_number,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role,
      program: data.program,
      status: data.status,
      created_at: new Date().toISOString().split("T")[0],
    };

    setUsers((prev) => [newUser, ...prev]);
    showNotification(`Account successfully provisioned for ${newUser.first_name} ${newUser.last_name}!`);
  };

  // Update User Handler
  const handleUpdateUser = (updatedUser: ManagedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    showNotification(`User details updated for ${updatedUser.first_name} ${updatedUser.last_name}.`);
  };

  // Delete User Handler
  const handleDeleteUser = () => {
    if (!deletingUser || deleteConfirmationText !== "DELETE") return;

    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    showNotification(`Account ${deletingUser.email} has been purged.`);
    setDeletingUser(null);
    setDeleteConfirmationText("");
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-500 dark:text-rose-400">
            <Shield className="size-3" />
            <span>Admin</span>
          </span>
        );
      case "faculty":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-black text-indigo-600 dark:text-indigo-400">
            <User className="size-3" />
            <span>Faculty</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-black text-primary">
            <GraduationCap className="size-3" />
            <span>Student</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Users className="size-7 text-primary" />
            <span>User Accounts & Identity Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Provision, inspect, and manage role-based credentials for UC Main Campus students, faculty, and administrators.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all shrink-0"
        >
          <UserPlus className="size-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs text-emerald-500 font-bold animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, or UC ID Number..."
            className="w-full rounded-2xl border border-border bg-card py-2.5 pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        {/* Role and Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-2xl border border-border bg-card p-1 text-xs">
            {["ALL", "STUDENT", "FACULTY", "ADMIN"].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setRoleFilter(role);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl font-black capitalize transition-all ${
                  roleFilter === role
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role.toLowerCase()}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground uppercase font-black tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">UC ID Number</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Program / Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
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
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black ${
                          user.status === "Active"
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-rose-500/15 text-rose-500"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">{user.created_at}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="Edit User"
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

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={handleUpdateUser}
      />

      {/* Secure Delete Confirmation Dialog */}
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
