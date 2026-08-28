import { NextRequest, NextResponse } from "next/server";
import { completePasswordReset, validatePasswordStrength } from "@/lib/auth/password-manager";

/**
 * POST /api/auth/password/reset
 * Completes the password reset process with validated single-use token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword, confirmPassword } = body;

    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Token, new password, and confirmation are required." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json(
        { error: strength.errors[0] || "Password does not meet complexity requirements." },
        { status: 400 }
      );
    }

    const result = completePasswordReset(token, newPassword);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to reset password." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Your password has been successfully updated. All prior sessions have been invalidated. Please sign in with your new password.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error completing password reset." },
      { status: 500 }
    );
  }
}
