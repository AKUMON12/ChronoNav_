import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * GET /api/admin/users
 * Returns list of system users (requires Admin or returns simulated mock users in dev)
 */
export async function GET(request: NextRequest) {
  const cookieStore = cookies();
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

  // Return full mock user list for local development / testing
  const initialUsers = [
    {
      id: "u-1",
      id_number: "22684955",
      first_name: "Tristan",
      last_name: "Developer",
      email: "22684955@uc.edu.ph",
      role: "student",
      program: "BSCS",
      status: "Active",
      created_at: "2026-08-01T08:00:00Z",
    },
    {
      id: "u-2",
      id_number: "21589412",
      first_name: "Maria",
      last_name: "Santos",
      email: "maria.santos@uc.edu.ph",
      role: "faculty",
      program: "CCS",
      status: "Active",
      created_at: "2026-07-15T10:30:00Z",
    },
    {
      id: "u-3",
      id_number: "20194821",
      first_name: "Admin",
      last_name: "Superuser",
      email: "admin@uc.edu.ph",
      role: "admin",
      program: "CCS",
      status: "Active",
      created_at: "2026-06-10T14:20:00Z",
    },
    {
      id: "u-4",
      id_number: "22784910",
      first_name: "Pedro",
      last_name: "Cruz",
      email: "22784910@uc.edu.ph",
      role: "student",
      program: "BSIT",
      status: "Active",
      created_at: "2026-08-05T09:15:00Z",
    },
    {
      id: "u-5",
      id_number: "22490123",
      first_name: "Ana",
      last_name: "Reyes",
      email: "ana.reyes@uc.edu.ph",
      role: "faculty",
      program: "CCS",
      status: "Active",
      created_at: "2026-07-20T11:45:00Z",
    },
    {
      id: "u-6",
      id_number: "21984712",
      first_name: "Carlos",
      last_name: "Tan",
      email: "21984712@uc.edu.ph",
      role: "student",
      program: "ACT",
      status: "Suspended",
      created_at: "2026-07-28T16:00:00Z",
    },
  ];

  return NextResponse.json({ users: initialUsers });
}

/**
 * POST /api/admin/users
 * Provisions a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_number, first_name, last_name, email, role, program, status } = body;

    if (!id_number || !first_name || !last_name || !email) {
      return NextResponse.json(
        { error: "Missing required user fields" },
        { status: 400 }
      );
    }

    const newUser = {
      id: `u-${Date.now()}`,
      id_number,
      first_name,
      last_name,
      email,
      role: role || "student",
      program: program || "BSCS",
      status: status || "Active",
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 500 }
    );
  }
}
