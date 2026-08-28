import { describe, it, expect } from "vitest";
import {
  parseTimeToMinutes,
  compareScheduleItems,
  sortScheduleItems,
  isMajorSubject,
} from "../time";
import { ClassScheduleItem } from "@/types/schedule";

describe("ChronoNav Schedule Time & Sorting Engine", () => {
  // Test Case 1: Normal chronological order (Earliest -> Latest)
  it("Case 1: correctly sorts classes chronologically (08:00 AM, 10:00 AM, 01:00 PM, 03:00 PM)", () => {
    const unsorted: ClassScheduleItem[] = [
      { id: "1", courseCode: "CS 302", courseTitle: "OS", room: "101", building: "CCS", dayOfWeek: "Mon", startTime: "03:00 PM", endTime: "04:30 PM" },
      { id: "2", courseCode: "CS 301", courseTitle: "DSA", room: "538", building: "CCS", dayOfWeek: "Mon", startTime: "08:00 AM", endTime: "10:00 AM" },
      { id: "3", courseCode: "IT 301", courseTitle: "Web", room: "201", building: "CCS", dayOfWeek: "Mon", startTime: "01:00 PM", endTime: "02:30 PM" },
      { id: "4", courseCode: "CS 303", courseTitle: "DB", room: "301", building: "CCS", dayOfWeek: "Mon", startTime: "10:00 AM", endTime: "12:00 PM" },
    ];

    const sorted = sortScheduleItems(unsorted, "time_asc");
    expect(sorted.map((s) => s.startTime)).toEqual([
      "08:00 AM",
      "10:00 AM",
      "01:00 PM",
      "03:00 PM",
    ]);
  });

  // Test Case 2: Reverse order (Latest -> Earliest)
  it("Case 2: correctly sorts classes in reverse chronological order (03:00 PM -> 08:00 AM)", () => {
    const unsorted: ClassScheduleItem[] = [
      { id: "1", courseCode: "CS 301", courseTitle: "DSA", room: "538", building: "CCS", dayOfWeek: "Mon", startTime: "08:00 AM", endTime: "10:00 AM" },
      { id: "2", courseCode: "CS 302", courseTitle: "OS", room: "101", building: "CCS", dayOfWeek: "Mon", startTime: "03:00 PM", endTime: "04:30 PM" },
      { id: "3", courseCode: "IT 301", courseTitle: "Web", room: "201", building: "CCS", dayOfWeek: "Mon", startTime: "01:00 PM", endTime: "02:30 PM" },
    ];

    const sorted = sortScheduleItems(unsorted, "time_desc");
    expect(sorted.map((s) => s.startTime)).toEqual([
      "03:00 PM",
      "01:00 PM",
      "08:00 AM",
    ]);
  });

  // Test Case 3: AM/PM edge cases (12:00 AM, 01:00 AM, 11:00 AM, 12:00 PM, 01:00 PM)
  it("Case 3: correctly handles 12:00 AM (midnight) and 12:00 PM (noon) without lexicographical bugs", () => {
    expect(parseTimeToMinutes("12:00 AM")).toBe(0);
    expect(parseTimeToMinutes("01:00 AM")).toBe(60);
    expect(parseTimeToMinutes("11:00 AM")).toBe(660);
    expect(parseTimeToMinutes("12:00 PM")).toBe(720);
    expect(parseTimeToMinutes("12:30 PM")).toBe(750);
    expect(parseTimeToMinutes("01:00 PM")).toBe(780);

    const unsorted: ClassScheduleItem[] = [
      { id: "1", courseCode: "C1", courseTitle: "T1", room: "1", building: "B", dayOfWeek: "Mon", startTime: "01:00 PM", endTime: "02:00 PM" },
      { id: "2", courseCode: "C2", courseTitle: "T2", room: "2", building: "B", dayOfWeek: "Mon", startTime: "12:00 PM", endTime: "01:00 PM" },
      { id: "3", courseCode: "C3", courseTitle: "T3", room: "3", building: "B", dayOfWeek: "Mon", startTime: "12:00 AM", endTime: "01:00 AM" },
      { id: "4", courseCode: "C4", courseTitle: "T4", room: "4", building: "B", dayOfWeek: "Mon", startTime: "11:00 AM", endTime: "12:00 PM" },
    ];

    const sorted = sortScheduleItems(unsorted, "time_asc");
    expect(sorted.map((s) => s.startTime)).toEqual([
      "12:00 AM",
      "11:00 AM",
      "12:00 PM",
      "01:00 PM",
    ]);
  });

  // Test Case 4: Same start time tie-breaking
  it("Case 4: applies deterministic secondary sorting on same start time (by end time then course code)", () => {
    const items: ClassScheduleItem[] = [
      { id: "1", courseCode: "IT 202", courseTitle: "Networking", room: "301", building: "CCS", dayOfWeek: "Mon", startTime: "08:00 AM", endTime: "10:30 AM" },
      { id: "2", courseCode: "CS 101", courseTitle: "Prog", room: "538", building: "CCS", dayOfWeek: "Mon", startTime: "08:00 AM", endTime: "09:30 AM" },
      { id: "3", courseCode: "CS 201", courseTitle: "OOP", room: "101", building: "CCS", dayOfWeek: "Mon", startTime: "08:00 AM", endTime: "10:30 AM" },
    ];

    const sorted = sortScheduleItems(items, "time_asc");
    // Shorter end time first (09:30 AM before 10:30 AM), then CS 201 before IT 202
    expect(sorted.map((s) => s.courseCode)).toEqual(["CS 101", "CS 201", "IT 202"]);
  });

  // Test Case 5: Major / Minor Priority Sorting
  it("Case 5: prioritizes major subjects over minor subjects when priority sorting is selected", () => {
    expect(isMajorSubject("CS 301", "Data Structures")).toBe(true);
    expect(isMajorSubject("IT-CPSTONE40", "Capstone")).toBe(true);
    expect(isMajorSubject("LIT 101", "World Literature")).toBe(false);
    expect(isMajorSubject("GE 104", "STS")).toBe(false);

    const mixed: ClassScheduleItem[] = [
      { id: "1", courseCode: "LIT 101", courseTitle: "Literature", room: "J910", building: "Main", dayOfWeek: "Mon", startTime: "08:00 AM", endTime: "09:00 AM" },
      { id: "2", courseCode: "CS 301", courseTitle: "DSA", room: "538", building: "CCS", dayOfWeek: "Mon", startTime: "10:00 AM", endTime: "12:00 PM" },
      { id: "3", courseCode: "GE 104", courseTitle: "STS", room: "201", building: "Main", dayOfWeek: "Mon", startTime: "01:00 PM", endTime: "02:30 PM" },
      { id: "4", courseCode: "IT-ELAI", courseTitle: "AI Elective", room: "544", building: "CCS", dayOfWeek: "Mon", startTime: "08:30 AM", endTime: "10:30 AM" },
    ];

    const sorted = sortScheduleItems(mixed, "priority_major");
    // Majors: IT-ELAI (08:30 AM), CS 301 (10:00 AM); Minors: LIT 101 (08:00 AM), GE 104 (01:00 PM)
    expect(sorted.map((s) => s.courseCode)).toEqual([
      "IT-ELAI",
      "CS 301",
      "LIT 101",
      "GE 104",
    ]);
  });

  // Test Case 6: Cross-Midnight Times
  it("Case 6: correctly handles 24-hour and edge time strings", () => {
    expect(parseTimeToMinutes("23:45")).toBe(1425);
    expect(parseTimeToMinutes("00:15")).toBe(15);
  });
});
