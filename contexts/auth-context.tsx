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
    console.log("🔍 AUTH CONTEXT: Auth user details:", {
      id: authUser.id,
      email: authUser.email,
      metadata: authUser.user_metadata,
      emailConfirmed: authUser.email_confirmed_at,
    });

    try {
      // Add detailed logging for the database query
      console.log("🔍 AUTH CONTEXT: Starting database query...");

      const startTime = Date.now();
      const { data: userProfile, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      const queryTime = Date.now() - startTime;
      console.log(
        `🔍 AUTH CONTEXT: Database query completed in ${queryTime}ms`
      );

      console.log("🔍 AUTH CONTEXT: Database response:", {
        hasData: !!userProfile,
        error: error?.message,
        errorCode: error?.code,
        errorDetails: error?.details,
        errorHint: error?.hint,
        data: userProfile
          ? {
              id: userProfile.id,
              user_id: userProfile.user_id,
              email: userProfile.email,
              full_name: userProfile.full_name,
            }
          : null,
      });

      if (error) {
        console.error("❌ AUTH CONTEXT: Database error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });

        // Check if it's a connection or permission error
        if (
          error.code === "PGRST301" ||
          error.message?.includes("permission")
        ) {
          console.error(
            "❌ AUTH CONTEXT: Permission denied - check RLS policies"
          );
        } else if (error.code === "PGRST116") {
          console.log("ℹ️ AUTH CONTEXT: User profile not found in database");
        }

        setUser(null);
        setLoading(false);
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
        console.log("✅ AUTH CONTEXT: Successfully set user from database:", {
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        });
        setUser(user);
      } else {
        console.log("❌ AUTH CONTEXT: No user profile data returned");
        setUser(null);
      }
    } catch (error) {
      console.error(
        "❌ AUTH CONTEXT: Unexpected error during profile fetch:",
        error
      );
      setUser(null);
    } finally {
      console.log("🔍 AUTH CONTEXT: Setting loading to false");
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    console.log("🔍 AUTH CONTEXT: Refreshing user...");
    setLoading(true);

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      console.log("🔍 AUTH CONTEXT: Session refresh result:", {
        hasSession: !!session,
        hasUser: !!session?.user,
        error: error?.message,
      });

      if (error) {
        console.error("❌ AUTH CONTEXT: Session error:", error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        console.log("❌ AUTH CONTEXT: No session found during refresh");
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ AUTH CONTEXT: Refresh error:", error);
      setUser(null);
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log("🔍 AUTH CONTEXT: Signing out...");
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      console.log("🔍 AUTH CONTEXT: Getting initial session...");

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("🔍 AUTH CONTEXT: Initial session result:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          error: error?.message,
        });

        if (error) {
          console.error("❌ AUTH CONTEXT: Initial session error:", error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log(
            "✅ AUTH CONTEXT: Found initial session, fetching profile..."
          );
          await fetchUserProfile(session.user);
        } else {
          console.log("❌ AUTH CONTEXT: No initial session found");
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "❌ AUTH CONTEXT: Initial session unexpected error:",
          error
        );
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔍 AUTH CONTEXT: Auth state changed:", event, {
        hasSession: !!session,
        hasUser: !!session?.user,
      });

      if (event === "SIGNED_IN" && session?.user) {
        console.log("✅ AUTH CONTEXT: User signed in, fetching profile...");
        await fetchUserProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        console.log("🔍 AUTH CONTEXT: User signed out");
        setUser(null);
        setLoading(false);
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        console.log("🔄 AUTH CONTEXT: Token refreshed, updating profile...");
        await fetchUserProfile(session.user);
      }
    });

    return () => {
      console.log("🔍 AUTH CONTEXT: Cleaning up subscription");
      subscription.unsubscribe();
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
