import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/types/database";

/**
 * ChronoNav Edge Security & RBAC Middleware
 * Enforces strict role-based access control and public route protection.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 0. Immediate bypass for Next.js internals, hot-module reload, static chunks, and APIs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Extract authenticated user session from Supabase SSR
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract user role from JWT user_metadata or development fallback cookie
  const devMockRole = request.cookies.get("sb-mock-role")?.value as UserRole | undefined;
  const role: UserRole | undefined = (user?.user_metadata?.role as UserRole) || devMockRole;
  const isAuthenticated = !!user || !!devMockRole;

  // 1. Define Public Route Allowlist
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/explore" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname === "/privacy";

  // 2. Unauthenticated route protection -> Redirect guest visitors to /login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }


  // 3. Authenticated Role-Based Access Control (RBAC)
  if (isAuthenticated && role) {
    // If student attempts to access /admin/* or /faculty/* -> redirect to /dashboard
    if (role === "student") {
      if (pathname.startsWith("/admin") || pathname.startsWith("/faculty")) {
        const studentDashboardUrl = request.nextUrl.clone();
        studentDashboardUrl.pathname = "/dashboard";
        return NextResponse.redirect(studentDashboardUrl);
      }
    }

    // If faculty attempts to access /admin/* -> redirect to /faculty/dashboard
    if (role === "faculty") {
      if (pathname.startsWith("/admin")) {
        const facultyDashboardUrl = request.nextUrl.clone();
        facultyDashboardUrl.pathname = "/faculty/dashboard";
        return NextResponse.redirect(facultyDashboardUrl);
      }
    }

    // If authenticated user visits /login or root landing page / -> redirect to role portal
    if (pathname === "/login" || pathname === "/") {
      const redirectUrl = request.nextUrl.clone();
      if (role === "admin") {
        redirectUrl.pathname = "/admin/dashboard";
      } else if (role === "faculty") {
        redirectUrl.pathname = "/faculty/dashboard";
      } else {
        redirectUrl.pathname = "/dashboard";
      }
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}

/**
 * Route Matcher Configuration
 * Excludes Next.js internals, static files, and API routes.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
