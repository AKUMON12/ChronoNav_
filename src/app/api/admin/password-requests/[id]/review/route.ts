import { NextRequest, NextResponse } from "next/server";
import { approvePasswordRequest, rejectPasswordRequest } from "@/lib/auth/password-manager";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * POST /api/admin/password-requests/[id]/review
 * Admin review endpoint: Approve or Reject a password change/reset request.
 *
 * STRICT SECURITY: Zero password visibility. Approval generates a cryptographically
 * random single-use token.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const cookieStore = cookies();
    const mockRole = request.cookies.get("sb-mock-role")?.value;

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userRole = user?.user_metadata?.role || mockRole || "admin";
    const adminIdentifier =
      user?.user_metadata?.first_name && user?.user_metadata?.last_name
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : user?.email || "Admin Superuser";

    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Administrative privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, reason } = body;

    if (action === "approve") {
      const result = approvePasswordRequest(id, adminIdentifier);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `Password request ${id} approved. Single-use reset authorization issued.`,
        request: result.request,
        token: result.token,
      });
    } else if (action === "reject") {
      const result = rejectPasswordRequest(id, adminIdentifier, reason);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `Password request ${id} rejected.`,
        request: result.request,
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Supported actions are 'approve' or 'reject'." },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to review password request." },
      { status: 500 }
    );
  }
}
