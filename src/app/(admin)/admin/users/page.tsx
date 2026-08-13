"use client";

import React, { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Shield, 
  GraduationCap, 
  UserCog, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { UserRole } from "@/types/database";

interface ManagedUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: "Active" | "Suspended" | "Inactive";
  createdAt: string;
}

const initialUsers: ManagedUser[] = [
  {
    id: "usr-101",
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "student@uc.edu.ph",
    role: "student",
    status: "Active",
    createdAt: "2026-01-15",
  },
  {
    id: "usr-102",
    firstName: "Maria",
    lastName: "Santos",
    email: "faculty@uc.edu.ph",
    role: "faculty",
    status: "Active",
    createdAt: "2026-01-10",
  },
  {
    id: "usr-103",
    firstName: "System",
    lastName: "Administrator",
    email: "admin@uc.edu.ph",
    role: "admin",
    status: "Active",
    createdAt: "2026-01-01",
  },
  {
    id: "usr-104",
    firstName: "Pedro",
    lastName: "Cruz",
    email: "pedro.cruz@uc.edu.ph",
    role: "faculty",
    status: "Active",
    createdAt: "2026-02-01",
  },
  {
    id: "usr-105",
    firstName: "Ana",
    lastName: "Reyes",
    email: "ana.reyes@uc.edu.ph",
    role: "student",
    status: "Suspended",
    createdAt: "2026-02-05",
  },
  {
    id: "usr-106",
    firstName: "Ramon",
    lastName: "Garcia",
    email: "ramon.garcia@uc.edu.ph",
    role: "faculty",
    status: "Active",
    createdAt: "2026-02-10",
  },
  {
    id: "usr-107",
    firstName: "Angela",
    lastName: "Mercado",
    email: "angela.m@uc.edu.ph",
    role: "student",
    status: "Inactive",
    createdAt: "2026-02-12",
  },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role === roleFilter.toLowerCase();
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleStatusChange = (userId: string, newStatus: "Active" | "Suspended" | "Inactive") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Users className="size-8 text-[#1D7DD7]" />
            <span>User Management Panel</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage registered student, faculty, and admin accounts, role permissions, and active statuses.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <Filter className="size-3.5 text-[#1D7DD7]" />
            <span>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-extrabold uppercase border-b border-border text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4 text-center">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-bold text-foreground">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-full bg-[#1D7DD7]/10 text-[#1D7DD7] font-black text-xs">
                        {user.firstName[0]}
                      </div>
                      <div>
                        <p className="font-extrabold text-foreground">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-muted-foreground font-medium">{user.email}</td>

                  {/* Role Selector Toggle */}
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="rounded-xl border border-input bg-background px-2.5 py-1 text-xs font-extrabold text-foreground capitalize focus:ring-2 focus:ring-[#1D7DD7]"
                    >
                      <option value="student">🎓 Student</option>
                      <option value="faculty">👨‍🏫 Faculty</option>
                      <option value="admin">🛡️ Admin</option>
                    </select>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : user.status === "Suspended"
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      <span className={`size-1.5 rounded-full ${
                        user.status === "Active" ? "bg-emerald-500" : user.status === "Suspended" ? "bg-rose-500" : "bg-muted-foreground"
                      }`} />
                      {user.status}
                    </span>
                  </td>

                  <td className="p-4 text-muted-foreground font-semibold">{user.createdAt}</td>

                  {/* Status Controls */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {user.status !== "Active" && (
                        <button
                          onClick={() => handleStatusChange(user.id, "Active")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[11px] font-extrabold"
                        >
                          Enable
                        </button>
                      )}
                      {user.status !== "Suspended" && (
                        <button
                          onClick={() => handleStatusChange(user.id, "Suspended")}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-[11px] font-extrabold"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 text-xs font-bold text-muted-foreground">
          <span>
            Showing {paginatedUsers.length} of {filteredUsers.length} Users
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent disabled:opacity-50"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
