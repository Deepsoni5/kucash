import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Clock } from "lucide-react";
import { AgentStatsCards } from "@/components/agent/agent-stats-cards";
import { RecentApplications } from "@/components/agent/recent-applications";
import { PerformanceChart } from "@/components/agent/performance-chart";

export default function AgentDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your agent performance and activities
        </p>
      </div>

      {/* Stats Cards */}
      <AgentStatsCards />

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceChart />
        <RecentApplications />
      </div>

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
                <p className="font-medium">Reports</p>
                <p className="text-sm text-muted-foreground">View analytics</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
