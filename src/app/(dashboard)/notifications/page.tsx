"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  Megaphone,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCheck,
  Trash2,
  Layers,
  Sparkles,
} from "lucide-react";
import { BackButton } from "@/components/shared/back-button";
import {
  CampusNotification,
  getStoredNotifications,
  saveStoredNotifications,
} from "@/lib/notifications";

/**
 * Enterprise Campus Notification Hub Page
 * Supports real-time announcement feeds, class reminders, indoor map jump links, and filter controls.
 */
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<CampusNotification[]>(() =>
    getStoredNotifications()
  );
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "announcement" | "reminder">("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === "unread") return !item.read;
      if (activeFilter === "announcement") return item.category === "announcement";
      if (activeFilter === "reminder") return item.category === "reminder";
      return true;
    });
  }, [notifications, activeFilter]);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const toggleReadStatus = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: !n.read } : n
    );
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  const clearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full transition-colors duration-200">
      {/* ── Header Title & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <BackButton fallbackUrl="/dashboard" showLabel={false} />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
              <Bell className="size-8 text-primary" />
              <span>Campus Notifications</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time university bulletin notices, class schedule alerts, and indoor wayfinding reminders.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors shadow-sm"
            >
              <CheckCheck className="size-4" />
              <span>Mark all read ({unreadCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeFilter === "all"
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-muted/50 border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setActiveFilter("unread")}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeFilter === "unread"
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-muted/50 border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Unread ({unreadCount})
        </button>

        <button
          onClick={() => setActiveFilter("announcement")}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeFilter === "announcement"
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-muted/50 border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Announcements
        </button>

        <button
          onClick={() => setActiveFilter("reminder")}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeFilter === "reminder"
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "bg-muted/50 border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          Class Reminders
        </button>
      </div>

      {/* ── Notification Feed ── */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-3">
            <Bell className="size-12 mx-auto text-muted-foreground/40" />
            <h3 className="text-base font-bold text-foreground">No notifications found</h3>
            <p className="text-xs text-muted-foreground">You are completely caught up with all campus alerts!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 ${
                notif.read
                  ? "bg-card border-border shadow-sm"
                  : "bg-primary/5 border-primary/30 shadow-md ring-1 ring-primary/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Category Icon */}
                  <div
                    className={`flex size-10 items-center justify-center rounded-2xl shrink-0 mt-0.5 shadow-sm ${
                      notif.category === "announcement"
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400"
                        : notif.category === "reminder"
                        ? "bg-primary/15 border border-primary/30 text-primary"
                        : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {notif.category === "announcement" ? (
                      <Megaphone className="size-5" />
                    ) : notif.category === "reminder" ? (
                      <Clock className="size-5" />
                    ) : (
                      <CheckCircle2 className="size-5" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-extrabold text-foreground tracking-tight">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="size-2 rounded-full bg-primary ring-2 ring-primary/30 shrink-0" />
                      )}
                      {notif.priority === "urgent" && (
                        <span className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-500">
                          Urgent
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        <span>{notif.timestamp}</span>
                      </span>

                      {notif.actionUrl && (
                        <Link
                          href={notif.actionUrl}
                          className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                        >
                          <span>{notif.actionLabel || "View Details"}</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleReadStatus(notif.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title={notif.read ? "Mark as unread" : "Mark as read"}
                    aria-label="Toggle read status"
                  >
                    <CheckCircle2 className={`size-4 ${notif.read ? "text-emerald-500" : "text-muted-foreground"}`} />
                  </button>
                  <button
                    onClick={() => clearNotification(notif.id)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Dismiss notification"
                    aria-label="Dismiss notification"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
