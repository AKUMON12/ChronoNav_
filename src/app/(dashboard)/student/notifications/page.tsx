"use client";

import React, { useState } from "react";
import { Bell, Megaphone, CheckCircle2, Clock, Info } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "announcement" | "reminder" | "system";
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "1st Semester Final Exam Schedule Announced",
    message: "Please check your study load portal for final exam room assignments in the CCS Building.",
    time: "2 hours ago",
    type: "announcement",
    read: false,
  },
  {
    id: "notif-2",
    title: "Class Reminder: Capstone Project 1",
    message: "Your upcoming class is in CCS 401 at 08:00 AM.",
    time: "5 hours ago",
    type: "reminder",
    read: true,
  },
  {
    id: "notif-3",
    title: "Study Load OCR Scanner Status",
    message: "5 classes extracted successfully from your study load scan.",
    time: "1 day ago",
    type: "system",
    read: true,
  },
];

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Bell className="size-7 text-[#1D7DD7]" />
            <span>Campus Notifications</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Stay updated with class reminders, bulletin notices, and indoor route alerts.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-xs font-bold text-[#1D7DD7] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-2xl border transition-all ${
              notif.read ? "bg-card border-border" : "bg-[#1D7DD7]/5 border-[#1D7DD7]/30 shadow-sm"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-[#1D7DD7]/10 text-[#1D7DD7] shrink-0">
                <Bell className="size-4" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">{notif.title}</h3>
                  <span className="text-[10px] text-muted-foreground font-semibold">{notif.time}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
