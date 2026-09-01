import { describe, it, expect, beforeEach } from "vitest";
import {
  validatePasswordStrength,
  createPasswordChangeRequest,
  createForgotPasswordRequest,
  getAllPasswordRequests,
  approvePasswordRequest,
  rejectPasswordRequest,
  closePasswordRequest,
  deletePasswordRequest,
  verifyResetToken,
  completePasswordReset,
  resetPasswordRequestsStore,
} from "@/lib/auth/password-manager";
import {
  getAllUsers,
  authenticateUser,
  simpleHash,
  generateSalt,
  updateUserPassword,
} from "@/lib/auth/auth-store";

describe("Enterprise Password Management & Security Test Suite", () => {
  beforeEach(() => {
    resetPasswordRequestsStore();
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
  });

  describe("1. Password Complexity & Policy Enforcement", () => {
    it("rejects passwords shorter than 8 characters", () => {
      const result = validatePasswordStrength("Ab1!xyz");
      expect(result.valid).toBe(false);
      expect(result.checks.minLength).toBe(false);
      expect(result.errors).toContain("Password must be at least 8 characters long.");
    });

    it("rejects passwords lacking uppercase letters", () => {
      const result = validatePasswordStrength("student@2026!");
      expect(result.valid).toBe(false);
      expect(result.checks.hasUpper).toBe(false);
    });

    it("rejects passwords lacking lowercase letters", () => {
      const result = validatePasswordStrength("STUDENT@2026!");
      expect(result.valid).toBe(false);
      expect(result.checks.hasLower).toBe(false);
    });

    it("rejects passwords lacking numerical digits", () => {
      const result = validatePasswordStrength("StudentPassword!");
      expect(result.valid).toBe(false);
      expect(result.checks.hasNumber).toBe(false);
    });

    it("rejects passwords lacking special characters", () => {
      const result = validatePasswordStrength("StudentPass2026");
      expect(result.valid).toBe(false);
      expect(result.checks.hasSpecial).toBe(false);
    });

    it("accepts strong, compliant institutional passwords", () => {
      const result = validatePasswordStrength("ChronoNav@2026!Secure");
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.checks.minLength).toBe(true);
      expect(result.checks.hasUpper).toBe(true);
      expect(result.checks.hasLower).toBe(true);
      expect(result.checks.hasNumber).toBe(true);
      expect(result.checks.hasSpecial).toBe(true);
    });
  });

  describe("2. Authenticated Password Change Workflow (Workflow A)", () => {
    it("rejects password change if current password is incorrect", () => {
      const users = getAllUsers();
      const testUser = users[0]; // Admin

      const result = createPasswordChangeRequest(testUser.id, "WrongCurrentPassword123!");
      expect(result.success).toBe(false);
      expect(result.error).toContain("Current password verification failed");
    });

    it("accepts password change request when current password is verified", () => {
      const users = getAllUsers();
      const testUser = users.find((u) => u.email === "22682702@uc.edu.ph") || users[0];

      // Password for test user
      const result = createPasswordChangeRequest(testUser.id, "Student@ChronoNav2026!");
      expect(result.success).toBe(true);
      expect(result.request).toBeDefined();
      expect(result.request?.status).toBe("PENDING");
      expect(result.request?.type).toBe("change_password");
    });

    it("GUARANTEES zero password exposure: new or current password is NEVER stored in the request", () => {
      const users = getAllUsers();
      const testUser = users[0];

      const result = createPasswordChangeRequest(testUser.id, "Admin@ChronoNav2026!");
      expect(result.success).toBe(true);

      const requestObj = result.request as unknown as Record<string, unknown>;
      expect(requestObj.currentPassword).toBeUndefined();
      expect(requestObj.newPassword).toBeUndefined();
      expect(requestObj.password).toBeUndefined();
      expect(requestObj.passwordHash).toBeUndefined();
      expect(requestObj.salt).toBeUndefined();
    });
  });

  describe("3. Unauthenticated Forgot Password Workflow (Workflow B) & Enumeration Defense", () => {
    it("returns generic non-leaking message for both existing and non-existing accounts", () => {
      const resReal = createForgotPasswordRequest("22682702@uc.edu.ph");
      const resFake = createForgotPasswordRequest("nonexistent.user.9999@uc.edu.ph");

      expect(resReal.success).toBe(true);
      expect(resFake.success).toBe(true);
      expect(resReal.message).toBe(resFake.message);
      expect(resReal.message).toContain("If an account matching this institutional identifier exists");
    });

    it("creates a pending request for valid student ID lookup", () => {
      createForgotPasswordRequest("22682702");
      const requests = getAllPasswordRequests();
      const found = requests.find((r) => r.account_identifier === "22682702@uc.edu.ph");
      expect(found).toBeDefined();
      expect(found?.status).toBe("PENDING");
      expect(found?.type).toBe("forgot_password");
    });
  });

  describe("4. Administrative Review & Approval Workflow", () => {
    it("allows admin to approve a pending request, issuing single-use token with expiration", () => {
      createForgotPasswordRequest("22682702@uc.edu.ph");
      const requests = getAllPasswordRequests();
      const target = requests.find((r) => r.account_identifier === "22682702@uc.edu.ph")!;

      const approval = approvePasswordRequest(target.id, "Admin Superuser");
      expect(approval.success).toBe(true);
      expect(approval.token).toBeDefined();
      expect(approval.token?.startsWith("rst_")).toBe(true);
      expect(approval.request?.status).toBe("APPROVED");
      expect(approval.request?.token_expires_at).toBeDefined();
    });

    it("allows admin to reject a pending request", () => {
      createForgotPasswordRequest("22684955@uc.edu.ph");
      const requests = getAllPasswordRequests();
      const target = requests.find((r) => r.account_identifier === "22684955@uc.edu.ph")!;

      const rejection = rejectPasswordRequest(target.id, "Admin Superuser", "Suspicious unverified device IP");
      expect(rejection.success).toBe(true);
      expect(rejection.request?.status).toBe("REJECTED");
      expect(rejection.request?.reason).toContain("Suspicious unverified device IP");
    });

    it("allows admin to close/archive an approved or processed request", () => {
      createForgotPasswordRequest("22682702@uc.edu.ph");
      const requests = getAllPasswordRequests();
      const target = requests.find((r) => r.account_identifier === "22682702@uc.edu.ph")!;
      approvePasswordRequest(target.id, "Admin Superuser");

      const closeResult = closePasswordRequest(target.id, "Admin Superuser");
      expect(closeResult.success).toBe(true);
      expect(closeResult.request?.status).toBe("COMPLETED");
    });

    it("allows admin to permanently delete a request from queue", () => {
      createForgotPasswordRequest("22682702@uc.edu.ph");
      const requests = getAllPasswordRequests();
      const target = requests.find((r) => r.account_identifier === "22682702@uc.edu.ph")!;

      const deleteResult = deletePasswordRequest(target.id, "Admin Superuser");
      expect(deleteResult.success).toBe(true);

      const afterDelete = getAllPasswordRequests();
      expect(afterDelete.some((r) => r.id === target.id)).toBe(false);
    });
  });

  describe("5. Token Cryptographic Lifecycle, Single-Use & Session Invalidation", () => {
    it("verifies active, unexpired approved tokens", () => {
      createForgotPasswordRequest("22682702@uc.edu.ph");
      const requests = getAllPasswordRequests();
      const target = requests.find((r) => r.account_identifier === "22682702@uc.edu.ph")!;
      const { token } = approvePasswordRequest(target.id, "Admin Superuser");

      const check = verifyResetToken(token!);
      expect(check.valid).toBe(true);
      expect(check.request?.user_name).toBeDefined();
    });

    it("completes password reset, consumes token, updates cryptographic hash, and prevents token reuse", () => {
      createForgotPasswordRequest("22682702@uc.edu.ph");
      const requests = getAllPasswordRequests();
      const target = requests.find((r) => r.account_identifier === "22682702@uc.edu.ph")!;
      const { token } = approvePasswordRequest(target.id, "Admin Superuser");

      const newSecretPass = "VinceNewPassword@2026!";
      const resetResult = completePasswordReset(token!, newSecretPass);
      expect(resetResult.success).toBe(true);

      // Authenticate with new password
      const auth = authenticateUser("22682702@uc.edu.ph", newSecretPass);
      expect(auth.user).toBeDefined();
      expect(auth.error).toBeNull();

      // Attempting to reuse the exact same token MUST be rejected (single-use policy)
      const reuseAttempt = completePasswordReset(token!, "AnotherNewPass@2026!");
      expect(reuseAttempt.success).toBe(false);
      expect(
        reuseAttempt.error?.includes("Invalid or unrecognized password reset token") ||
        reuseAttempt.error?.includes("no longer valid")
      ).toBe(true);
    });
  });
});
