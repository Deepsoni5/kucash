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
      console.log("🔍 AUTH CONTEXT: Starting database query...");

      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Database query timeout"));
        }, 5000); // 5 second timeout
      });

      // Create query promise
      const queryPromise = supabase
        .from("users")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      const startTime = Date.now();
      const { data: userProfile, error } = (await Promise.race([
        queryPromise,
        timeoutPromise,
      ])) as any;
      const queryTime = Date.now() - startTime;

      console.log(`✅ AUTH CONTEXT: Query completed in ${queryTime}ms`);

      if (error) {
        console.error("❌ AUTH CONTEXT: Database error:", error);
        setUser(null);
      } else if (userProfile) {
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
        console.log("✅ AUTH CONTEXT: User set successfully:", user.fullName);
        setUser(user);
      } else {
        console.log("❌ AUTH CONTEXT: No profile found");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ AUTH CONTEXT: Query failed:", error);
      setUser(null);
    } finally {
      console.log("🔍 AUTH CONTEXT: Setting loading false");
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    console.log("🔍 AUTH CONTEXT: Refreshing user...");
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ AUTH CONTEXT: Refresh failed:", error);
      setUser(null);
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      console.log("🔍 AUTH CONTEXT: Getting initial session...");

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("✅ AUTH CONTEXT: Initial session found");
          await fetchUserProfile(session.user);
        } else {
          console.log("❌ AUTH CONTEXT: No initial session");
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ AUTH CONTEXT: Initial session error:", error);
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔍 AUTH CONTEXT: Auth changed:", event, !!session?.user);

      if (event === "SIGNED_IN" && session?.user) {
        await fetchUserProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
