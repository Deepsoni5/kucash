import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  console.log("🔍 AUTH CALLBACK: Processing callback", {
    code: code ? "present" : "none",
    next,
    origin,
  });

  if (code) {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      console.log("🔍 AUTH CALLBACK: Exchange result", {
        hasSession: !!data.session,
        hasUser: !!data.user,
        error: error?.message,
      });

      if (!error && data.session) {
        console.log("✅ AUTH CALLBACK: Session established successfully");

        // Redirect to the intended page or home
        const redirectUrl = new URL(next, origin);

        // Add a success parameter to show a toast
        redirectUrl.searchParams.set("verified", "true");

        return NextResponse.redirect(redirectUrl);
      } else {
        console.error("❌ AUTH CALLBACK: Session exchange failed:", error);

        // Redirect to error page or login with error
        const errorUrl = new URL("/login", origin);
        errorUrl.searchParams.set("error", "verification_failed");

        return NextResponse.redirect(errorUrl);
      }
    } catch (error) {
      console.error("❌ AUTH CALLBACK: Unexpected error:", error);

      const errorUrl = new URL("/login", origin);
      errorUrl.searchParams.set("error", "callback_error");

      return NextResponse.redirect(errorUrl);
    }
  }

  // No code provided, redirect to home
  console.log("❌ AUTH CALLBACK: No code provided");
  return NextResponse.redirect(new URL("/", origin));
}
