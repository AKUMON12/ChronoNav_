"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Megaphone,
  CheckCircle2,
  Clock,
  ArrowRight,
  CheckCheck,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  CampusNotification,
  getStoredNotifications,
  saveStoredNotifications,
} from "@/lib/notifications";

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
  notifications: CampusNotification[];
  onNotificationsChange: (updated: CampusNotification[]) => void;
}

/**
 * Enterprise Notification Preview Popover Component
 * Provides a clean, responsive summary of recent notifications (limit: 4).
 * Features quick action links, mark all read, and full view-all navigation.
 */
export function NotificationPopover({
  isOpen,
  onClose,
  userRole = "student",
  notifications,
  onNotificationsChange,
}: NotificationPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click or Escape key press
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recentNotifications = notifications.slice(0, 4);
  const viewAllHref = userRole === "admin" ? "/admin/bulletin" : "/notifications";

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    onNotificationsChange(updated);
    saveStoredNotifications(updated);
  };

  const handleNotificationClick = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    onNotificationsChange(updated);
    saveStoredNotifications(updated);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      role="dialog"
      aria-label="Notifications overview"
      className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-3xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 transition-colors"
      style={{ backgroundColor: "var(--popover)" }}
    >
      {/* ── Popover Header ── */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="size-4" />
          </div>
          <span className="text-xs font-black text-foreground uppercase tracking-wider">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-primary hover:underline px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
              title="Mark all notifications as read"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close notifications"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Recent Notifications List ── */}
      <div className="max-h-80 overflow-y-auto divide-y divide-border/60 bg-popover">
        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Bell className="size-8 mx-auto text-muted-foreground/40" />
            <p className="text-xs font-bold text-foreground">No notifications</p>
            <p className="text-[11px] text-muted-foreground">You are all caught up!</p>
          </div>
        ) : (
          recentNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item.id)}
              className={`p-3.5 hover:bg-muted/50 transition-colors cursor-pointer group ${
                !item.read ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-xl shrink-0 mt-0.5 ${
                    item.category === "announcement"
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      : item.category === "reminder"
                      ? "bg-primary/15 text-primary"
                      : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {item.category === "announcement" ? (
                    <Megaphone className="size-4" />
                  ) : item.category === "reminder" ? (
                    <Clock className="size-4" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    {!item.read && (
                      <span className="size-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                    <span>{item.timestamp}</span>
                    {item.actionUrl && (
                      <span className="text-primary font-bold inline-flex items-center gap-0.5 group-hover:underline">
                        <span>{item.actionLabel || "View"}</span>
                        <ArrowRight className="size-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Popover Footer CTA ── */}
      <div className="border-t border-border p-2.5 bg-muted/40">
        <Link
          href={viewAllHref}
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-card border border-border/80 hover:bg-primary hover:text-white py-2.5 px-3 text-xs font-extrabold text-foreground transition-all shadow-sm group"
        >
          <span>View All Notifications</span>
          <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
