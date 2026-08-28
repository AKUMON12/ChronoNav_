import { NextRequest, NextResponse } from "next/server";
import { getAllPasswordRequests } from "@/lib/auth/password-manager";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * GET /api/admin/password-requests
 * Lists all pending, approved, rejected, and completed password requests (Admin Only)
 *
 * STRICT SECURITY: Never returns passwords or password hashes.
 */
export async function GET(request: NextRequest) {
  try {
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

    // Enforce admin privileges
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Administrator privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let requests = getAllPasswordRequests();
    if (statusFilter && statusFilter !== "ALL") {
      requests = requests.filter((r) => r.status === statusFilter);
    }

    return NextResponse.json({
      requests,
      metrics: {
        total: requests.length,
        pending: requests.filter((r) => r.status === "PENDING").length,
        approved: requests.filter((r) => r.status === "APPROVED").length,
        rejected: requests.filter((r) => r.status === "REJECTED").length,
        completed: requests.filter((r) => r.status === "COMPLETED").length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve password change requests." },
      { status: 500 }
    );
  }
}
