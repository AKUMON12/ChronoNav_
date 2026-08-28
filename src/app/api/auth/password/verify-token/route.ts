import { NextRequest, NextResponse } from "next/server";
import { verifyResetToken } from "@/lib/auth/password-manager";

/**
 * GET /api/auth/password/verify-token?token=...
 * Validates single-use reset token before rendering password reset form
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing reset token parameter." }, { status: 400 });
    }

    const verification = verifyResetToken(token);

    if (!verification.valid || !verification.request) {
      return NextResponse.json(
        { valid: false, error: verification.error || "Invalid or expired token." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      user_name: verification.request.user_name,
      account_identifier: verification.request.account_identifier,
      role: verification.request.role,
      token_expires_at: verification.request.token_expires_at,
    });
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: "Failed to verify reset token." },
      { status: 500 }
    );
  }
}
