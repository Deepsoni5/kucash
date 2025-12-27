import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerLayout } from "@/components/customer/customer-layout";
import {
  getCustomerLoans,
  getCustomerLoanStats,
} from "@/app/actions/customer-loan-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  IndianRupee,
  FileText,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CustomerDashboardClient } from "@/components/customer/customer-dashboard-client";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function CustomerDashboard() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", authUser.id)
    .single();

  if (!userProfile) {
    redirect("/login");
  }

  // Get customer data
  const [loans, stats] = await Promise.all([
    getCustomerLoans(authUser.id),
    getCustomerLoanStats(authUser.id),
  ]);

  const recentLoans = loans.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {userProfile.full_name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your loan applications and account status.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Applications
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                All loan applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats.approved}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(stats.approved_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Under Review
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {stats.under_review}
              </div>
              <p className="text-xs text-muted-foreground">Being processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.total_amount)}
              </div>
              <p className="text-xs text-muted-foreground">Applied amount</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Applications
              </CardTitle>
              <CardDescription>Your latest loan applications</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLoans.length > 0 ? (
                <CustomerDashboardClient loans={recentLoans} />
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-4">
                    No loan applications yet
                  </p>
                  <Link href="/#apply">
                    <Button>Apply for Your First Loan</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/#apply" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Apply for New Loan
                  </Button>
                </Link>
                <Link href="/emi-calculator" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    EMI Calculator
                  </Button>
                </Link>
                <Link href="/customer/profile" className="block">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </Link>
              </div>

              {/* Support */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="font-medium text-primary mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Our support team is here to assist you with any questions.
                </p>
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}
