"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminAuth } from "./admin-auth";
import { revalidatePath } from "next/cache";

export async function updateLoanStatus(
  loanId: string,
  status: "pending" | "approved" | "rejected",
  notes?: string
) {
  try {
    await requireAdminAuth();

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const supabase = await createClient();

    // Get current admin user for processed_by field
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Add processing information if status is being changed from pending
    if (status !== "pending") {
      updateData.processed_by = user?.id;
      updateData.processed_at = new Date().toISOString();

      if (status === "approved" && notes) {
        updateData.approval_notes = notes;
      } else if (status === "rejected" && notes) {
        updateData.rejection_reason = notes;
      }
    }

    const { error } = await supabase
      .from("loan_applications")
      .update(updateData)
      .eq("id", loanId);

    if (error) {
      console.error("Error updating loan status:", error);
      return { success: false, error: "Failed to update loan status" };
    }

    revalidatePath("/admin/loans");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error in updateLoanStatus:", error);
    return {
      success: false,
      error: "An error occurred while updating loan status",
    };
  }
}

export async function updateLoanDetails(
  loanId: string,
  details: {
    approved_amount?: string;
    approved_tenure?: number;
    interest_rate?: string;
    processing_fee?: string;
  }
) {
  try {
    await requireAdminAuth();

    const supabase = await createClient();

    const { error } = await supabase
      .from("loan_applications")
      .update({
        ...details,
        updated_at: new Date().toISOString(),
      })
      .eq("id", loanId);

    if (error) {
      console.error("Error updating loan details:", error);
      return { success: false, error: "Failed to update loan details" };
    }

    revalidatePath("/admin/loans");

    return { success: true };
  } catch (error) {
    console.error("Error in updateLoanDetails:", error);
    return {
      success: false,
      error: "An error occurred while updating loan details",
    };
  }
}
