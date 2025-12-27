"use server";

import { createClient } from "@/lib/supabase/server";

export interface AgentStats {
  totalCustomers: number;
  applicationsThisMonth: number;
  pendingApplications: number;
  commissionEarned: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalApplications: number;
  approvalRate: number;
  pendingCommission: number;
  lostCommission: number;
}

export interface RecentApplication {
  id: string;
  loan_id: string;
  full_name: string;
  loan_amount: string;
  tenure: number;
  status: string;
  created_at: string;
  phone: string;
  user_id: string;
}

export interface MonthlyPerformance {
  month: string;
  applications: number;
  approved: number;
  commission: number;
}

export async function getAgentStats(agentId: string): Promise<AgentStats> {
  try {
    const supabase = await createClient();

    // Get current month start and end dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all applications for this agent
    const { data: allApplications, error: allError } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("agent_id", agentId);

    if (allError) {
      console.error("Error fetching all applications:", allError);
      throw allError;
    }

    // Get applications for current month
    const { data: monthlyApplications, error: monthlyError } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("agent_id", agentId)
      .gte("created_at", currentMonthStart.toISOString())
      .lte("created_at", currentMonthEnd.toISOString());

    if (monthlyError) {
      console.error("Error fetching monthly applications:", monthlyError);
      throw monthlyError;
    }

    // Calculate stats
    const totalApplications = allApplications?.length || 0;
    const applicationsThisMonth = monthlyApplications?.length || 0;
    const pendingApplications =
      allApplications?.filter((app) => app.status === "pending").length || 0;
    const approvedApplications =
      allApplications?.filter((app) => app.status === "approved").length || 0;
    const rejectedApplications =
      allApplications?.filter((app) => app.status === "rejected").length || 0;

    // Calculate total commission earned from approved applications
    const commissionEarned =
      allApplications
        ?.filter((app) => app.status === "approved")
        .reduce(
          (total, app) => total + (parseFloat(app.agent_commission) || 0),
          0
        ) || 0;

    // Calculate pending commission from pending applications
    const pendingCommission =
      allApplications
        ?.filter(
          (app) => app.status === "pending" || app.status === "under_review"
        )
        .reduce(
          (total, app) => total + (parseFloat(app.agent_commission) || 0),
          0
        ) || 0;

    // Calculate lost commission from rejected applications
    const lostCommission =
      allApplications
        ?.filter((app) => app.status === "rejected")
        .reduce(
          (total, app) => total + (parseFloat(app.agent_commission) || 0),
          0
        ) || 0;

    // Calculate approval rate
    const approvalRate =
      totalApplications > 0
        ? Math.round((approvedApplications / totalApplications) * 100)
        : 0;

    // Get unique customers count
    const uniqueCustomers = new Set(allApplications?.map((app) => app.user_id))
      .size;

    return {
      totalCustomers: uniqueCustomers,
      applicationsThisMonth,
      pendingApplications,
      commissionEarned,
      approvedApplications,
      rejectedApplications,
      totalApplications,
      approvalRate,
      pendingCommission,
      lostCommission,
    };
  } catch (error) {
    console.error("Error getting agent stats:", error);
    // Return default stats on error
    return {
      totalCustomers: 0,
      applicationsThisMonth: 0,
      pendingApplications: 0,
      commissionEarned: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
      totalApplications: 0,
      approvalRate: 0,
      pendingCommission: 0,
      lostCommission: 0,
    };
  }
}

export async function getRecentApplications(
  agentId: string,
  limit: number = 4
): Promise<RecentApplication[]> {
  try {
    const supabase = await createClient();

    const { data: applications, error } = await supabase
      .from("loan_applications")
      .select(
        "id, loan_id, full_name, loan_amount, tenure, status, created_at, phone, user_id"
      )
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent applications:", error);
      return [];
    }

    return (
      applications?.map((app) => ({
        id: app.id,
        loan_id: app.loan_id,
        full_name: app.full_name,
        loan_amount: `₹${parseInt(app.loan_amount).toLocaleString("en-IN")}`,
        tenure: app.tenure,
        status: app.status,
        created_at: app.created_at,
        phone: app.phone,
        user_id: app.user_id,
      })) || []
    );
  } catch (error) {
    console.error("Error getting recent applications:", error);
    return [];
  }
}

export async function getMonthlyPerformance(
  agentId: string
): Promise<MonthlyPerformance[]> {
  try {
    const supabase = await createClient();

    // Get applications from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: applications, error } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("agent_id", agentId)
      .gte("created_at", sixMonthsAgo.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching monthly performance:", error);
      return [];
    }

    // Group by month
    const monthlyData: { [key: string]: MonthlyPerformance } = {};

    // Initialize last 6 months
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = months[date.getMonth()];

      monthlyData[monthKey] = {
        month: monthName,
        applications: 0,
        approved: 0,
        commission: 0,
      };
    }

    // Process applications
    applications?.forEach((app) => {
      const date = new Date(app.created_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].applications++;

        if (app.status === "approved") {
          monthlyData[monthKey].approved++;
          monthlyData[monthKey].commission +=
            parseFloat(app.agent_commission) || 0;
        }
      }
    });

    return Object.values(monthlyData);
  } catch (error) {
    console.error("Error getting monthly performance:", error);
    return [];
  }
}
export async function getLoanDetails(loanId: string, agentId: string) {
  try {
    const supabase = await createClient();

    const { data: loan, error } = await supabase
      .from("loan_applications")
      .select("*")
      .eq("id", loanId)
      .eq("agent_id", agentId)
      .single();

    if (error) {
      console.error("Error fetching loan details:", error);
      return null;
    }

    return loan;
  } catch (error) {
    console.error("Error getting loan details:", error);
    return null;
  }
}

export async function getCustomerDetails(userId: string) {
  try {
    const supabase = await createClient();

    const { data: customer, error } = await supabase
      .from("users")
      .select(
        "id, full_name, email, role, mobile_number, is_active, created_at, postal_address, phone_gpay_number"
      )
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching customer details:", error);
      return null;
    }

    return customer;
  } catch (error) {
    console.error("Error getting customer details:", error);
    return null;
  }
}

export interface LoanTypeData {
  type: string;
  count: number;
  amount: number;
  commission: number;
}

export interface ActivityData {
  date: string;
  applications: number;
  calls: number;
  meetings: number;
}

export async function getLoanTypeDistribution(
  agentId: string
): Promise<LoanTypeData[]> {
  try {
    const supabase = await createClient();

    const { data: applications, error } = await supabase
      .from("loan_applications")
      .select("loan_type, loan_amount, agent_commission, status")
      .eq("agent_id", agentId);

    if (error) {
      console.error("Error fetching loan type data:", error);
      return [];
    }

    // Group by loan type
    const typeMap: { [key: string]: LoanTypeData } = {};

    applications?.forEach((app) => {
      const type = app.loan_type || "other";
      const capitalizedType =
        type.charAt(0).toUpperCase() + type.slice(1).replace(/[-_]/g, " ");

      if (!typeMap[capitalizedType]) {
        typeMap[capitalizedType] = {
          type: capitalizedType,
          count: 0,
          amount: 0,
          commission: 0,
        };
      }

      typeMap[capitalizedType].count++;
      typeMap[capitalizedType].amount += parseFloat(app.loan_amount || "0");

      // Only count commission for approved applications
      if (app.status === "approved" || app.status === "disbursed") {
        typeMap[capitalizedType].commission += parseFloat(
          app.agent_commission || "0"
        );
      }
    });

    return Object.values(typeMap).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error getting loan type distribution:", error);
    return [];
  }
}

export async function getWeeklyActivity(
  agentId: string
): Promise<ActivityData[]> {
  try {
    const supabase = await createClient();

    // Get applications from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: applications, error } = await supabase
      .from("loan_applications")
      .select("created_at")
      .eq("agent_id", agentId)
      .gte("created_at", sevenDaysAgo.toISOString());

    if (error) {
      console.error("Error fetching weekly activity:", error);
      return [];
    }

    // Generate data for last 7 days
    const activityData: ActivityData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split("T")[0];

      // Count applications for this date
      const dayApplications =
        applications?.filter((app) => {
          const appDate = new Date(app.created_at).toISOString().split("T")[0];
          return appDate === dateString;
        }).length || 0;

      activityData.push({
        date: dateString,
        applications: dayApplications,
        calls: Math.floor(Math.random() * (dayApplications * 2 + 1)), // Estimated calls based on applications
        meetings: Math.floor(dayApplications / 2), // Estimated meetings
      });
    }

    return activityData;
  } catch (error) {
    console.error("Error getting weekly activity:", error);
    return [];
  }
}
