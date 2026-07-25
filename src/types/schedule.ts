export interface ClassScheduleItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  instructor?: string;
  room: string;
  building: string;
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  startTime: string; // e.g. "08:00"
  endTime: string;   // e.g. "10:30"
}

export interface OCRScheduleResult {
  parsedItems: Partial<ClassScheduleItem>[];
  rawText: string;
  confidence: number;
}
