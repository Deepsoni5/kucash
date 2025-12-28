import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { AgentsTable } from "@/components/admin/agents-table";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  await requireAdminAuth();

  const supabase = await createClient();

  // Get all agents with their details
  const { data: agents, error: agentsError } = await supabase
    .from("users")
    .select(
      `
      id, 
      full_name, 
      email, 
      role, 
      is_active, 
      created_at, 
      updated_at,
      mobile_number,
      postal_address,
      phone_gpay_number,
      photo_url,
      agent_id,
      user_id
    `
    )
    .eq("role", "agent")
    .order("created_at", { ascending: false });

  // Get loan statistics for all agents
  const { data: loanStats, error: loanStatsError } = await supabase
    .from("loan_applications")
    .select("agent_id, status, loan_amount, agent_commission");

  // Get agent counts
  const { count: totalAgents } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "agent");

  const { count: activeAgents } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "agent")
    .eq("is_active", true);

  const { count: inactiveAgents } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "agent")
    .eq("is_active", false);

  // Calculate loan statistics
  const totalLoans = loanStats?.length || 0;
  const pendingLoans =
    loanStats?.filter((loan) => loan.status === "pending").length || 0;
  const approvedLoans =
    loanStats?.filter((loan) => loan.status === "approved").length || 0;
  const rejectedLoans =
    loanStats?.filter((loan) => loan.status === "rejected").length || 0;

  // Calculate commission statistics by status
  const pendingCommission =
    loanStats
      ?.filter((loan) => loan.status === "pending")
      .reduce(
        (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
        0
      ) || 0;
  const earnedCommission =
    loanStats
      ?.filter((loan) => loan.status === "approved")
      .reduce(
        (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
        0
      ) || 0;
  const rejectedCommission =
    loanStats
      ?.filter((loan) => loan.status === "rejected")
      .reduce(
        (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
        0
      ) || 0;

  // Process agents with their loan statistics
  const agentsWithStats =
    agents?.map((agent) => {
      const agentLoans =
        loanStats?.filter((loan) => loan.agent_id === agent.agent_id) || [];
      return {
        ...agent,
        totalLoans: agentLoans.length,
        pendingLoans: agentLoans.filter((loan) => loan.status === "pending")
          .length,
        approvedLoans: agentLoans.filter((loan) => loan.status === "approved")
          .length,
        rejectedLoans: agentLoans.filter((loan) => loan.status === "rejected")
          .length,
        pendingCommission: agentLoans
          .filter((loan) => loan.status === "pending")
          .reduce(
            (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
            0
          ),
        earnedCommission: agentLoans
          .filter((loan) => loan.status === "approved")
          .reduce(
            (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
            0
          ),
        rejectedCommission: agentLoans
          .filter((loan) => loan.status === "rejected")
          .reduce(
            (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
            0
          ),
        totalCommission: agentLoans.reduce(
          (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
          0
        ),
        totalLoanAmount: agentLoans.reduce(
          (sum, loan) => sum + (parseFloat(loan.loan_amount) || 0),
          0
        ),
      };
    }) || [];

  if (agentsError || loanStatsError) {
    console.error("Error fetching data:", agentsError || loanStatsError);
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Agent Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage agents and track their loan performance
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Agents
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAgents || 0}</div>
              <p className="text-xs text-muted-foreground">
                All registered agents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Agents
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {activeAgents || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Agents
              </CardTitle>
              <UserX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {inactiveAgents || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Deactivated accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Commission
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                ₹{pendingCommission.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From pending loans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Earned Commission
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                ₹{earnedCommission.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From approved loans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rejected Commission
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                ₹{rejectedCommission.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                From rejected loans
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Loan Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLoans}</div>
              <p className="text-xs text-muted-foreground">
                All loan applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Loans
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {pendingLoans}
              </div>
              <p className="text-xs text-muted-foreground">Under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Loans
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {approvedLoans}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rejected Loans
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {rejectedLoans}
              </div>
              <p className="text-xs text-muted-foreground">
                Applications rejected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Agents Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Agents</CardTitle>
            <CardDescription>
              View and manage agent accounts with their loan performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AgentsTable agents={agentsWithStats || []} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
