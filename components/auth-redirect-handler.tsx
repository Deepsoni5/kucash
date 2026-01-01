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

      // Handle auth errors
      if (error) {
        console.error("❌ AUTH REDIRECT: Auth error:", error, errorDescription);
        // Clear URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("error");
        url.searchParams.delete("error_description");
        window.history.replaceState({}, "", url.toString());
        return;
      }

      // Handle auth code
      if (code && !isHandlingAuth) {
        setIsHandlingAuth(true);
        console.log("🔍 AUTH REDIRECT: Processing auth code...");

        try {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error(
              "❌ AUTH REDIRECT: Code exchange failed:",
              exchangeError
            );
          } else if (data.session) {
            console.log("✅ AUTH REDIRECT: Code exchange successful");

            // Refresh the auth context
            await refreshUser();

            // Clear the code from URL
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            window.history.replaceState({}, "", url.toString());

            // Don't redirect if we're already on the reset password page
            if (!window.location.pathname.includes("/reset-password")) {
              // Small delay to ensure auth context is updated
              setTimeout(() => {
                router.push(redirectTo);
              }, 100);
            }
          }
        } catch (error) {
          console.error("❌ AUTH REDIRECT: Unexpected error:", error);
        } finally {
          setIsHandlingAuth(false);
        }
      }
    };

    handleAuthRedirect();
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
