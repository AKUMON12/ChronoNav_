import { NextRequest, NextResponse } from "next/server";
import { createPasswordChangeRequest, validatePasswordStrength } from "@/lib/auth/password-manager";
import { findUserByIdentifier, getAllUsers } from "@/lib/auth/auth-store";

/**
 * POST /api/auth/password/change
 * Authenticated Password Change Request Endpoint
 *
 * Verifies current password on server side and queues request for administrative approval.
 * CRITICAL: The new password is NEVER stored in the request.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, identifier, currentPassword, newPassword, confirmPassword, reason } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Please provide your current password, new password, and confirmation." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from your current password." },
        { status: 400 }
      );
    }

    // Validate strength
    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      return NextResponse.json(
        { error: strength.errors[0] || "New password does not meet security requirements." },
        { status: 400 }
      );
    }

    // Resolve user ID
    let resolvedUserId = userId;
    if (!resolvedUserId && identifier) {
      const users = getAllUsers();
      const user = findUserByIdentifier(identifier, users);
      if (user) {
        resolvedUserId = user.id;
      }
    }

    if (!resolvedUserId) {
      return NextResponse.json(
        { error: "Unable to identify authenticated user session." },
        { status: 401 }
      );
    }

    const result = createPasswordChangeRequest(resolvedUserId, currentPassword, reason);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create password change request." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Password change request submitted successfully. An administrator will review and authorize your request shortly.",
      request: result.request,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error processing password change request." },
      { status: 500 }
    );
  }
}
