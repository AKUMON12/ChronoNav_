import { describe, it, expect } from "vitest";
import { parseScheduleText } from "../parser";

describe("ChronoNav OCR Schedule Parser", () => {
  it("should extract course code, description, time range, and room code from UC study load text", () => {
    const rawUCStudyLoadText = `
UNIVERSITY OF CEBU — MAIN CAMPUS
COLLEGE OF COMPUTER STUDIES (CCS)
10482  IT-CPSTONE41  Capstone Project 1  MWF  08:00 AM - 10:30 AM  CCS 401
    `;

    const result = parseScheduleText(rawUCStudyLoadText);

    expect(result).not.toBeNull();
    expect(result.parsedItems.length).toBeGreaterThan(0);

    const firstItem = result.parsedItems[0];
    expect(firstItem.courseCode).toContain("IT-CPSTONE41");
    expect(firstItem.startTime).toBe("08:00 AM");
    expect(firstItem.endTime).toBe("10:30 AM");
    expect(firstItem.room).toBe("CCS 401");
  });

  it("should fall back to structured sample UC study load result when raw text is empty", () => {
    const result = parseScheduleText("");

    expect(result).not.toBeNull();
    expect(result.parsedItems.length).toBe(5);
    expect(result.confidence).toBeGreaterThan(0.9);
  });
});
