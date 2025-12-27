"use server";

import { createClient } from "@/lib/supabase/server";

export interface CommissionData {
  loan_id: string;
  full_name: string;
  email: string;
  phone: string;
  loan_amount: number;
  agent_commission: number;
  status: string;
  created_at: string;
  processed_at: string | null;
  loan_type: string;
  monthly_income: number;
}

export interface CommissionStats {
  totalEarned: number;
  pendingCommission: number;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  monthlyEarnings: Array<{
    month: string;
    earned: number;
    pending: number;
  }>;
}

export async function getAgentCommissionData(
  agentId: string,
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  }
) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("loan_applications")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false });

    // Apply filters
    if (filters?.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    if (filters?.dateFrom) {
      query = query.gte("created_at", filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte("created_at", filters.dateTo);
    }

    if (filters?.searchTerm) {
      query = query.or(
        `full_name.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%,loan_id.ilike.%${filters.searchTerm}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching commission data:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as CommissionData[] };
  } catch (error) {
    console.error("Error in getAgentCommissionData:", error);
    return { success: false, error: "Failed to fetch commission data" };
  }
}

export async function getAgentCommissionStats(agentId: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("agent_id", agentId);

    if (error) {
      console.error("Error fetching commission stats:", error);
      return { success: false, error: error.message };
    }

    const applications = data as CommissionData[];

    // Calculate stats
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(
      (app) => app.status === "approved" || app.status === "disbursed"
    ).length;
    const rejectedApplications = applications.filter(
      (app) => app.status === "rejected"
    ).length;
    const pendingApplications = applications.filter(
      (app) => app.status === "pending" || app.status === "under_review"
    ).length;

    const totalEarned = applications
      .filter((app) => app.status === "approved" || app.status === "disbursed")
      .reduce(
        (sum, app) => sum + parseFloat(app.agent_commission?.toString() || "0"),
        0
      );

    const pendingCommission = applications
      .filter(
        (app) => app.status === "pending" || app.status === "under_review"
      )
      .reduce(
        (sum, app) => sum + parseFloat(app.agent_commission?.toString() || "0"),
        0
      );

    // Calculate monthly earnings for the last 6 months
    const monthlyEarnings = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const monthApplications = applications.filter((app) => {
        const appDate = new Date(app.created_at);
        return appDate >= monthStart && appDate <= monthEnd;
      });

      const earned = monthApplications
        .filter(
          (app) => app.status === "approved" || app.status === "disbursed"
        )
        .reduce(
          (sum, app) =>
            sum + parseFloat(app.agent_commission?.toString() || "0"),
          0
        );

      const pending = monthApplications
        .filter(
          (app) => app.status === "pending" || app.status === "under_review"
        )
        .reduce(
          (sum, app) =>
            sum + parseFloat(app.agent_commission?.toString() || "0"),
          0
        );

      monthlyEarnings.push({
        month: monthDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        earned,
        pending,
      });
    }

    const stats: CommissionStats = {
      totalEarned,
      pendingCommission,
      totalApplications,
      approvedApplications,
      rejectedApplications,
      pendingApplications,
      monthlyEarnings,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error in getAgentCommissionStats:", error);
    return { success: false, error: "Failed to fetch commission stats" };
  }
}
