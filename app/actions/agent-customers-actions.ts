"use server";

import { createClient } from "@/lib/supabase/server";

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  newThisMonth: number;
}

export interface CustomerData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  is_active: boolean;
  created_at: string;
  totalApplications: number;
  approvedLoans: number;
  pendingLoans: number;
  rejectedLoans: number;
  totalLoanAmount: number;
  pendingLoanAmount: number;
  lastActivity: string;
}

export async function getAgentCustomerStats(
  agentId: string
): Promise<CustomerStats> {
  try {
    const supabase = await createClient();

    // Get current month start and end dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all unique customers for this agent
    const { data: applications, error } = await supabase
      .from("loan_applications")
      .select("user_id, created_at")
      .eq("agent_id", agentId);

    if (error) {
      console.error("Error fetching customer stats:", error);
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        newThisMonth: 0,
      };
    }

    // Get unique user IDs
    const uniqueUserIds = [
      ...new Set(applications?.map((app) => app.user_id) || []),
    ];

    if (uniqueUserIds.length === 0) {
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        newThisMonth: 0,
      };
    }

    // Get user details for these customers
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("user_id, is_active, created_at")
      .in("user_id", uniqueUserIds);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return {
        totalCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        newThisMonth: 0,
      };
    }

    const totalCustomers = users?.length || 0;
    const activeCustomers = users?.filter((user) => user.is_active).length || 0;
    const inactiveCustomers = totalCustomers - activeCustomers;
    const newThisMonth =
      users?.filter((user) => new Date(user.created_at) >= currentMonthStart)
        .length || 0;

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      newThisMonth,
    };
  } catch (error) {
    console.error("Error getting customer stats:", error);
    return {
      totalCustomers: 0,
      activeCustomers: 0,
      inactiveCustomers: 0,
      newThisMonth: 0,
    };
  }
}

export async function getAgentCustomers(
  agentId: string,
  searchTerm?: string
): Promise<CustomerData[]> {
  try {
    const supabase = await createClient();

    // First, get all applications for this agent
    const { data: applications, error: appsError } = await supabase
      .from("loan_applications")
      .select("user_id, created_at, status, loan_amount")
      .eq("agent_id", agentId);

    if (appsError) {
      console.error("Error fetching applications:", appsError);
      return [];
    }

    if (!applications || applications.length === 0) {
      return [];
    }

    // Get unique user IDs
    const uniqueUserIds = [...new Set(applications.map((app) => app.user_id))];

    // Get user details for these customers
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select(
        "id, user_id, full_name, email, mobile_number, is_active, created_at"
      )
      .in("user_id", uniqueUserIds);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return [];
    }

    if (!users || users.length === 0) {
      return [];
    }

    // Create a map of users by user_id for quick lookup
    const userMap = new Map(users.map((user) => [user.user_id, user]));

    // Group applications by user_id and calculate stats
    const customerMap = new Map<string, CustomerData>();

    applications.forEach((app: any) => {
      const userId = app.user_id;
      const user = userMap.get(userId);

      if (!user) return; // Skip if user not found

      if (!customerMap.has(userId)) {
        customerMap.set(userId, {
          id: user.id,
          user_id: userId,
          full_name: user.full_name,
          email: user.email,
          mobile_number: user.mobile_number,
          is_active: user.is_active,
          created_at: user.created_at,
          totalApplications: 0,
          approvedLoans: 0,
          pendingLoans: 0,
          rejectedLoans: 0,
          totalLoanAmount: 0,
          pendingLoanAmount: 0,
          lastActivity: app.created_at,
        });
      }

      const customer = customerMap.get(userId)!;
      customer.totalApplications++;

      if (app.status === "approved") {
        customer.approvedLoans++;
        customer.totalLoanAmount += parseFloat(app.loan_amount) || 0;
      } else if (app.status === "pending") {
        customer.pendingLoans++;
        customer.pendingLoanAmount += parseFloat(app.loan_amount) || 0;
      } else if (app.status === "rejected") {
        customer.rejectedLoans++;
      }

      // Update last activity to the most recent application
      if (new Date(app.created_at) > new Date(customer.lastActivity)) {
        customer.lastActivity = app.created_at;
      }
    });

    let customers = Array.from(customerMap.values());

    // Apply search filter if provided
    if (searchTerm && searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase().trim();
      customers = customers.filter(
        (customer) =>
          customer.full_name.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search) ||
          customer.mobile_number.includes(search)
      );
    }

    // Sort by last activity (most recent first)
    customers.sort(
      (a, b) =>
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );

    return customers;
  } catch (error) {
    console.error("Error getting customers:", error);
    return [];
  }
}
