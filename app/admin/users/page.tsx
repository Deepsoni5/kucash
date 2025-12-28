import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { UsersTable } from "@/components/admin/users-table";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Shield, UserCheck, UserX } from "lucide-react";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdminAuth();

  const supabase = await createClient();

  // Get all users with all fields
  const { data: users, error } = await supabase
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
    .order("created_at", { ascending: false });

  // Get user counts by role and status
  const { count: totalCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  const { count: agentCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "agent");

  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "user");

  const { count: activeCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: inactiveCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_active", false);

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <CreateUserDialog />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agents</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {agentCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Agent users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {userCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Customer users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {activeCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inactive Users
              </CardTitle>
              <UserX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {inactiveCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Deactivated accounts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              View and manage all user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable users={users || []} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
