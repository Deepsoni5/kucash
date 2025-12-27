import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
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

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to admin login page
    if (request.nextUrl.pathname === "/admin/login") {
      return supabaseResponse;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!userProfile || userProfile.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Protect agent routes
  if (request.nextUrl.pathname.startsWith("/agent")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!userProfile || userProfile.role !== "agent") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect customer routes
  if (request.nextUrl.pathname.startsWith("/customer")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!userProfile || userProfile.role !== "user") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup")
  ) {
    // Get user profile to redirect to appropriate dashboard
    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (userProfile) {
      if (userProfile.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (userProfile.role === "agent") {
        return NextResponse.redirect(new URL("/agent/dashboard", request.url));
      } else {
        return NextResponse.redirect(
          new URL("/customer/dashboard", request.url)
        );
      }
    }
  }

  return supabaseResponse;
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
