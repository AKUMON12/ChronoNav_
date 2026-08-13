"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ScanLine, 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  ArrowRight, 
  Plus, 
  Sparkles, 
  CheckCircle2,
  Navigation,
  Compass
} from "lucide-react";
import { ClassScheduleItem, ParsedScheduleItem } from "@/types/schedule";
import { OCRUploadModal } from "@/components/schedule/ocr-upload-modal";

/** Initial UC Main Campus Student Class Schedule */
const initialSchedules: ClassScheduleItem[] = [
  {
    id: "sched-1",
    courseCode: "IT-CPSTONE41",
    courseTitle: "Capstone Project and Research 1",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "CCS 401",
    dayOfWeek: "Mon",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
  },
  {
    id: "sched-2",
    courseCode: "CS 301",
    courseTitle: "Data Structures & Algorithms",
    instructor: "Engr. Pedro Cruz",
    building: "CCS Building",
    room: "Mac Lab 101",
    dayOfWeek: "Tue",
    startTime: "10:30 AM",
    endTime: "12:00 PM",
  },
  {
    id: "sched-3",
    courseCode: "CS 302",
    courseTitle: "Operating Systems & Architecture",
    instructor: "Prof. Ana Reyes",
    building: "CCS Building",
    room: "CCS 201",
    dayOfWeek: "Wed",
    startTime: "01:00 PM",
    endTime: "02:30 PM",
  },
  {
    id: "sched-4",
    courseCode: "IT-NETWORKING31",
    courseTitle: "Cisco Enterprise Networking",
    instructor: "Engr. Juan Dela Cruz",
    building: "CCS Building",
    room: "CCS 301",
    dayOfWeek: "Thu",
    startTime: "02:30 PM",
    endTime: "04:30 PM",
  },
  {
    id: "sched-5",
    courseCode: "GE 104",
    courseTitle: "Science, Technology, and Society",
    instructor: "Dr. Ramon Garcia",
    building: "Main Building",
    room: "Room 202",
    dayOfWeek: "Sat",
    startTime: "08:00 AM",
    endTime: "11:00 AM",
  },
];

// Room Code to Pathfinding Graph Target Node ID mapping
const ROOM_NODE_MAPPING: Record<string, string> = {
  "CCS 401": "F4_AV_HALL_401",
  "MAC LAB 101": "F1_MAC_LAB_101",
  "CCS 201": "F2_PROG_LAB_201",
  "ROOM 201": "F2_PROG_LAB_201",
  "ROOM 202": "F2_LECTURE_202",
  "CCS 301": "F3_NETWORK_LAB_301",
  "CCS 538": "F4_AI_LAB_402",
};

export default function SchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ClassScheduleItem[]>(initialSchedules);
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [isOCRModalOpen, setIsOCRModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Filter schedules by day
  const filteredSchedules = selectedDay === "All" 
    ? schedules 
    : schedules.filter((s) => s.dayOfWeek.toLowerCase() === selectedDay.toLowerCase());

  // Handle OCR Confirmation Callback
  const handleConfirmOCRSchedule = async (parsedItems: ParsedScheduleItem[]) => {
    const newItems: ClassScheduleItem[] = parsedItems.map((item) => ({
      id: item.id,
      courseCode: item.courseCode,
      courseTitle: item.courseTitle,
      instructor: item.instructor,
      building: item.building,
      room: item.room,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
    }));

    // Post to API Ingestion handler
    try {
      await fetch("/api/ocr/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: parsedItems,
          fileName: "study_load_scan.pdf",
          userId: "demo-student-id",
        }),
      });
    } catch (err) {
      console.warn("API log error:", err);
    }

    setSchedules((prev) => [...newItems, ...prev]);
    setNotification(`Successfully imported ${newItems.length} classes from Study Load OCR!`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleNavigateToRoom = (roomCode: string) => {
    const upperRoom = roomCode.toUpperCase().trim();
    const targetNode = ROOM_NODE_MAPPING[upperRoom] || "F3_DEAN_OFFICE";
    router.push(`/map?start=F1_ENTRANCE&target=${targetNode}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="size-7 text-[#1D7DD7]" />
            <span>Class Schedule & Study Load</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your enrollment study load and generate indoor routes to your classrooms.
          </p>
        </div>

        <button
          onClick={() => setIsOCRModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#1D7DD7] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all shrink-0"
        >
          <ScanLine className="size-4" />
          <span>Upload Study Load (OCR)</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {notification && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">ENROLLED CLASSES</span>
          <p className="text-xl font-black text-foreground">{schedules.length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">TOTAL UNITS</span>
          <p className="text-xl font-black text-[#1D7DD7]">{schedules.length * 3} Units</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">CAMPUS BUILDING</span>
          <p className="text-sm font-extrabold text-foreground truncate">UC Main • CCS</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">ACTIVE SEMESTER</span>
          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">1st Sem 2026-2027</p>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                  : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 hover:border-[#1D7DD7]/40 shadow-sm transition-all hover:shadow-md"
            >
              {/* Left: Course Info */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center justify-center rounded-xl bg-[#1D7DD7]/10 text-[#1D7DD7] border border-[#1D7DD7]/20 px-3 py-2.5 text-xs font-black min-w-[90px] shrink-0 text-center">
                  <span>{item.startTime}</span>
                  <span className="text-[10px] opacity-60 font-bold">to</span>
                  <span>{item.endTime}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1D7DD7] bg-[#1D7DD7]/10 px-2 py-0.5 rounded-md">
                      {item.courseCode}
                    </span>
                    <span className="text-[11px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {item.dayOfWeek}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {item.courseTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1 font-bold text-foreground">
                      <MapPin className="size-3.5 text-[#1D7DD7]" />
                      {item.building} — <span className="text-[#1D7DD7]">{item.room}</span>
                    </span>

                    {item.instructor && (
                      <span className="text-muted-foreground font-medium">
                        Instructor: {item.instructor}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action: Navigate Direct Button */}
              <button
                onClick={() => handleNavigateToRoom(item.room)}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-[#1D7DD7] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <Compass className="size-4 text-[#1D7DD7] group-hover:text-white" />
                <span>Get Directions</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center space-y-3">
            <Calendar className="size-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-bold text-foreground">No classes scheduled for {selectedDay}</p>
            <p className="text-xs text-muted-foreground">Upload your study load document to extract and populate your classes.</p>
          </div>
        )}
      </div>

      {/* OCR Modal */}
      <OCRUploadModal
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
        onConfirmSchedule={handleConfirmOCRSchedule}
      />
    </div>
  );
}
