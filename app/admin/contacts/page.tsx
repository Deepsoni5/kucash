import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ContactSubmissionsTable } from "@/components/admin/contact-submissions-table";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

export default async function ContactSubmissionsPage() {
  await requireAdminAuth();

  const supabase = await createClient();

  // Get all contact submissions with counts by status
  const { data: submissions, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  const { count: totalCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true });

  const { count: newCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const { count: inProgressCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress");

  const { count: resolvedCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "resolved");

  if (error) {
    console.error("Error fetching contact submissions:", error);
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Contact Submissions
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage customer inquiries and support requests
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount || 0}</div>
              <p className="text-xs text-muted-foreground">All submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {newCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {inProgressCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Being handled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {resolvedCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              View and manage all contact form submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactSubmissionsTable submissions={submissions || []} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
