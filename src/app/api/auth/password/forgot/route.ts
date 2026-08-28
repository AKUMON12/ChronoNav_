import { NextRequest, NextResponse } from "next/server";
import { createForgotPasswordRequest } from "@/lib/auth/password-manager";

/**
 * POST /api/auth/password/forgot
 * Unauthenticated Forgot Password Request Endpoint
 *
 * Submits an administrative password reset request.
 * Returns a generic success response to prevent user account enumeration.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, reason } = body;

    if (!identifier || !identifier.trim()) {
      return NextResponse.json(
        { error: "Please enter your university email or student/employee ID number." },
        { status: 400 }
      );
    }

    const result = createForgotPasswordRequest(identifier.trim(), reason);

    return NextResponse.json({
      success: true,
      message: result.message,
      request: result.request,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
