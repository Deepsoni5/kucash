"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "./admin-auth";
import { revalidatePath } from "next/cache";

export async function updateContactStatus(id: string, status: string) {
  try {
    // Ensure user is admin
    await requireAdminAuth();

    // Validate status
    const validStatuses = ["new", "in_progress", "resolved"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("contact_submissions")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating contact status:", error);
      return { success: false, error: "Failed to update status" };
    }

    // Revalidate the admin pages to show updated data
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/contacts");

    return { success: true };
  } catch (error) {
    console.error("Error in updateContactStatus:", error);
    return { success: false, error: "An error occurred while updating status" };
  }
}

export async function getContactSubmissions() {
  try {
    await requireAdminAuth();

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching contact submissions:", error);
      return { success: false, error: "Failed to fetch submissions" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getContactSubmissions:", error);
    return {
      success: false,
      error: "An error occurred while fetching submissions",
    };
  }
}

export async function deleteContactSubmission(id: string) {
  try {
    await requireAdminAuth();

    const supabase = await createClient();

    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting contact submission:", error);
      return { success: false, error: "Failed to delete submission" };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/contacts");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteContactSubmission:", error);
    return {
      success: false,
      error: "An error occurred while deleting submission",
    };
  }
}
