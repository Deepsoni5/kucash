import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Handle admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to admin login page
    if (request.nextUrl.pathname === "/admin/login") {
      return await updateSession(request);
    }

    // Check for admin session on protected admin routes
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      // Redirect to admin login if no session
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    try {
      const session = JSON.parse(adminSession.value);

      // Check if session is expired (7 days)
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const daysDiff =
        (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff > 7 || session.role !== "admin") {
        // Session expired or not admin, redirect to login
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        const response = NextResponse.redirect(url);
        response.cookies.delete("admin_session");
        return response;
      }
    } catch (error) {
      // Invalid session, redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("admin_session");
      return response;
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
