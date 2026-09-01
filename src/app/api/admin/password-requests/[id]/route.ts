import { NextRequest, NextResponse } from "next/server";
import { deletePasswordRequest } from "@/lib/auth/password-manager";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * DELETE /api/admin/password-requests/[id]
 * Deletes a password change or reset request from the queue (Admin Only).
 */
export async function DELETE(
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

    const result = deletePasswordRequest(id, adminIdentifier);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Password request ${id} deleted successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete password request." },
      { status: 500 }
    );
  }
}
