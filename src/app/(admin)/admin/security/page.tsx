"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  User,
  GraduationCap,
  Copy,
  Check,
  FileText,
  AlertTriangle,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { PasswordChangeRequest } from "@/types/database";
import {
  getAllPasswordRequests,
  saveAllPasswordRequests,
  approvePasswordRequest,
  rejectPasswordRequest,
  closePasswordRequest,
  deletePasswordRequest,
} from "@/lib/auth/password-manager";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

/**
 * Enterprise Admin Password Management & Security Authorization Center
 *
 * Provides institutional review for student and faculty password requests.
 * Features:
 * - Persistent approval/rejection/close/delete states across page refreshes
 * - Processed request views displaying only "Copy URL", "Close", and "Delete"
 * - Permanent Delete / Remove capability with confirmation dialog
 * - Zero password/hash exposure adhering to institutional security policy
 */
export default function AdminSecurityPage() {
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<PasswordChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Reject Modal State
  const [rejectingRequest, setRejectingRequest] = useState<PasswordChangeRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Delete Modal State
  const [deletingRequest, setDeletingRequest] = useState<PasswordChangeRequest | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      // 1. Authoritative local state from localStorage
      const localData = getAllPasswordRequests();
      setRequests(localData);
      setLoading(false);

      // 2. Sync local state to server runtime
      try {
        await fetch("/api/admin/password-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requests: localData }),
        });
      } catch {
        // Fallback gracefully if API is temporarily unavailable
      }
    } catch (err) {
      console.error("Error loading password requests:", err);
      const data = getAllPasswordRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadRequests();

    const handleUpdate = () => {
      const updated = getAllPasswordRequests();
      setRequests(updated);
    };

    window.addEventListener("chrononav:password_requests_updated", handleUpdate);
    return () => window.removeEventListener("chrononav:password_requests_updated", handleUpdate);
  }, [loadRequests]);

  const metrics = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "PENDING").length,
      approved: requests.filter((r) => r.status === "APPROVED").length,
      completed: requests.filter((r) => r.status === "COMPLETED").length,
      rejected: requests.filter((r) => r.status === "REJECTED").length,
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        req.user_name.toLowerCase().includes(q) ||
        req.account_identifier.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        (req.reason && req.reason.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [requests, statusFilter, searchQuery]);

  // ── Handle Approve ──
  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    setActionMessage(null);

    try {
      // 1. Update local storage immediately
      const localRes = approvePasswordRequest(id, "System Administrator");
      if (!localRes.success) {
        setActionMessage({ type: "error", text: localRes.error || "Failed to approve request." });
        setActionLoadingId(null);
        return;
      }

      // Update in-memory state and persist
      const updated = getAllPasswordRequests();
      setRequests(updated);

      // 2. Notify server API in background
      try {
        await fetch(`/api/admin/password-requests/${id}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "approve" }),
        });
      } catch {}

      setActionLoadingId(null);
      setActionMessage({
        type: "success",
        text: `Request approved. Single-use reset authorization token issued.`,
      });
    } catch {
      setActionLoadingId(null);
      setActionMessage({ type: "error", text: "Network error approving request." });
    }
  };

  // ── Handle Reject Confirmation ──
  const handleRejectConfirm = async () => {
    if (!rejectingRequest) return;
    const id = rejectingRequest.id;

    setActionLoadingId(id);
    setActionMessage(null);

    try {
      // 1. Update local storage immediately
      const localRes = rejectPasswordRequest(
        id,
        "System Administrator",
        rejectReason.trim() || "Administrative security discretion."
      );

      if (!localRes.success) {
        setActionMessage({ type: "error", text: localRes.error || "Failed to reject request." });
        setActionLoadingId(null);
        return;
      }

      const updated = getAllPasswordRequests();
      setRequests(updated);
      setRejectingRequest(null);
      setRejectReason("");

      // 2. Notify server API
      try {
        await fetch(`/api/admin/password-requests/${id}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "reject",
            reason: rejectReason.trim() || "Administrative security discretion.",
          }),
        });
      } catch {}

      setActionLoadingId(null);
      setActionMessage({ type: "success", text: `Request ${id} rejected.` });
    } catch {
      setActionLoadingId(null);
      setActionMessage({ type: "error", text: "Network error rejecting request." });
    }
  };

  // ── Handle Close / Archive Processed Request ──
  const handleClose = async (id: string) => {
    setActionLoadingId(id);
    setActionMessage(null);

    try {
      const localRes = closePasswordRequest(id, "System Administrator");
      if (!localRes.success) {
        setActionMessage({ type: "error", text: localRes.error || "Failed to close request." });
        setActionLoadingId(null);
        return;
      }

      const updated = getAllPasswordRequests();
      setRequests(updated);

      try {
        await fetch(`/api/admin/password-requests/${id}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "close" }),
        });
      } catch {}

      setActionLoadingId(null);
      setActionMessage({
        type: "success",
        text: `Request ${id} marked as completed & closed.`,
      });
    } catch {
      setActionLoadingId(null);
      setActionMessage({ type: "error", text: "Error closing request." });
    }
  };

  // ── Handle Delete Confirmation ──
  const handleDeleteConfirm = async () => {
    if (!deletingRequest) return;
    const id = deletingRequest.id;

    setActionLoadingId(id);
    setActionMessage(null);

    try {
      const localRes = deletePasswordRequest(id, "System Administrator");
      if (!localRes.success) {
        setActionMessage({ type: "error", text: localRes.error || "Failed to delete request." });
        setActionLoadingId(null);
        return;
      }

      const updated = getAllPasswordRequests();
      setRequests(updated);
      setDeletingRequest(null);

      try {
        await fetch(`/api/admin/password-requests/${id}`, {
          method: "DELETE",
        });
      } catch {}

      setActionLoadingId(null);
      setActionMessage({
        type: "success",
        text: `Request ${id} permanently removed.`,
      });
    } catch {
      setActionLoadingId(null);
      setActionMessage({ type: "error", text: "Error deleting request." });
    }
  };

  // ── Copy Reset Link ──
  const copyResetLink = (token: string, reqId: string) => {
    const url = `${window.location.origin}/reset-password?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedTokenId(reqId);
    setTimeout(() => setCopiedTokenId(null), 3000);
  };

  if (!mounted || loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Password Security & Reset Approvals
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Institutional workflow authorization for student & faculty credentials
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadRequests}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-all"
          >
            <RefreshCw className="size-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Action Notification Message */}
      {actionMessage && (
        <div
          className={`flex items-center gap-2.5 rounded-2xl p-4 text-xs font-bold animate-in fade-in ${
            actionMessage.type === "success"
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/15 border border-destructive/40 text-rose-500"
          }`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Requests</span>
            <FileText className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground">{metrics.total}</p>
          <p className="text-[10px] text-muted-foreground">All logged security submissions</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Pending Review</span>
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-amber-500"></span>
            </span>
          </div>
          <p className="text-2xl font-black text-foreground">{metrics.pending}</p>
          <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-semibold">Requires admin decision</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Approved Tokens</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{metrics.approved}</p>
          <p className="text-[10px] text-muted-foreground">Active reset authorization tokens</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[11px] font-extrabold uppercase tracking-wider">Completed / Reset</span>
            <ShieldCheck className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground">{metrics.completed}</p>
          <p className="text-[10px] text-muted-foreground">Successfully updated passwords</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["ALL", "PENDING", "APPROVED", "REJECTED", "COMPLETED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
              {st === "PENDING" && metrics.pending > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black">
                  {metrics.pending}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID, email..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>
      </div>

      {/* Requests Directory */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-3">
            <div className="size-12 rounded-full bg-muted/40 text-muted-foreground flex items-center justify-center mx-auto">
              <KeyRound className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Password Requests Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {searchQuery
                ? "No requests matching your search query."
                : "There are currently no password change or reset requests matching this status filter."}
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isPending = req.status === "PENDING";
            const isApproved = req.status === "APPROVED";
            const isProcessed = req.status !== "PENDING";

            return (
              <div
                key={req.id}
                className={`rounded-2xl border bg-card p-4 sm:p-5 shadow-sm transition-all space-y-3 ${
                  isPending
                    ? "border-amber-500/40 bg-amber-500/[0.02]"
                    : isApproved
                    ? "border-emerald-500/30 bg-emerald-500/[0.01]"
                    : "border-border"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                        req.role === "faculty"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {req.role === "faculty" ? (
                        <GraduationCap className="size-5" />
                      ) : (
                        <User className="size-5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-foreground">{req.user_name}</h4>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            req.role === "faculty"
                              ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {req.role}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {req.type === "change_password" ? "Change Password" : "Forgot Password"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">{req.account_identifier}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase ${
                        req.status === "PENDING"
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : req.status === "APPROVED"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : req.status === "COMPLETED"
                          ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                          : req.status === "EXPIRED"
                          ? "bg-muted text-muted-foreground border border-border"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                      }`}
                    >
                      {req.status === "PENDING" && <Clock className="size-3" />}
                      {req.status === "APPROVED" && <CheckCircle2 className="size-3" />}
                      {req.status === "COMPLETED" && <ShieldCheck className="size-3" />}
                      {req.status === "REJECTED" && <XCircle className="size-3" />}
                      <span>{req.status}</span>
                    </span>
                  </div>
                </div>

                {/* Request Details & Reason */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-muted/20 p-3 rounded-xl border border-border/60">
                  <div>
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">
                      Requested Date
                    </span>
                    <span className="font-semibold text-foreground">
                      {new Date(req.requested_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">
                      Reason / Remarks
                    </span>
                    <span className="text-foreground italic">
                      {req.reason || "No explicit reason specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-muted-foreground uppercase block">
                      Reviewed Status
                    </span>
                    <span className="text-foreground">
                      {req.reviewed_by ? `By ${req.reviewed_by}` : "Awaiting review"}
                    </span>
                  </div>
                </div>

                {/* ── Action Section: APPROVED (PROCESSED) REQUESTS ── */}
                {isApproved && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      <span className="font-bold text-foreground">Reset URL:</span>
                      <span className="text-muted-foreground font-mono truncate text-[11px]">
                        {req.reset_token
                          ? `/reset-password?token=${req.reset_token.substring(0, 20)}...`
                          : "Authorization Issued"}
                      </span>
                    </div>

                    {/* Processed Actions: Copy URL, Close, Delete */}
                    <div className="flex items-center gap-2 justify-end shrink-0">
                      {req.reset_token && (
                        <button
                          onClick={() => copyResetLink(req.reset_token!, req.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border hover:bg-accent text-xs font-bold text-foreground transition-all shadow-sm"
                          title="Copy secure reset URL to clipboard"
                        >
                          {copiedTokenId === req.id ? (
                            <>
                              <Check className="size-3.5 text-emerald-500" />
                              <span>Link Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5 text-primary" />
                              <span>Copy URL</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Close / Archive Button */}
                      <button
                        onClick={() => handleClose(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-all shadow-sm disabled:opacity-50"
                        title="Mark request completed and close"
                      >
                        <CheckCheck className="size-3.5 text-emerald-500" />
                        <span>Close</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeletingRequest(req)}
                        disabled={actionLoadingId === req.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-rose-600 dark:text-rose-400 hover:bg-destructive/20 text-xs font-bold transition-all disabled:opacity-50"
                        title="Delete request from queue"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Action Section: PENDING REQUESTS ── */}
                {isPending && (
                  <div className="flex items-center justify-between gap-2.5 pt-1">
                    {/* Delete Option for Pending */}
                    <button
                      onClick={() => setDeletingRequest(req)}
                      disabled={actionLoadingId === req.id}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-destructive/20 text-muted-foreground hover:text-rose-500 hover:bg-destructive/10 text-xs font-bold transition-all disabled:opacity-50"
                      title="Remove/Delete request"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </button>

                    {/* Reject & Approve Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setRejectingRequest(req);
                          setRejectReason("");
                        }}
                        disabled={actionLoadingId === req.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-destructive/30 bg-destructive/10 text-rose-600 dark:text-rose-400 hover:bg-destructive/20 text-xs font-black transition-all disabled:opacity-50"
                      >
                        <XCircle className="size-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-black shadow-md shadow-primary/20 transition-all disabled:opacity-50"
                      >
                        {actionLoadingId === req.id ? (
                          <>
                            <RefreshCw className="size-3.5 animate-spin" />
                            <span>Issuing Authorization...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-3.5" />
                            <span>Approve Reset</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Action Section: REJECTED / COMPLETED / EXPIRED (PROCESSED) REQUESTS ── */}
                {!isPending && !isApproved && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setDeletingRequest(req)}
                      disabled={actionLoadingId === req.id}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-muted-foreground hover:text-rose-500 hover:bg-destructive/10 text-xs font-bold transition-all disabled:opacity-50"
                      title="Permanently remove from records"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete Record</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Reject Reason Modal Dialog ── */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="size-6" />
              <h3 className="text-base font-black text-foreground">Reject Password Request</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to reject the password request for{" "}
              <span className="font-bold text-foreground">{rejectingRequest.user_name}</span> (
              {rejectingRequest.account_identifier})?
            </p>
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                Rejection Reason (Audit Trail)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Unverified identification, duplicate submission"
                rows={3}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="px-5 py-2.5 rounded-xl bg-destructive text-white hover:bg-destructive/90 text-xs font-black shadow-md shadow-destructive/20"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal Dialog ── */}
      {deletingRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <Trash2 className="size-6" />
              <h3 className="text-base font-black text-foreground">Delete Password Request</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Are you sure you want to permanently delete the request for{" "}
              <strong className="text-foreground">{deletingRequest.user_name}</strong> (
              {deletingRequest.account_identifier})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRequest(null)}
                className="px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-bold text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-destructive text-white hover:bg-destructive/90 text-xs font-black shadow-md shadow-destructive/20"
              >
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
