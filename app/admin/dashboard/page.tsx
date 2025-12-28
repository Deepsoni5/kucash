import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { getDashboardStats } from "@/app/actions/admin-dashboard-actions";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { RecentActivity } from "@/components/admin/recent-activity";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdminAuth();
  const supabase = await createClient();

  // Get comprehensive dashboard stats
  const dashboardData = await getDashboardStats();

  // Get recent activity data
  const { data: recentLoans } = await supabase
    .from("loan_applications")
    .select(
      "id, loan_id, full_name, loan_type, loan_amount, status, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: recentContacts } = await supabase
    .from("contact_submissions")
    .select("id, name, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, full_name, email, role, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, {session.full_name}!
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Here's your KuCash platform overview for today
            </p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats data={dashboardData} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common administrative tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/admin/loans">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-xs">Manage Loans</span>
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Manage Users</span>
                </Button>
              </Link>
              <Link href="/admin/agents">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Manage Agents</span>
                </Button>
              </Link>
              <Link href="/admin/contacts">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs">View Contacts</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Analytics & Insights
            </CardTitle>
            <CardDescription>
              Visual representation of your platform's performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCharts data={dashboardData.charts} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest activities across your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity
              recentLoans={recentLoans || []}
              recentContacts={recentContacts || []}
              recentUsers={recentUsers || []}
            />
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loan Performance</CardTitle>
              <CardDescription>
                Key metrics for loan applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Approval Rate</span>
                <span className="text-sm font-bold">
                  {dashboardData.loans.total > 0
                    ? (
                        (dashboardData.loans.approved /
                          dashboardData.loans.total) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      dashboardData.loans.total > 0
                        ? (dashboardData.loans.approved /
                            dashboardData.loans.total) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-yellow-600">
                    {dashboardData.loans.pending}
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {dashboardData.loans.approved}
                  </div>
                  <div className="text-xs text-muted-foreground">Approved</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {dashboardData.loans.rejected}
                  </div>
                  <div className="text-xs text-muted-foreground">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>
                Top performing agents this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.agents.topPerformers
                .slice(0, 3)
                .map((agent, index) => {
                  const getStatusBadge = (status: string) => {
                    switch (status) {
                      case "approved":
                        return (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800 border-green-200 text-xs mr-2"
                          >
                            Earned
                          </Badge>
                        );
                      case "rejected":
                        return (
                          <Badge variant="destructive" className="text-xs mr-2">
                            Rejected
                          </Badge>
                        );
                      default:
                        return (
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs mr-2"
                          >
                            Pending
                          </Badge>
                        );
                    }
                  };

                  return (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            {agent.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {agent.applications} applications • {agent.approved}{" "}
                            approved
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          {getStatusBadge(agent.status)}
                          <span className="text-sm font-medium text-green-600">
                            ₹{agent.commission.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Commission
                        </div>
                      </div>
                    </div>
                  );
                })}
              {dashboardData.agents.topPerformers.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No agent performance data yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Blog Insights - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Blog Insights
            </CardTitle>
            <CardDescription>Top performing blog posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.blog.topPosts.slice(0, 3).map((post, index) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {post.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.views} views • {post.likes} likes
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs self-start sm:self-center"
                >
                  {post.status}
                </Badge>
              </div>
            ))}
            {dashboardData.blog.topPosts.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No blog posts yet</p>
              </div>
            )}
            <div className="pt-2 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {dashboardData.blog.totalViews.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Views
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {dashboardData.blog.totalLikes}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Likes
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {dashboardData.blog.published}
                  </div>
                  <div className="text-xs text-muted-foreground">Published</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
