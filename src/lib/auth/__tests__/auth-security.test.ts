import { describe, it, expect } from "vitest";
import {
  authenticateUser,
  registerUser,
  getUserSchedule,
  saveUserSchedule,
} from "../auth-store";
import { signIn } from "@/lib/supabase/auth";

describe("ChronoNav Authentication Security & Data Isolation Test Suite", () => {
  // Test 1: Nonexistent account fails
  it("Security Test 1: rejects login for nonexistent account with generic error", async () => {
    const result = await signIn("fake.student999@uc.edu.ph", "Password123!");
    expect(result.user).toBeNull();
    expect(result.error).toBe("Invalid university email or password.");
  });

  // Test 2: Invalid password on valid account fails
  it("Security Test 2: rejects login when valid email is supplied with an incorrect password", async () => {
    const result = await signIn("admin@uc.edu.ph", "WrongPassword123!");
    expect(result.user).toBeNull();
    expect(result.error).toBe("Invalid university email or password.");
  });

  // Test 3: Random credentials fail
  it("Security Test 3: rejects login with completely random email and password", async () => {
    const result = await signIn("random_xyz_abc@somedomain.com", "asdf1234456!");
    expect(result.user).toBeNull();
    expect(result.error).toBe("Invalid university email or password.");
  });

  // Test 4: Empty inputs fail validation
  it("Security Test 4: rejects login with empty email or empty password", async () => {
    const res1 = await signIn("", "");
    expect(res1.user).toBeNull();
    expect(res1.error).toContain("provide both");

    const res2 = await signIn("admin@uc.edu.ph", "   ");
    expect(res2.user).toBeNull();
    expect(res2.error).toContain("provide both");
  });

  // Test 5: Valid Admin Login succeeds
  it("Security Test 5: authenticates official Admin account with valid credentials and flexible identifier", async () => {
    // 5a. Full email
    const result1 = await signIn("admin@uc.edu.ph", "Admin@ChronoNav2026!");
    expect(result1.error).toBeNull();
    expect(result1.user).not.toBeNull();
    expect(result1.user?.user_metadata?.role).toBe("admin");

    // 5b. Short identifier 'admin'
    const result2 = await signIn("admin", "Admin@ChronoNav2026!");
    expect(result2.error).toBeNull();
    expect(result2.user?.user_metadata?.role).toBe("admin");
  });

  // Test 6: Valid Faculty Login succeeds
  it("Security Test 6: authenticates official Faculty account with valid credentials", async () => {
    const result = await signIn("maria.santos@uc.edu.ph", "Faculty@ChronoNav2026!");
    expect(result.error).toBeNull();
    expect(result.user).not.toBeNull();
    expect(result.user?.user_metadata?.role).toBe("faculty");
  });

  // Test 7: Valid Student Login succeeds (via Full Email and via ID Number)
  it("Security Test 7: authenticates official Student account via full email and student ID number", async () => {
    // 7a. Full email
    const result1 = await signIn("22682702@uc.edu.ph", "Student@ChronoNav2026!");
    expect(result1.error).toBeNull();
    expect(result1.user).not.toBeNull();
    expect(result1.user?.user_metadata?.role).toBe("student");
    expect(result1.user?.user_metadata?.first_name).toBe("Vince Andrew");

    // 7b. Raw Student ID Number '22682702'
    const result2 = await signIn("22682702", "Student@ChronoNav2026!");
    expect(result2.error).toBeNull();
    expect(result2.user?.user_metadata?.first_name).toBe("Vince Andrew");

    // 7c. Tristan Developer ID '22684955'
    const result3 = await signIn("22684955", "Student@ChronoNav2026!");
    expect(result3.error).toBeNull();
    expect(result3.user?.user_metadata?.first_name).toBe("Tristan");
  });

  // Test 8: Duplicate Account Registration is blocked
  it("Security Test 8: prevents duplicate registration of existing university email", () => {
    const duplicateResult = registerUser({
      email: "admin@uc.edu.ph",
      password: "NewPassword123!",
      first_name: "Test",
      last_name: "Duplicate",
      id_number: "99999999",
      program: "BSCS",
      year_level: "1st Year",
    });
    expect(duplicateResult.user).toBeNull();
    expect(duplicateResult.error).toContain("already registered");
  });

  // Test 9: Valid Registration works and hashes password
  it("Security Test 9: successfully registers a new student with hashed password and isolated schedule", () => {
    const uniqueEmail = `student_${Date.now()}@uc.edu.ph`;
    const uniqueId = `2299${Math.floor(Math.random() * 10000)}`;

    const regResult = registerUser({
      email: uniqueEmail,
      password: "SecureStudent@2026!",
      first_name: "John",
      last_name: "Doe",
      id_number: uniqueId,
      program: "BSIT",
      year_level: "3rd Year",
      initialSchedules: [
        {
          id: "custom-1",
          courseCode: "IT-WEB",
          courseTitle: "Web Dev",
          room: "538",
          building: "CCS",
          dayOfWeek: "Mon",
          startTime: "08:00 AM",
          endTime: "10:00 AM",
        },
      ],
    });

    expect(regResult.error).toBeNull();
    expect(regResult.user).not.toBeNull();
    expect(regResult.user?.role).toBe("student");
    expect(regResult.user?.passwordHash).not.toBe("SecureStudent@2026!");

    const authCheck = authenticateUser(uniqueEmail, "SecureStudent@2026!");
    expect(authCheck.error).toBeNull();
    expect(authCheck.user?.id).toBe(regResult.user?.id);
  });

  // Test 10: Strict User Data Isolation
  it("Security Test 10: enforces strict schedule ownership boundaries between users", () => {
    const userA_Id = "usr_student_A_1001";
    const userB_Id = "usr_student_B_2002";

    const userA_Schedule = [
      {
        id: "sched-A-1",
        courseCode: "CS 301",
        courseTitle: "User A Class",
        room: "521",
        building: "CCS",
        dayOfWeek: "Mon",
        startTime: "08:00 AM",
        endTime: "10:00 AM",
      },
    ];

    const userB_Schedule = [
      {
        id: "sched-B-1",
        courseCode: "IT-NET",
        courseTitle: "User B Class",
        room: "J910",
        building: "Main",
        dayOfWeek: "Fri",
        startTime: "02:30 PM",
        endTime: "03:30 PM",
      },
    ];

    saveUserSchedule(userA_Id, userA_Schedule);
    saveUserSchedule(userB_Id, userB_Schedule);

    const fetchedA = getUserSchedule(userA_Id);
    const fetchedB = getUserSchedule(userB_Id);

    expect(fetchedA.map((s) => s.courseCode)).toEqual(["CS 301"]);
    expect(fetchedA.map((s) => s.courseCode)).not.toContain("IT-NET");

    expect(fetchedB.map((s) => s.courseCode)).toEqual(["IT-NET"]);
    expect(fetchedB.map((s) => s.courseCode)).not.toContain("CS 301");
  });
});
