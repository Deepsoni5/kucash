"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
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

  // Cache to prevent unnecessary database calls
  const userCacheRef = useRef<{
    userId: string | null;
    profile: UserProfile | null;
    timestamp: number;
  }>({
    userId: null,
    profile: null,
    timestamp: 0,
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const fetchUserProfile = async (authUser: User, forceRefresh = false) => {
    // Check cache first (unless force refresh)
    const now = Date.now();
    const cache = userCacheRef.current;

    if (
      !forceRefresh &&
      cache.userId === authUser.id &&
      cache.profile &&
      now - cache.timestamp < CACHE_DURATION
    ) {
      console.log("✅ AUTH CONTEXT: Using cached profile");
      setUser(cache.profile);
      setLoading(false);
      return;
    }

    try {
      const startTime = Date.now();

      // Create timeout promise that rejects after 8 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Database query timeout"));
        }, 3500);
      });

      // Create the database query promise
      const queryPromise = supabase
        .from("users")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      // Race between query and timeout
      const { data: userProfile, error } = (await Promise.race([
        queryPromise,
        timeoutPromise,
      ])) as any;

      const queryTime = Date.now() - startTime;

      if (queryTime > 2000) {
        console.log(`⚠️ AUTH CONTEXT: Slow query (${queryTime}ms)`);
      }

      if (error) {
        console.error("❌ AUTH CONTEXT: Database error:", error);
        // Clear cache on actual error
        userCacheRef.current = { userId: null, profile: null, timestamp: 0 };
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

        // Update cache
        userCacheRef.current = {
          userId: authUser.id,
          profile: user,
          timestamp: now,
        };

        setUser(user);
      } else {
        console.log("❌ AUTH CONTEXT: No profile found");
        userCacheRef.current = { userId: null, profile: null, timestamp: 0 };
        setUser(null);
      }
    } catch (error: any) {
      // Handle timeout errors gracefully
      if (error.message?.includes("timeout")) {
        console.error("❌ AUTH CONTEXT: Query timeout - using fallback");
        // Use cached data if available, otherwise set to null
        const cache = userCacheRef.current;
        if (cache.profile && cache.userId === authUser.id) {
          console.log("✅ AUTH CONTEXT: Using cached profile after timeout");
          setUser(cache.profile);
        } else {
          console.log("❌ AUTH CONTEXT: No cache available after timeout");
          setUser(null);
        }
      } else {
        console.error("❌ AUTH CONTEXT: Query failed:", error);
        // Clear cache on other errors
        userCacheRef.current = { userId: null, profile: null, timestamp: 0 };
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await fetchUserProfile(session.user, true); // Force refresh
      } else {
        userCacheRef.current = { userId: null, profile: null, timestamp: 0 };
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ AUTH CONTEXT: Refresh failed:", error);
      userCacheRef.current = { userId: null, profile: null, timestamp: 0 };
      setUser(null);
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Clear cache on sign out
    userCacheRef.current = { userId: null, profile: null, timestamp: 0 };
    setUser(null);
  };

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
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
    } = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Only fetch if it's a different user or cache is empty
        const cache = userCacheRef.current;
        if (cache.userId !== session.user.id || !cache.profile) {
          await fetchUserProfile(session.user);
        } else {
          console.log("✅ AUTH CONTEXT: Same user, using cache");
          setUser(cache.profile);
          setLoading(false);
        }
      } else if (event === "SIGNED_OUT") {
        userCacheRef.current = { userId: null, profile: null, timestamp: 0 };
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
