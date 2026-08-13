export interface ClassScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  instructor?: string;
  room: string;
  building: string;
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime: string; // e.g. "08:00 AM" or "08:00"
  endTime: string;   // e.g. "10:30 AM" or "10:30"
  section?: string;
}

export interface ParsedScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime: string;
  endTime: string;
  building: string;
  room: string;
  confidence: number;
}

export interface OCRScheduleResult {
  parsedItems: ParsedScheduleItem[];
  rawText: string;
  confidence: number;
}

