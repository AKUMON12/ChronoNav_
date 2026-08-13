"use client";

import React, { useState } from "react";
import { 
  Megaphone, 
  Plus, 
  Send, 
  AlertTriangle, 
  Bell, 
  Trash2, 
  CheckCircle2, 
  Eye, 
  Users, 
  GraduationCap, 
  UserCog 
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "Normal" | "Important" | "Urgent";
  targetAudience: "All Users" | "Students Only" | "Faculty Only";
  createdAt: string;
  status: "Active" | "Archived";
}

const initialAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "1st Semester Final Exam Schedule Announced",
    content: "Please check your student portal for final examination room assignments in the CCS Building.",
    priority: "Important",
    targetAudience: "Students Only",
    createdAt: "2026-08-12 09:00 AM",
    status: "Active",
  },
  {
    id: "ann-2",
    title: "CCS Mac Laboratory 101 Maintenance Notice",
    content: "Mac Lab 101 will undergo software updates this Friday from 4:00 PM to 6:00 PM.",
    priority: "Normal",
    targetAudience: "All Users",
    createdAt: "2026-08-11 02:30 PM",
    status: "Active",
  },
  {
    id: "ann-3",
    title: "EMERGENCY: Floor 4 Elevator Temporary Outage",
    content: "Elevator 2 servicing Floor 4 is currently under emergency servicing. Please use central staircases.",
    priority: "Urgent",
    targetAudience: "All Users",
    createdAt: "2026-08-10 11:15 AM",
    status: "Active",
  },
];

export default function CampusBulletinPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"Normal" | "Important" | "Urgent">("Normal");
  const [targetAudience, setTargetAudience] = useState<"All Users" | "Students Only" | "Faculty Only">("All Users");
  const [notification, setNotification] = useState<string | null>(null);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      priority,
      targetAudience,
      createdAt: new Date().toLocaleString(),
      status: "Active",
    };

    setAnnouncements([newAnn, ...announcements]);
    setTitle("");
    setContent("");
    setNotification("Campus Announcement broadcasted successfully!");
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "Active" ? "Archived" : "Active" } : a
      )
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Megaphone className="size-8 text-[#1D7DD7]" />
            <span>Campus Bulletin & Broadcast Board</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Broadcast campus announcements, emergency alerts, and room notifications to ChronoNav users.
          </p>
        </div>
      </div>

      {notification && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Broadcast Form */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-1 border-b border-border pb-3">
            <h3 className="text-sm font-black uppercase tracking-wide text-foreground flex items-center gap-2">
              <Send className="size-4 text-[#1D7DD7]" />
              <span>Broadcast New Announcement</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Send notifications to student & faculty dashboards.
            </p>
          </div>

          <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs font-bold">
            <div>
              <label className="text-muted-foreground block mb-1">Announcement Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Schedule Change Notice..."
                className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-muted-foreground block mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground focus:ring-2 focus:ring-[#1D7DD7]"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">🚨 Urgent / Emergency</option>
                </select>
              </div>

              <div>
                <label className="text-muted-foreground block mb-1">Target Audience</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as any)}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground focus:ring-2 focus:ring-[#1D7DD7]"
                >
                  <option value="All Users">All Users</option>
                  <option value="Students Only">Students Only</option>
                  <option value="Faculty Only">Faculty Only</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">Announcement Content</label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter detailed notice message for students and faculty..."
                className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground focus:ring-2 focus:ring-[#1D7DD7]"
                required
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D7DD7] p-3 text-xs font-extrabold text-white hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all"
            >
              <Send className="size-4" />
              <span>Broadcast Announcement Now</span>
            </button>
          </form>
        </div>

        {/* Right: Broadcast Feed */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 lg:col-span-7">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center justify-between border-b border-border pb-3">
            <span>Broadcast Feed ({announcements.length})</span>
            <span className="text-[10px] font-bold text-[#1D7DD7] bg-[#1D7DD7]/10 px-2 py-0.5 rounded-md">
              Live Feed
            </span>
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-2xl border transition-all ${
                  ann.priority === "Urgent"
                    ? "bg-rose-500/10 border-rose-500/30"
                    : ann.priority === "Important"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-background border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                        ann.priority === "Urgent"
                          ? "bg-rose-500 text-white"
                          : ann.priority === "Important"
                          ? "bg-amber-500 text-white"
                          : "bg-primary/10 text-primary"
                      }`}>
                        {ann.priority}
                      </span>

                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {ann.targetAudience}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-foreground pt-1">{ann.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
                    <span className="text-[10px] text-muted-foreground font-semibold block pt-1">
                      Posted: {ann.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleStatus(ann.id)}
                      className="px-2 py-1 text-[10px] font-bold rounded-lg border border-border hover:bg-accent text-muted-foreground"
                    >
                      {ann.status === "Active" ? "Archive" : "Unarchive"}
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1 text-rose-500 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
