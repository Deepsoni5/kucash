"use server";

import { createClient } from "@/lib/supabase/server";

export interface ApplicationFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LoanApplicationFull {
  id: string;
  loan_id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  current_address: string;
  permanent_address: string;
  pan_number: string;
  aadhar_number: string;
  loan_type: string;
  loan_amount: string;
  loan_purpose: string;
  tenure: number;
  employment_type: string;
  monthly_income: string;
  company_name: string;
  status: string;
  referral_code: string | null;
  agent_id: string | null;
  agent_commission: string;
  user_id: string;
}

export async function getAgentApplications(
  agentId: string,
  filters?: ApplicationFilters
): Promise<LoanApplicationFull[]> {
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

    if (filters?.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.trim().replace(/'/g, "''"); // Escape single quotes
      query = query.or(
        `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,loan_id.ilike.%${searchTerm}%`
      );
    }

    if (filters?.dateFrom) {
      const startDate = new Date(filters.dateFrom);
      startDate.setHours(0, 0, 0, 0);
      query = query.gte("created_at", startDate.toISOString());
    }

    if (filters?.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      query = query.lte("created_at", endDate.toISOString());
    }

    const { data: applications, error } = await query;

    if (error) {
      console.error("Error fetching agent applications:", error);
      return [];
    }

    return applications || [];
  } catch (error) {
    console.error("Error getting agent applications:", error);
    return [];
  }
}

export async function exportApplicationsToCSV(
  agentId: string,
  filters?: ApplicationFilters
): Promise<string> {
  try {
    const applications = await getAgentApplications(agentId, filters);

    if (applications.length === 0) {
      return "";
    }

    // CSV headers
    const headers = [
      "Loan ID",
      "Customer Name",
      "Email",
      "Phone",
      "Loan Type",
      "Loan Amount",
      "Tenure (Months)",
      "Purpose",
      "Employment Type",
      "Monthly Income",
      "Company",
      "Status",
      "Applied Date",
      "Commission",
    ];

    // CSV rows
    const rows = applications.map((app) => [
      app.loan_id,
      app.full_name,
      app.email,
      app.phone,
      app.loan_type,
      app.loan_amount,
      app.tenure.toString(),
      app.loan_purpose,
      app.employment_type,
      app.monthly_income,
      app.company_name,
      app.status,
      new Date(app.created_at).toLocaleDateString(),
      app.agent_commission,
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    return csvContent;
  } catch (error) {
    console.error("Error exporting applications:", error);
    return "";
  }
}
