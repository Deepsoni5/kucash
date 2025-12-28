"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(email: string, password: string) {
  console.log("Admin login attempt:", { email, password: "***" });

  try {
    // Hardcoded admin credentials check
    const ADMIN_EMAIL = "admin_kucash@gmail.com";
    const ADMIN_PASSWORD = "Demopass@12";

    console.log("Checking credentials against:", {
      ADMIN_EMAIL,
      ADMIN_PASSWORD: "***",
    });

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log("Credentials mismatch");
      return { success: false, error: "Invalid credentials" };
    }

    console.log("Credentials match, creating session...");

    // Create session cookie
    const cookieStore = await cookies();
    cookieStore.set(
      "admin_session",
      JSON.stringify({
        id: "admin-001",
        email: ADMIN_EMAIL,
        role: "admin",
        full_name: "Admin User",
        loginTime: new Date().toISOString(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }
    );

    console.log("Session created successfully");

    return {
      success: true,
      user: {
        id: "admin-001",
        email: ADMIN_EMAIL,
        role: "admin",
        full_name: "Admin User",
      },
    };
  } catch (error) {
    console.error("Admin login error:", error);
    return { success: false, error: "An error occurred during login" };
  }
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin_session");

    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);

    // Check if session is expired (7 days)
    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const daysDiff =
      (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      // Session expired
      cookieStore.delete("admin_session");
      return null;
    }

    return session;
  } catch (error) {
    console.error("Error getting admin session:", error);
    return null;
  }
}

export async function requireAdminAuth() {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return session;
}
