"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/auth-context";

interface AuthRedirectHandlerProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthRedirectHandler({
  children,
  redirectTo = "/",
}: AuthRedirectHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [isHandlingAuth, setIsHandlingAuth] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      const type = searchParams.get("type");
      const verified = searchParams.get("verified");

      console.log("🔍 AUTH REDIRECT: URL params:", {
        code: code ? "present" : "none",
        error,
        type,
        verified,
        pathname: window.location.pathname,
      });

      // Show success message if user was just verified via callback
      if (verified === "true") {
        console.log("✅ AUTH REDIRECT: User verified via callback");

        // Clear the verified parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("verified");
        window.history.replaceState({}, "", url.toString());

        // Refresh auth context and force UI update
        await refreshUser();

        // Force another refresh after delay to ensure navbar updates
        setTimeout(async () => {
          await refreshUser();
        }, 500);

        return;
      }

      // Handle auth errors
      if (error) {
        console.error("❌ AUTH REDIRECT: Auth error:", error, errorDescription);
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("error");
        url.searchParams.delete("error_description");
        url.searchParams.delete("type");
        window.history.replaceState({}, "", url.toString());
        return;
      }

      // Handle auth code (for direct code processing, not via callback)
      if (code && !isHandlingAuth) {
        setIsHandlingAuth(true);
        console.log("🔍 AUTH REDIRECT: Processing auth code directly...", {
          type,
        });

        try {
          // For password reset, don't exchange the code here
          if (window.location.pathname.includes("/reset-password")) {
            console.log(
              "🔍 AUTH REDIRECT: On reset password page, skipping code exchange"
            );
            setIsHandlingAuth(false);
            return;
          }

          // For email verification, exchange the code
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          console.log("🔍 AUTH REDIRECT: Exchange result:", {
            hasSession: !!data.session,
            hasUser: !!data.user,
            error: exchangeError?.message,
          });

          if (exchangeError) {
            console.error(
              "❌ AUTH REDIRECT: Code exchange failed:",
              exchangeError
            );
          } else if (data.session) {
            console.log("✅ AUTH REDIRECT: Code exchange successful");

            // Clear URL parameters
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            url.searchParams.delete("type");
            window.history.replaceState({}, "", url.toString());

            // Refresh auth context multiple times to ensure UI updates
            await refreshUser();

            setTimeout(async () => {
              await refreshUser();
              console.log("🔄 AUTH REDIRECT: Second refresh completed");
            }, 500);

            setTimeout(async () => {
              await refreshUser();
              console.log("🔄 AUTH REDIRECT: Third refresh completed");
            }, 1500);
          }
        } catch (error) {
          console.error("❌ AUTH REDIRECT: Unexpected error:", error);
        } finally {
          setIsHandlingAuth(false);
        }
      }
    };

    // Only run if we have search params
    if (searchParams.toString()) {
      handleAuthRedirect();
    }
  }, [
    searchParams,
    router,
    redirectTo,
    refreshUser,
    isHandlingAuth,
    supabase.auth,
  ]);

  return <>{children}</>;
}
