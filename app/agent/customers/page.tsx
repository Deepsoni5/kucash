import { CustomersTable } from "@/components/agent/customers-table";
import { CustomersStats } from "@/components/agent/customers-stats";
import {
  getAgentCustomerStats,
  getAgentCustomers,
} from "@/app/actions/agent-customers-actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface SearchParams {
  search?: string;
}

interface AgentCustomersProps {
  searchParams: Promise<SearchParams>;
}

export default async function AgentCustomers({
  searchParams,
}: AgentCustomersProps) {
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

  // Fetch customer data
  const [customerStats, customers] = await Promise.all([
    getAgentCustomerStats(userProfile.agent_id),
    getAgentCustomers(userProfile.agent_id, params.search),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Customer Management
        </h1>
        <p className="text-muted-foreground">
          Manage all customers who have applied through your agent ID
        </p>
      </div>

      {/* Customer Stats */}
      <CustomersStats stats={customerStats} />

      {/* Customers Table */}
      <CustomersTable customers={customers} />
    </div>
  );
}
