import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const email = searchParams.get("email");
  const userId = searchParams.get("user_id");
  const next = searchParams.get("next") ?? "/";

  console.log("🔍 AUTH CALLBACK: Processing callback", {
    code: code ? "present" : "none",
    type,
    email,
    userId,
    next,
    origin,
  });

  // Handle custom email verification
  if (type === "email_verification" && email && userId) {
    console.log("🔍 AUTH CALLBACK: Processing custom email verification");

    try {
      const supabase = await createClient();

      // Check if service role key is available for admin operations
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (serviceRoleKey) {
        const { createClient: createAdminClient } = await import(
          "@supabase/supabase-js"
        );
        const adminSupabase = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceRoleKey,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          }
        );

        // Manually confirm the user's email
        const { error: confirmError } =
          await adminSupabase.auth.admin.updateUserById(userId, {
            email_confirm: true,
          });

        if (confirmError) {
          console.error(
            "❌ AUTH CALLBACK: Email confirmation failed:",
            confirmError
          );
          const errorUrl = new URL("/login", origin);
          errorUrl.searchParams.set("error", "verification_failed");
          errorUrl.searchParams.set(
            "message",
            "Email verification failed. Please try again."
          );
          return NextResponse.redirect(errorUrl);
        }

        console.log("✅ AUTH CALLBACK: Email verified successfully");

        // Redirect to login with success message
        const successUrl = new URL("/login", origin);
        successUrl.searchParams.set("verified", "true");
        successUrl.searchParams.set(
          "message",
          "Email verified successfully! You can now log in."
        );
        return NextResponse.redirect(successUrl);
      } else {
        console.error("❌ AUTH CALLBACK: SUPABASE_SERVICE_ROLE_KEY not found");
        const errorUrl = new URL("/login", origin);
        errorUrl.searchParams.set("error", "configuration_error");
        return NextResponse.redirect(errorUrl);
      }
    } catch (error) {
      console.error("❌ AUTH CALLBACK: Email verification error:", error);
      const errorUrl = new URL("/login", origin);
      errorUrl.searchParams.set("error", "verification_failed");
      return NextResponse.redirect(errorUrl);
    }
  }

  // Handle standard Supabase auth callback (for password reset, etc.)
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
  console.log("❌ AUTH CALLBACK: No code or verification type provided");
  return NextResponse.redirect(new URL("/", origin));
}
