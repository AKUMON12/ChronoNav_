"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, MapPin, BookOpen, User, Check, Loader2 } from "lucide-react";
import { ClassScheduleItem, DayOfWeek } from "@/types/schedule";

interface ScheduleCRUDModalProps {
  isOpen: boolean;
  item: ClassScheduleItem | null;
  onClose: () => void;
  onSave: (data: ClassScheduleItem) => void;
}

const AVAILABLE_ROOMS = [
  { code: "CCS 538", name: "CCS 538 - 5th Floor Lecture" },
  { code: "Mac Lab 101", name: "Mac Lab 101 - 1st Floor" },
  { code: "CCS 301", name: "CCS 301 - 3rd Floor Lecture" },
  { code: "AV Hall 401", name: "AV Hall 401 - 4th Floor" },
  { code: "Innovation Lab 501", name: "Innovation Lab 501 - 5th Floor" },
  { code: "Faculty Room 205", name: "CCS Faculty Room 205 - 2nd Floor" },
];

export function ScheduleCRUDModal({ isOpen, item, onClose, onSave }: ScheduleCRUDModalProps) {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [room, setRoom] = useState("CCS 538");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("Mon");
  const [startTime, setStartTime] = useState("08:00 AM");
  const [endTime, setEndTime] = useState("10:30 AM");
  const [section, setSection] = useState("BSCS-3A");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setCourseCode(item.courseCode || "");
      setCourseTitle(item.courseTitle || "");
      setInstructor(item.instructor || "");
      setRoom(item.room || "CCS 538");
      setDayOfWeek((item.dayOfWeek as DayOfWeek) || "Mon");
      setStartTime(item.startTime || "08:00 AM");
      setEndTime(item.endTime || "10:30 AM");
      setSection(item.section || "BSCS-3A");
      setError(null);
    } else {
      setCourseCode("");
      setCourseTitle("");
      setInstructor("CCS Faculty");
      setRoom("CCS 538");
      setDayOfWeek("Mon");
      setStartTime("08:00 AM");
      setEndTime("10:30 AM");
      setSection("BSCS-3A");
      setError(null);
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim() || !room.trim()) {
      setError("Please fill in course code, title, and assigned room.");
      return;
    }

    const payload: ClassScheduleItem = {
      id: item?.id || `cls-${Date.now()}`,
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseTitle.trim(),
      instructor: instructor.trim() || "CCS Faculty",
      room: room.trim(),
      building: "CCS Building",
      dayOfWeek,
      startTime,
      endTime,
      section,
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
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Calendar className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-foreground">
                {item ? "Edit Class Schedule" : "Add New Subject Schedule"}
              </h3>
              <p className="text-[11px] text-muted-foreground">Course & Timetable Configuration</p>
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
          {/* Course Code & Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Course Code</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS 301"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary uppercase font-bold shadow-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Section</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. BSCS-3A"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
          </div>

          {/* Course Title */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Course Descriptive Title</label>
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="e.g. Data Structures and Algorithms"
              className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              required
            />
          </div>

          {/* Instructor & Room */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Instructor</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="e.g. Dr. Maria Santos"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Assigned Room</label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                {AVAILABLE_ROOMS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Day and Times */}
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Day</label>
              <select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="Mon">Mon</option>
                <option value="Tue">Tue</option>
                <option value="Wed">Wed</option>
                <option value="Thu">Thu</option>
                <option value="Fri">Fri</option>
                <option value="Sat">Sat</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="08:00 AM"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
            </div>
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
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white font-black hover:bg-primary/90 shadow-md shadow-primary/30 transition-all"
            >
              <span>{item ? "Save Changes" : "Add Subject"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
