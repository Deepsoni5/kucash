"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
  agentId?: string;
  mobileNumber: string;
  isActive: boolean;
  photoUrl?: string;
  postalAddress?: string;
  phoneGpayNumber?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserProfile = async (authUser: User) => {
    console.log("🔍 AUTH CONTEXT: Fetching user profile for:", authUser.id);
    try {
      const { data: userProfile, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      console.log("🔍 AUTH CONTEXT: Profile fetch result:", {
        hasProfile: !!userProfile,
        error: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details,
      });

      if (error) {
        console.error("❌ AUTH CONTEXT: Profile fetch error details:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        // If it's a "not found" error, create a basic user object from auth data
        if (error.code === "PGRST116" || error.message?.includes("No rows")) {
          console.log(
            "🔄 AUTH CONTEXT: Profile not found, creating basic user from auth data"
          );
          const basicUser = {
            id: authUser.id,
            userId: authUser.id,
            fullName:
              authUser.user_metadata?.full_name ||
              authUser.email?.split("@")[0] ||
              "User",
            email: authUser.email || "",
            role: authUser.user_metadata?.role || "user",
            agentId: authUser.user_metadata?.agent_id || null,
            mobileNumber: authUser.user_metadata?.mobile_number || "",
            isActive: true,
            photoUrl: authUser.user_metadata?.photo_url || null,
            postalAddress: authUser.user_metadata?.postal_address || null,
            phoneGpayNumber: authUser.user_metadata?.phone_gpay_number || null,
          };
          console.log("✅ AUTH CONTEXT: Setting basic user:", basicUser);
          setUser(basicUser);
          return;
        }

        // For other errors, set user to null
        setUser(null);
        return;
      }

      if (userProfile) {
        const user = {
          id: userProfile.id,
          userId: userProfile.user_id,
          fullName: userProfile.full_name,
          email: userProfile.email,
          role: userProfile.role,
          agentId: userProfile.agent_id,
          mobileNumber: userProfile.mobile_number,
          isActive: userProfile.is_active,
          photoUrl: userProfile.photo_url,
          postalAddress: userProfile.postal_address,
          phoneGpayNumber: userProfile.phone_gpay_number,
        };
        console.log("✅ AUTH CONTEXT: Setting user:", {
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        });
        setUser(user);
      } else {
        console.log("❌ AUTH CONTEXT: No profile found, setting user to null");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ AUTH CONTEXT: Profile fetch unexpected error:", error);

      // CRITICAL FIX: Always create a basic user from auth data if profile fetch fails
      console.log(
        "🔄 AUTH CONTEXT: Creating fallback user from auth data due to error"
      );
      const fallbackUser = {
        id: authUser.id,
        userId: authUser.id,
        fullName:
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "User",
        email: authUser.email || "",
        role: authUser.user_metadata?.role || "user",
        agentId: authUser.user_metadata?.agent_id || null,
        mobileNumber: authUser.user_metadata?.mobile_number || "",
        isActive: true,
        photoUrl: authUser.user_metadata?.photo_url || null,
        postalAddress: authUser.user_metadata?.postal_address || null,
        phoneGpayNumber: authUser.user_metadata?.phone_gpay_number || null,
      };
      console.log("✅ AUTH CONTEXT: Setting fallback user:", fallbackUser);
      setUser(fallbackUser);
    }
  };

  const refreshUser = async () => {
    console.log("🔍 AUTH CONTEXT: Refreshing user...");
    try {
      // First try to get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("❌ AUTH CONTEXT: Session error:", sessionError);
        setUser(null);
        return;
      }

      if (session?.user) {
        console.log("🔍 AUTH CONTEXT: Got session user:", session.user.id);
        await fetchUserProfile(session.user);
      } else {
        // Try to refresh the session
        console.log("🔍 AUTH CONTEXT: No session, trying to refresh...");
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();

        if (refreshData.session?.user && !refreshError) {
          console.log("✅ AUTH CONTEXT: Session refreshed successfully");
          await fetchUserProfile(refreshData.session.user);
        } else {
          console.log("❌ AUTH CONTEXT: No valid session found");
          setUser(null);
        }
      }
    } catch (error) {
      console.error("❌ AUTH CONTEXT: Refresh user error:", error);
      setUser(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    // Get initial session and handle auth code exchange
    const getInitialSession = async () => {
      try {
        // First, try to exchange any auth code in the URL
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get("code");

        if (code) {
          console.log(
            "🔍 AUTH CONTEXT: Found auth code, attempting exchange..."
          );
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error("❌ AUTH CONTEXT: Code exchange failed:", error);
            // Clear the code from URL to prevent infinite loops
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            window.history.replaceState({}, "", url.toString());
          } else if (data.session?.user) {
            console.log("✅ AUTH CONTEXT: Code exchange successful");
            await fetchUserProfile(data.session.user);
            setLoading(false);
            return;
          }
        }

        // If no code or code exchange failed, get existing session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("🔍 AUTH CONTEXT: Got session:", !!session);

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          // Try to refresh the session
          console.log("🔍 AUTH CONTEXT: No session, trying to refresh...");
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();

          if (refreshData.session?.user && !refreshError) {
            console.log("✅ AUTH CONTEXT: Session refreshed successfully");
            await fetchUserProfile(refreshData.session.user);
          } else {
            console.log("❌ AUTH CONTEXT: No valid session found");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("❌ AUTH CONTEXT: Session initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔍 AUTH CONTEXT: Auth state changed:", event, !!session);

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          console.log("✅ AUTH CONTEXT: User signed in/refreshed");
          await fetchUserProfile(session.user);
        }
      } else if (event === "SIGNED_OUT") {
        console.log("🔍 AUTH CONTEXT: User signed out");
        setUser(null);
      }

      setLoading(false);
    });

    // Listen for visibility changes to refresh session when user comes back
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log(
          "🔍 AUTH CONTEXT: Tab became visible, refreshing session..."
        );
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user) {
            await fetchUserProfile(session.user);
          }
        } catch (error) {
          console.error("❌ AUTH CONTEXT: Visibility refresh failed:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
