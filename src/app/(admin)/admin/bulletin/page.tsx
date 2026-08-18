"use client";

import React, { useState, useMemo } from "react";
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
  UserCog,
  Edit2,
  Filter,
} from "lucide-react";
import { AnnouncementModal, AnnouncementItem } from "@/components/bulletin/announcement-modal";

const initialBulletins: AnnouncementItem[] = [
  {
    id: "ann-1",
    title: "1st Semester Midterm Examination Rooms Announced",
    content: "Please check your student schedule for midterm examination room assignments across Floors 1 to 5 in the CCS Building.",
    priority: "urgent",
    target: "students",
    date: "2026-08-16",
    author: "CCS Dean's Office",
  },
  {
    id: "ann-2",
    title: "Floor 4 Elevator Maintenance Schedule",
    content: "Elevator servicing is scheduled this Friday from 4:00 PM to 6:00 PM. Please utilize the central concrete stairwell.",
    priority: "maintenance",
    target: "all",
    date: "2026-08-15",
    author: "Facilities & Operations",
  },
  {
    id: "ann-3",
    title: "CCS Innovation Lab 501 Open Hackathon Registration",
    content: "Registration for the annual Inter-College Systems Hackathon is now open for BSCS and BSIT students on the 5th floor.",
    priority: "general",
    target: "students",
    date: "2026-08-14",
    author: "College of Computer Studies",
  },
];

export default function CampusBulletinPage() {
  const [bulletins, setBulletins] = useState<AnnouncementItem[]>(initialBulletins);
  const [targetFilter, setTargetFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBulletin, setEditingBulletin] = useState<AnnouncementItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredBulletins = useMemo(() => {
    return bulletins.filter((b) => {
      const matchTarget = targetFilter === "all" || b.target === targetFilter;
      const matchPriority = priorityFilter === "all" || b.priority === priorityFilter;
      return matchTarget && matchPriority;
    });
  }, [bulletins, targetFilter, priorityFilter]);

  const handleSaveBulletin = (item: AnnouncementItem) => {
    setBulletins((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) {
        return prev.map((b) => (b.id === item.id ? item : b));
      }
      return [item, ...prev];
    });
    showToast(`Bulletin "${item.title}" successfully published.`);
  };

  const handleDeleteBulletin = (id: string) => {
    setBulletins((prev) => prev.filter((b) => b.id !== id));
    showToast("Announcement removed from broadcast board.");
  };

  const getPriorityStyle = (priority: AnnouncementItem["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "maintenance":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-[#1D7DD7]/15 text-[#1D7DD7] border-[#1D7DD7]/30";
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#507495]/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Megaphone className="size-7 text-[#1D7DD7]" />
            <span>Campus Bulletin & Broadcast Board</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#74777E] mt-1">
            Broadcast official university notices, maintenance updates, and classroom advisories to ChronoNav users.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBulletin(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#1D7DD7] px-4 py-2.5 text-xs font-black text-white hover:bg-[#1D7DD7]/90 shadow-lg shadow-[#1D7DD7]/30 transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>Publish New Bulletin</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs text-emerald-400 font-bold animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#74777E] flex items-center gap-1">
            <Filter className="size-3.5" />
            <span>Target:</span>
          </span>
          <div className="flex rounded-2xl border border-[#507495]/30 bg-[#0E151B] p-1 text-xs">
            {["all", "students", "faculty"].map((target) => (
              <button
                key={target}
                onClick={() => setTargetFilter(target)}
                className={`px-3 py-1 rounded-xl font-bold capitalize transition-all ${
                  targetFilter === target
                    ? "bg-[#1D7DD7] text-white shadow-sm"
                    : "text-[#74777E] hover:text-white"
                }`}
              >
                {target}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#74777E]">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-2xl border border-[#507495]/30 bg-[#0E151B] px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent Only</option>
            <option value="maintenance">Maintenance Only</option>
            <option value="general">General Notice Only</option>
          </select>
        </div>
      </div>

      {/* Announcements Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBulletins.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-[#507495]/20 bg-[#141E28] p-12 text-center text-[#74777E]">
            <Bell className="size-10 mx-auto mb-2 opacity-40" />
            <p className="font-bold text-white">No announcements found matching filter.</p>
          </div>
        ) : (
          filteredBulletins.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#1D7DD7]/40 transition-all group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${getPriorityStyle(
                      item.priority
                    )}`}
                  >
                    {item.priority}
                  </span>

                  <span className="text-[10px] font-bold text-[#74777E] bg-[#0E151B] px-2 py-0.5 rounded capitalize">
                    Audience: {item.target}
                  </span>
                </div>

                <h3 className="text-sm font-black text-white leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-[#507495]/15 flex items-center justify-between text-[11px] text-[#74777E]">
                <span>{item.date}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingBulletin(item);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-[#74777E] hover:text-white hover:bg-[#0E151B] transition-colors"
                    title="Edit Bulletin"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBulletin(item.id)}
                    className="p-1.5 rounded-lg text-[#74777E] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Bulletin"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Announcement Modal */}
      <AnnouncementModal
        isOpen={isModalOpen}
        announcement={editingBulletin}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBulletin}
      />
    </div>
  );
}
