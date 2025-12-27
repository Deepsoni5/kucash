import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Clock } from "lucide-react";
import { AgentStatsCards } from "@/components/agent/agent-stats-cards";
import { RecentApplications } from "@/components/agent/recent-applications";
import { PerformanceChart } from "@/components/agent/performance-chart";
import { CommissionBreakdownChart } from "@/components/agent/commission-breakdown-chart";
import { LoanTypeDistribution } from "@/components/agent/loan-type-distribution";
import { GoalProgressCards } from "@/components/agent/goal-progress-cards";
import { WeeklyActivityHeatmap } from "@/components/agent/weekly-activity-heatmap";
import {
  getAgentStats,
  getRecentApplications,
  getMonthlyPerformance,
} from "@/app/actions/agent-dashboard-actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AgentDashboard() {
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

  // Fetch dashboard data
  const [stats, recentApplications, monthlyPerformance] = await Promise.all([
    getAgentStats(userProfile.agent_id),
    getRecentApplications(userProfile.agent_id, 4),
    getMonthlyPerformance(userProfile.agent_id),
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your agent performance and activities
        </p>
      </div>

      {/* Goal Progress Cards */}
      <GoalProgressCards stats={stats} />

      {/* Stats Cards */}
      <AgentStatsCards stats={stats} />

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart monthlyData={monthlyPerformance} stats={stats} />
        <CommissionBreakdownChart stats={stats} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <LoanTypeDistribution agentId={userProfile.agent_id} />
        <WeeklyActivityHeatmap agentId={userProfile.agent_id} />
      </div>

      {/* Recent Applications */}
      <RecentApplications
        applications={recentApplications}
        agentId={userProfile.agent_id}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/agent/apply"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">New Application</p>
                <p className="text-sm text-muted-foreground">
                  Apply for customer
                </p>
              </div>
            </a>

            <a
              href="/agent/customers"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="font-medium">Manage Customers</p>
                <p className="text-sm text-muted-foreground">
                  View all customers
                </p>
              </div>
            </a>

            <a
              href="/agent/applications"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="font-medium">Applications</p>
                <p className="text-sm text-muted-foreground">Track status</p>
              </div>
            </a>

            <a
              href="/agent/reports"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium">Commission Reports</p>
                <p className="text-sm text-muted-foreground">View earnings</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
