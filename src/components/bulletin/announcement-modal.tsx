"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, AlertTriangle, Info, Wrench, Users, Check, Loader2 } from "lucide-react";

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  priority: "general" | "maintenance" | "urgent";
  target: "all" | "students" | "faculty";
  date: string;
  author: string;
}

interface AnnouncementModalProps {
  isOpen: boolean;
  announcement: AnnouncementItem | null;
  onClose: () => void;
  onSave: (data: AnnouncementItem) => void;
}

export function AnnouncementModal({
  isOpen,
  announcement,
  onClose,
  onSave,
}: AnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<AnnouncementItem["priority"]>("general");
  const [target, setTarget] = useState<AnnouncementItem["target"]>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title);
      setContent(announcement.content);
      setPriority(announcement.priority);
      setTarget(announcement.target);
      setError(null);
    } else {
      setTitle("");
      setContent("");
      setPriority("general");
      setTarget("all");
      setError(null);
    }
  }, [announcement, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both the title and announcement content.");
      return;
    }

    const payload: AnnouncementItem = {
      id: announcement?.id || `bulletin-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      priority,
      target,
      date: announcement?.date || new Date().toISOString().split("T")[0],
      author: announcement?.author || "CCS Administrative Office",
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-in zoom-in-95 transition-colors duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
              <Bell className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                {announcement ? "Edit Campus Bulletin" : "Publish New Bulletin"}
              </h3>
              <p className="text-[11px] text-muted-foreground">Campus Notice & Alerts System</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-bold text-rose-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Bulletin Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CCS 5th Floor Elevator Maintenance"
              className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              required
            />
          </div>

          {/* Priority and Target Audience */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AnnouncementItem["priority"])}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="general">General Notice</option>
                <option value="maintenance">Maintenance & Facility</option>
                <option value="urgent">Urgent / Emergency</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Target Audience</label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value as AnnouncementItem["target"])}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="all">All Campus Users</option>
                <option value="students">Students Only</option>
                <option value="faculty">Faculty & Staff Only</option>
              </select>
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Notice Description</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide clear details regarding schedule adjustments, room transfers, or facility work..."
              className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed shadow-sm"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-white font-black hover:bg-primary/90 shadow-md shadow-primary/30 transition-all"
            >
              <span>{announcement ? "Save Bulletin Changes" : "Publish Announcement"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
