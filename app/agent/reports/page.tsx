import { CommissionStats } from "@/components/agent/commission-stats";
import { CommissionTable } from "@/components/agent/commission-table";
import { CommissionFilters } from "@/components/agent/commission-filters";
import { CommissionChart } from "@/components/agent/commission-chart";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface SearchParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

interface AgentReportsProps {
  searchParams: Promise<SearchParams>;
}

export default async function AgentReports({
  searchParams,
}: AgentReportsProps) {
  // Get current user and verify they are an agent
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    redirect("/login");
  }

  // Get user profile to get agent_id
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", authUser.id)
    .single();

  if (
    profileError ||
    !userProfile ||
    userProfile.role !== "agent" ||
    !userProfile.agent_id
  ) {
    redirect("/login");
  }

  const params = await searchParams;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Commission & Earnings
        </h1>
        <p className="text-muted-foreground">
          Track your commission earnings and income from loan applications
        </p>
      </div>

      {/* Commission Stats */}
      <CommissionStats agentId={userProfile.agent_id} />

      {/* Commission Chart */}
      <CommissionChart agentId={userProfile.agent_id} />

      {/* Filters */}
      <CommissionFilters />

      {/* Commission Table */}
      <CommissionTable agentId={userProfile.agent_id} filters={params} />
    </div>
  );
}
