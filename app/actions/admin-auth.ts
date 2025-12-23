"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function adminLogin(email: string, password: string) {
  try {
    const supabase = await createClient();

    // First, verify the user exists and get their data
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, password_hash, role, full_name, is_active")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return { success: false, error: "Invalid credentials" };
    }

    // Check if user is active
    if (!user.is_active) {
      return { success: false, error: "Account is deactivated" };
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      return {
        success: false,
        error: "Access denied. Admin privileges required.",
      };
    }

    // Verify password using the database function
    const { data: passwordValid, error: passwordError } = await supabase.rpc(
      "verify_password",
      {
        password: password,
        hash: user.password_hash,
      }
    );

    if (passwordError || !passwordValid) {
      return { success: false, error: "Invalid credentials" };
    }

    // Create session cookie
    const cookieStore = await cookies();
    cookieStore.set(
      "admin_session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        loginTime: new Date().toISOString(),
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      }
    );

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
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
