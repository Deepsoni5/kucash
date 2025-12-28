"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "./admin-auth";
import { revalidatePath } from "next/cache";

export async function createUser(userData: {
  full_name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "agent" | "moderator";
}) {
  try {
    await requireAdminAuth();

    // Validate input
    if (!userData.full_name || !userData.email || !userData.password) {
      return { success: false, error: "All fields are required" };
    }

    if (userData.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    const supabase = await createClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", userData.email)
      .single();

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password using database function
    const { data: hashedPassword, error: hashError } = await supabase.rpc(
      "hash_password",
      { password: userData.password }
    );

    if (hashError) {
      console.error("Error hashing password:", hashError);
      return { success: false, error: "Failed to process password" };
    }

    // Create user
    const { data, error } = await supabase
      .from("users")
      .insert({
        full_name: userData.full_name,
        email: userData.email,
        password_hash: hashedPassword,
        role: userData.role,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return { success: false, error: "Failed to create user" };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");

    return { success: true, data };
  } catch (error) {
    console.error("Error in createUser:", error);
    return { success: false, error: "An error occurred while creating user" };
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await requireAdminAuth();

    const validRoles = ["admin", "user", "agent", "moderator"];
    if (!validRoles.includes(role)) {
      return { success: false, error: "Invalid role" };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ role })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user role:", error);
      return { success: false, error: "Failed to update role" };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return { success: false, error: "An error occurred while updating role" };
  }
}

export async function updateUserStatus(userId: string, isActive: boolean) {
  try {
    await requireAdminAuth();

    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ is_active: isActive })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user status:", error);
      return { success: false, error: "Failed to update status" };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return { success: false, error: "An error occurred while updating status" };
  }
}

export async function updateUserDetails(
  userId: string,
  userData: {
    full_name: string;
    email: string;
  }
) {
  try {
    await requireAdminAuth();

    if (!userData.full_name || !userData.email) {
      return { success: false, error: "Name and email are required" };
    }

    const supabase = await createClient();

    // Check if email is already taken by another user
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", userData.email)
      .neq("id", userId)
      .single();

    if (existingUser) {
      return {
        success: false,
        error: "Email is already taken by another user",
      };
    }

    const { error } = await supabase
      .from("users")
      .update({
        full_name: userData.full_name,
        email: userData.email,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user details:", error);
      return { success: false, error: "Failed to update user details" };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in updateUserDetails:", error);
    return { success: false, error: "An error occurred while updating user" };
  }
}

export async function deleteUser(userId: string) {
  try {
    await requireAdminAuth();

    const supabase = await createClient();

    // Prevent deleting the current admin user
    const currentSession = await requireAdminAuth();
    if (currentSession.id === userId) {
      return { success: false, error: "Cannot delete your own account" };
    }

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: "Failed to delete user" };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return { success: false, error: "An error occurred while deleting user" };
  }
}

export async function resetUserPassword(userId: string, newPassword: string) {
  try {
    await requireAdminAuth();

    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      };
    }

    const supabase = await createClient();

    // Hash password using database function
    const { data: hashedPassword, error: hashError } = await supabase.rpc(
      "hash_password",
      { password: newPassword }
    );

    if (hashError) {
      console.error("Error hashing password:", hashError);
      return { success: false, error: "Failed to process password" };
    }

    const { error } = await supabase
      .from("users")
      .update({ password_hash: hashedPassword })
      .eq("id", userId);

    if (error) {
      console.error("Error resetting password:", error);
      return { success: false, error: "Failed to reset password" };
    }

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error in resetUserPassword:", error);
    return {
      success: false,
      error: "An error occurred while resetting password",
    };
  }
}
