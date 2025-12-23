import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Users,
  MessageSquare,
  Settings,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdminAuth();
  const supabase = await createClient();

  // Get dashboard stats
  const { count: contactCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true });

  const { count: newContactCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {session.full_name}!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here's what's happening with your Kucash platform today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {userCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Contact Forms
              </CardTitle>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {contactCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {newContactCount || 0} new submissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Loan Applications
              </CardTitle>
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                System Status
              </CardTitle>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-500">
                Online
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Submissions</CardTitle>
            <CardDescription>
              Latest customer inquiries and messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contactCount && contactCount > 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">
                  You have {contactCount} contact submissions to review
                </p>
                <a
                  href="/admin/contacts"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  View All Submissions
                </a>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No contact submissions yet</p>
                <p className="text-sm mt-2">New submissions will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
