import { describe, it, expect } from "vitest";
import { parseScheduleText, getSampleUCStudyLoadVince, resolveRoomFloor } from "../parser";

describe("ChronoNav OCR Schedule Parser", () => {
  it("should extract student identity, degree program, courses, and rooms from official UC Study Load PDF format", () => {
    const rawUCStudyLoadText = `
UNIVERSITY OF CEBU - MAIN
155A Sanciangko St. Cebu City
OFFICIAL STUDY LOAD 1ST SEM. SY 2025-2026
22682702 VINCE ANDREW D. SANTOYA BSIT 4
SCHED. NO. COURSE NO. TIME DAYS ROOM UNITS REMARKS
07732 LIT 101 2:30 - 3:30 PM MWF J910 3
34363 IT-CPSTONE40 6:31 - 9:31 PM SAT 521 3
39651 IT-FRELEAN 11:30 - 12:30 PM MWF 530B 3
39669 IT-ELAI 3:30 - 6:31 PM FRI 544 3
IT-ELAI LAB 6:31 - 8:31 PM FRI 536
39685 IT-ELEMSYS 3:30 - 6:31 PM SAT 544 3
IT-ELEMSYS LAB 1:30 - 3:30 PM SAT 530B
DATE ENROLLED: 08/09/25 TOTAL: 15
    `;

    const result = parseScheduleText(rawUCStudyLoadText);

    expect(result).not.toBeNull();
    expect(result.extractedStudent?.idNumber).toBe("22682702");
    expect(result.extractedStudent?.fullName).toBe("VINCE ANDREW D. SANTOYA");
    expect(result.extractedStudent?.program).toBe("BSIT");
    expect(result.extractedStudent?.totalUnits).toBe(15);
    expect(result.parsedItems.length).toBeGreaterThan(0);

    // Verify rooms are extracted
    const rooms = result.parsedItems.map((p) => p.room);
    expect(rooms).toContain("J910");
    expect(rooms).toContain("521");
    expect(rooms).toContain("530B");
    expect(rooms).toContain("544");
    expect(rooms).toContain("536");
  });

  it("should resolve correct campus building and floor levels from room codes", () => {
    expect(resolveRoomFloor("521").floor).toBe(5);
    expect(resolveRoomFloor("530B").floor).toBe(5);
    expect(resolveRoomFloor("544").floor).toBe(5);
    expect(resolveRoomFloor("536").floor).toBe(5);
    expect(resolveRoomFloor("401").floor).toBe(4);
    expect(resolveRoomFloor("301").floor).toBe(3);
    expect(resolveRoomFloor("201").floor).toBe(2);
    expect(resolveRoomFloor("J910").floor).toBe(1);
  });

  it("should return valid parsed Vince Andrew Santoya sample study load", () => {
    const sample = getSampleUCStudyLoadVince();
    expect(sample.extractedStudent?.idNumber).toBe("22682702");
    expect(sample.extractedStudent?.fullName).toContain("VINCE ANDREW");
    expect(sample.parsedItems.length).toBeGreaterThanOrEqual(7);
  });
});
