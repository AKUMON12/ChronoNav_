export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface ClassScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  instructor?: string;
  room: string;
  building: string;
  dayOfWeek: DayOfWeek | string;
  startTime: string; // e.g. "08:00 AM" or "08:00"
  endTime: string;   // e.g. "10:30 AM" or "10:30"
  section?: string;
  units?: number;
  floor?: number | string;
}

export interface ParsedScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  instructor: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  building: string;
  room: string;
  confidence: number;
  units?: number;
  floor?: number | string;
}

export interface ExtractedStudentInfo {
  idNumber?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  program?: string;
  yearLevel?: string;
  totalUnits?: number;
  semester?: string;
  schoolYear?: string;
  dateEnrolled?: string;
}

export interface OCRScheduleResult {
  parsedItems: ParsedScheduleItem[];
  rawText: string;
  confidence: number;
  extractedStudent?: ExtractedStudentInfo;
}
