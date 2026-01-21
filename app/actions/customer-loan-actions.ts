"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CustomerLoan {
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
  loan_amount: number;
  loan_purpose: string;
  tenure: number;
  employment_type: string;
  monthly_income: number;
  company_name: string;
  status: string;
  referral_code?: string;
  agent_id?: string;
  agent_commission?: number;
  user_id: string;
  pan_card_url?: string;
  aadhar_card_url?: string;
  income_proof_url?: string;
  address_proof_url?: string;
  salary_slips_url?: string;
  bank_statements_url?: string;
  other_documents?: string;
  processed_by?: string;
  processed_at?: string;
  rejection_reason?: string;
  approval_notes?: string;
  approved_amount?: number;
  approved_tenure?: number;
  interest_rate?: number;
  processing_fee?: number;
  disbursed_amount?: number;
  disbursed_at?: string;
  disbursement_reference?: string;
  application_source?: string;
  ip_address?: string;
  user_agent?: string;
  // Agent details if available
  agent?: {
    id: string;
    full_name: string;
    email: string;
    mobile_number: string;
    agent_id: string;
  };
}

export interface LoanStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  under_review: number;
  total_amount: number;
  approved_amount: number;
}

// Get customer's loans
export async function getCustomerLoans(
  userId: string
): Promise<CustomerLoan[]> {
  const supabase = await createClient();

  // First get the loan applications
  const { data: loans, error: loansError } = await supabase
    .from("loan_applications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (loansError) {
    console.error("Error fetching customer loans:", loansError);
    return [];
  }

  if (!loans || loans.length === 0) {
    return [];
  }

  // Get unique agent IDs
  const agentIds = [
    ...new Set(loans.map((loan) => loan.agent_id).filter(Boolean)),
  ];

  let agents: any[] = [];
  if (agentIds.length > 0) {
    const { data: agentsData, error: agentsError } = await supabase
      .from("users")
      .select("id, full_name, email, mobile_number, agent_id")
      .in("agent_id", agentIds);

    if (agentsError) {
      console.error("Error fetching agents:", agentsError);
    } else {
      agents = agentsData || [];
    }
  }

  // Combine loans with agent data
  const loansWithAgents = loans.map((loan) => {
    const agent = agents.find((a) => a.agent_id === loan.agent_id);
    return {
      ...loan,
      agent: agent || null,
    };
  });

  return loansWithAgents;
}

// Get customer loan stats
export async function getCustomerLoanStats(userId: string): Promise<LoanStats> {
  const supabase = await createClient();

  const { data: loans, error } = await supabase
    .from("loan_applications")
    .select("status, loan_amount")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching loan stats:", error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      under_review: 0,
      total_amount: 0,
      approved_amount: 0,
    };
  }

  const stats = loans.reduce(
    (acc, loan) => {
      acc.total += 1;
      acc.total_amount += loan.loan_amount;

      switch (loan.status) {
        case "pending":
          acc.under_review += 1;
          break;
        case "approved":
          acc.approved += 1;
          acc.approved_amount += loan.loan_amount;
          break;
        case "rejected":
          acc.rejected += 1;
          break;
        case "under_review":
          acc.under_review += 1;
          break;
      }

      return acc;
    },
    {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      under_review: 0,
      total_amount: 0,
      approved_amount: 0,
    }
  );

  return stats;
}

// Get single loan details
export async function getLoanDetails(
  loanId: string,
  userId: string
): Promise<CustomerLoan | null> {
  const supabase = await createClient();

  // Get the loan application
  const { data: loan, error: loanError } = await supabase
    .from("loan_applications")
    .select("*")
    .eq("id", loanId)
    .eq("user_id", userId)
    .single();

  if (loanError) {
    console.error("Error fetching loan details:", loanError);
    return null;
  }

  if (!loan) {
    return null;
  }

  // Get agent details if agent_id exists
  let agent = null;
  if (loan.agent_id) {
    const { data: agentData, error: agentError } = await supabase
      .from("users")
      .select("id, full_name, email, mobile_number, agent_id")
      .eq("agent_id", loan.agent_id)
      .single();

    if (agentError) {
      console.error("Error fetching agent details:", agentError);
    } else {
      agent = agentData;
    }
  }

  return {
    ...loan,
    agent,
  };
}

// Update customer profile
export async function updateCustomerProfile(
  userId: string,
  profileData: {
    full_name?: string;
    mobile_number?: string;
    phone_gpay_number?: string;
  }
) {
  const supabase = await createClient();

  // Sanitize data: convert empty strings to null
  const sanitizedData = {
    ...profileData,
    phone_gpay_number: profileData.phone_gpay_number || null,
    mobile_number: profileData.mobile_number || null,
  };

  const { error } = await supabase
    .from("users")
    .update(sanitizedData)
    .eq("user_id", userId);

  if (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/customer/profile");
  return { success: true };
}
