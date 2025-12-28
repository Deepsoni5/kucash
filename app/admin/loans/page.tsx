import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { LoansTable } from "@/components/admin/loans-table";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

export default async function LoansPage() {
  await requireAdminAuth();

  const supabase = await createClient();

  // Get all loan applications
  const { data: loans, error: loansError } = await supabase
    .from("loan_applications")
    .select("*")
    .order("created_at", { ascending: false });

  // Get all users to match with loan applications
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(
      "id, user_id, full_name, email, mobile_number, photo_url, agent_id, role"
    );

  // Manually join the data
  const loansWithUsers =
    loans?.map((loan) => {
      // Find the user who applied for the loan (match by user_id)
      const applicantUser = users?.find(
        (user) => user.user_id === loan.user_id
      );

      // Find the agent who referred this loan (match by agent_id)
      const agentUser = users?.find(
        (user) => user.agent_id === loan.agent_id && user.role === "agent"
      );

      return {
        ...loan,
        users: applicantUser
          ? {
              full_name: applicantUser.full_name,
              email: applicantUser.email,
              mobile_number: applicantUser.mobile_number,
              photo_url: applicantUser.photo_url,
            }
          : null,
        agent_user: agentUser
          ? {
              full_name: agentUser.full_name,
              email: agentUser.email,
              mobile_number: agentUser.mobile_number,
              agent_id: agentUser.agent_id,
            }
          : null,
      };
    }) || [];

  // Get loan statistics
  const { count: totalLoans } = await supabase
    .from("loan_applications")
    .select("*", { count: "exact", head: true });

  const { count: pendingLoans } = await supabase
    .from("loan_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: approvedLoans } = await supabase
    .from("loan_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  const { count: rejectedLoans } = await supabase
    .from("loan_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected");

  // Calculate financial statistics
  const totalLoanAmount =
    loansWithUsers?.reduce(
      (sum, loan) => sum + (parseFloat(loan.loan_amount) || 0),
      0
    ) || 0;
  const pendingAmount =
    loansWithUsers
      ?.filter((loan) => loan.status === "pending")
      .reduce((sum, loan) => sum + (parseFloat(loan.loan_amount) || 0), 0) || 0;
  const approvedAmount =
    loansWithUsers
      ?.filter((loan) => loan.status === "approved")
      .reduce((sum, loan) => sum + (parseFloat(loan.loan_amount) || 0), 0) || 0;
  const totalCommission =
    loansWithUsers?.reduce(
      (sum, loan) => sum + (parseFloat(loan.agent_commission) || 0),
      0
    ) || 0;

  if (loansError || usersError) {
    console.error("Error fetching data:", loansError || usersError);
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Loan Applications
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage and review all loan applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLoans || 0}</div>
              <p className="text-xs text-muted-foreground">
                All loan applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Review
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {pendingLoans || 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {approvedLoans || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                {rejectedLoans || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Applications rejected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                ₹{totalLoanAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Amount
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                ₹{pendingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Under review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Approved Amount
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                ₹{approvedAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Approved loans</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Commission
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                ₹{totalCommission.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Agent commissions</p>
            </CardContent>
          </Card>
        </div>

        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Loan Applications</CardTitle>
            <CardDescription>
              Review, manage, and process loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoansTable loans={loansWithUsers || []} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
