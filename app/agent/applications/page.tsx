import { ApplicationsTable } from "@/components/agent/applications-table";
import { ApplicationsFilters } from "@/components/agent/applications-filters";
import { getAgentApplications } from "@/app/actions/agent-applications-actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface SearchParams {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface AgentApplicationsProps {
  searchParams: Promise<SearchParams>;
}

export default async function AgentApplications({
  searchParams,
}: AgentApplicationsProps) {
  // Await searchParams
  const params = await searchParams;

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

  // Fetch applications with filters
  const applications = await getAgentApplications(userProfile.agent_id, params);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Loan Applications
        </h1>
        <p className="text-muted-foreground">
          Manage and track all loan applications submitted under your agent ID
        </p>
      </div>

      {/* Filters */}
      <ApplicationsFilters />

      {/* Applications Table */}
      <ApplicationsTable
        applications={applications}
        agentId={userProfile.agent_id}
      />
    </div>
  );
}
