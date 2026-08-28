"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  MapPin,
  GraduationCap,
  Users,
  BookOpen,
  Building,
  Layers,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { ClassScheduleItem, DayOfWeek } from "@/types/schedule";
import { BackButton } from "@/components/shared/back-button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

const INITIAL_MASTER_SCHEDULES: (ClassScheduleItem & { program: string; yearLevel: string })[] = [
  {
    id: "m-sched-1",
    courseCode: "CS 301",
    courseTitle: "Data Structures and Algorithms",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "CCS 538",
    dayOfWeek: "Mon",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    section: "BSCS-3A",
    program: "BSCS",
    yearLevel: "3rd Year",
  },
  {
    id: "m-sched-2",
    courseCode: "CS 302",
    courseTitle: "Operating Systems & Architecture",
    instructor: "Engr. Pedro Cruz",
    building: "CCS Building",
    room: "Mac Lab 101",
    dayOfWeek: "Mon",
    startTime: "10:30 AM",
    endTime: "12:00 PM",
    section: "BSCS-3A",
    program: "BSCS",
    yearLevel: "3rd Year",
  },
  {
    id: "m-sched-3",
    courseCode: "IT-NETWORKING31",
    courseTitle: "Cisco Enterprise Networking",
    instructor: "Prof. Ana Reyes",
    building: "CCS Building",
    room: "CCS 301",
    dayOfWeek: "Mon",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    section: "BSIT-3B",
    program: "BSIT",
    yearLevel: "3rd Year",
  },
  {
    id: "m-sched-4",
    courseCode: "CS 201",
    courseTitle: "Object-Oriented Programming (Java)",
    instructor: "Prof. Roberto Gomez",
    building: "CCS Building",
    room: "Programming Lab 201",
    dayOfWeek: "Tue",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    section: "BSCS-2A",
    program: "BSCS",
    yearLevel: "2nd Year",
  },
  {
    id: "m-sched-5",
    courseCode: "IT-WEB22",
    courseTitle: "Full-Stack Web Development",
    instructor: "Engr. Elena Bautista",
    building: "CCS Building",
    room: "Mac Lab 101",
    dayOfWeek: "Tue",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    section: "BSIT-2A",
    program: "BSIT",
    yearLevel: "2nd Year",
  },
  {
    id: "m-sched-6",
    courseCode: "CS 401",
    courseTitle: "Advanced Machine Learning Systems",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "AI Lab 402",
    dayOfWeek: "Wed",
    startTime: "09:00 AM",
    endTime: "12:00 PM",
    section: "BSCS-4A",
    program: "BSCS",
    yearLevel: "4th Year",
  },
  {
    id: "m-sched-7",
    courseCode: "IT-CAPSTONE41",
    courseTitle: "Capstone Project & Research 2",
    instructor: "Prof. Ana Reyes",
    building: "CCS Building",
    room: "Innovation Lab 501",
    dayOfWeek: "Thu",
    startTime: "01:00 PM",
    endTime: "04:00 PM",
    section: "BSIT-4A",
    program: "BSIT",
    yearLevel: "4th Year",
  },
];

const AVAILABLE_ROOMS = [
  "Mac Lab 101",
  "Programming Lab 201",
  "Room 202",
  "CCS 301",
  "CCS 302",
  "AV Hall 401",
  "AI Lab 402",
  "CCS 538",
  "Innovation Lab 501",
  "Conference Room 503",
];

const AVAILABLE_DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Enterprise Admin Master Schedule Manager
 * Full CRUD capabilities for administrators to orchestrate courses across all
 * faculty members, classrooms, and academic programs. Includes conflict warning indicator.
 */
export default function AdminMasterSchedulePage() {
  const [schedules, setSchedules] = useState(INITIAL_MASTER_SCHEDULES);
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("ALL");
  const [dayFilter, setDayFilter] = useState("ALL");
  const [roomFilter, setRoomFilter] = useState("ALL");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<(typeof INITIAL_MASTER_SCHEDULES)[0] | null>(null);
  const [deletingItem, setDeletingItem] = useState<(typeof INITIAL_MASTER_SCHEDULES)[0] | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Form Fields for Create / Edit
  const [formData, setFormData] = useState({
    courseCode: "",
    courseTitle: "",
    instructor: "",
    building: "CCS Building",
    room: "CCS 538",
    dayOfWeek: "Mon" as DayOfWeek,
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    section: "BSCS-3A",
    program: "BSCS",
    yearLevel: "3rd Year",
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtered master schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchSearch =
        s.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.instructor || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.section || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchProgram = programFilter === "ALL" || s.program === programFilter;
      const matchDay = dayFilter === "ALL" || s.dayOfWeek === dayFilter;
      const matchRoom = roomFilter === "ALL" || s.room === roomFilter;

      return matchSearch && matchProgram && matchDay && matchRoom;
    });
  }, [schedules, searchQuery, programFilter, dayFilter, roomFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      courseCode: "",
      courseTitle: "",
      instructor: "",
      building: "CCS Building",
      room: "CCS 538",
      dayOfWeek: "Mon",
      startTime: "08:00 AM",
      endTime: "10:30 AM",
      section: "BSCS-3A",
      program: "BSCS",
      yearLevel: "3rd Year",
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: (typeof INITIAL_MASTER_SCHEDULES)[0]) => {
    setEditingItem(item);
    setFormData({
      courseCode: item.courseCode,
      courseTitle: item.courseTitle,
      instructor: item.instructor || "",
      building: item.building,
      room: item.room,
      dayOfWeek: (item.dayOfWeek as DayOfWeek) || "Mon",
      startTime: item.startTime,
      endTime: item.endTime,
      section: item.section || "BSCS-1A",
      program: item.program,
      yearLevel: item.yearLevel,
    });
  };


  // Save Create
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseCode || !formData.courseTitle || !formData.instructor) return;

    const newItem = {
      id: `m-sched-${Date.now()}`,
      ...formData,
    };

    setSchedules((prev) => [newItem, ...prev]);
    setIsCreateModalOpen(false);
    showToast(`Master schedule created for ${newItem.courseCode} (${newItem.room}).`);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSchedules((prev) =>
      prev.map((s) => (s.id === editingItem.id ? { ...s, ...formData } : s))
    );
    setEditingItem(null);
    showToast(`Updated master timetable for ${formData.courseCode}.`);
  };

  // Delete Schedule
  const handleDeleteSchedule = () => {
    if (!deletingItem) return;
    setSchedules((prev) => prev.filter((s) => s.id !== deletingItem.id));
    showToast(`Deleted ${deletingItem.courseCode} from university master schedules.`);
    setDeletingItem(null);
  };

  if (!mounted) {
    return <TableSkeleton rows={6} />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <BackButton fallbackUrl="/admin/dashboard" showLabel={false} />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2.5">
              <Calendar className="size-7 text-primary" />
              <span>Master Course & Room Schedules</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Central academic timetable orchestration across all faculty instructors, student sections, and CCS rooms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <ThemeToggle />
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white font-black text-xs hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all shrink-0"
          >
            <Plus className="size-4" />
            <span>Create Master Schedule</span>
          </button>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {notification && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in shadow-sm">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Overview Statistics Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            TOTAL ACTIVE BLOCKS
          </span>
          <span className="text-2xl font-black text-foreground">{schedules.length}</span>
          <span className="text-[11px] font-bold text-primary block">CCS Academic Catalog</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            UTILIZED ROOMS
          </span>
          <span className="text-2xl font-black text-foreground">10 Rooms</span>
          <span className="text-[11px] font-bold text-emerald-500 block">Floors 1 through 5</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            FACULTY ROSTER
          </span>
          <span className="text-2xl font-black text-foreground">18 Faculty</span>
          <span className="text-[11px] font-bold text-indigo-500 block">Teaching Instructors</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            ROOM CONFLICTS
          </span>
          <span className="text-2xl font-black text-emerald-500">0 Conflicts</span>
          <span className="text-[11px] font-bold text-muted-foreground block">Clean Allocation</span>
        </div>
      </div>

      {/* ── Filter & Search Control Panel ── */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course code, title, instructor, room, or section..."
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Program Filter */}
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="ALL">All Programs</option>
            <option value="BSCS">BSCS (Computer Science)</option>
            <option value="BSIT">BSIT (Information Tech)</option>
            <option value="BSIS">BSIS (Info Systems)</option>
            <option value="ACT">ACT</option>
          </select>

          {/* Day Filter */}
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="ALL">All Days</option>
            {AVAILABLE_DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          >
            <option value="ALL">All Rooms</option>
            {AVAILABLE_ROOMS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Master Schedule Data Table ── */}
      <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[10px] font-black tracking-wider">
                <th className="py-3.5 px-4">Course & Section</th>
                <th className="py-3.5 px-4">Subject Title</th>
                <th className="py-3.5 px-4">Assigned Instructor</th>
                <th className="py-3.5 px-4">Day & Time Block</th>
                <th className="py-3.5 px-4">Classroom</th>
                <th className="py-3.5 px-4">Program / Year</th>
                <th className="py-3.5 px-4 text-right">Master Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Calendar className="size-8 mx-auto mb-2 opacity-40" />
                    <p className="font-bold text-foreground">No schedule records matching filters.</p>
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-foreground">{item.courseCode}</span>
                        {item.section && (
                          <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/30 px-1.5 py-0.5 rounded">
                            {item.section}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground max-w-xs truncate">
                      {item.courseTitle}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-muted-foreground">
                      {item.instructor}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-foreground font-semibold">
                        <span className="font-black text-primary">{item.dayOfWeek}</span>
                        <Clock className="size-3 text-muted-foreground" />
                        <span>
                          {item.startTime} – {item.endTime}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-foreground bg-muted/60 px-2 py-0.5 rounded-lg border border-border">
                        <MapPin className="size-3 text-primary" />
                        <span>{item.room}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {item.program} • {item.yearLevel}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          title="Edit Master Schedule"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Schedule"
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
      </div>

      {/* ── CREATE / EDIT SCHEDULE MODAL ── */}
      {(isCreateModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/30">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground">
                    {editingItem ? "Edit Master Schedule" : "Create Master Schedule Block"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Assign courses, instructor, timeslot, and classroom
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={editingItem ? handleSaveEdit : handleSaveCreate}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    placeholder="e.g. CS 301"
                    required
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                    Section Code
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="e.g. BSCS-3A"
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                  Course / Subject Title
                </label>
                <input
                  type="text"
                  value={formData.courseTitle}
                  onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                  placeholder="e.g. Data Structures and Algorithms"
                  required
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                  Faculty Instructor
                </label>
                <input
                  type="text"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="e.g. Dr. Maria Santos"
                  required
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                    Day of Week
                  </label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) =>
                      setFormData({ ...formData, dayOfWeek: e.target.value as DayOfWeek })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    {AVAILABLE_DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                    Assigned Classroom
                  </label>
                  <select
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    {AVAILABLE_ROOMS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="10:30 AM"
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-border font-bold text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-black hover:bg-primary/90 shadow-md shadow-primary/30 transition-all"
                >
                  {editingItem ? "Save Changes" : "Create Master Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/20">
                <AlertTriangle className="size-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-foreground">Remove Master Schedule Block</h3>
                <p className="text-xs text-muted-foreground">Admin Schedule Deletion</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                {deletingItem.courseCode} - {deletingItem.courseTitle} ({deletingItem.room})
              </strong>
              ? This will remove the timetable block across student schedules and faculty workloads.
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSchedule}
                className="px-4 py-2 rounded-xl bg-destructive text-xs font-black text-white hover:bg-destructive/90 transition-all shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
