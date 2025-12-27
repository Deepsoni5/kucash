import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerLayout } from "@/components/customer/customer-layout";
import { getCustomerLoans } from "@/app/actions/customer-loan-actions";
import { CustomerLoansPageClient } from "@/components/customer/customer-loans-page-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { CustomerLoansTable } from "@/components/customer/customer-loans-table";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function CustomerLoansPage() {
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

  // Get customer loans
  const loans = await getCustomerLoans(authUser.id);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Loans</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your loan applications
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Link href="/#apply">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Apply for Loan
              </Button>
            </Link>
          </div>
        </div>

        {/* Loans Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Applications</CardTitle>
            <CardDescription>
              View and manage all your loan applications with detailed
              information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerLoansPageClient loans={loans} />
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
