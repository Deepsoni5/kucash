"use client";

import { useState } from "react";
import { CustomerLoan } from "@/app/actions/customer-loan-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoanDetailsDialog } from "./loan-details-dialog";
import Link from "next/link";

interface CustomerDashboardClientProps {
  loans: CustomerLoan[];
}

export function CustomerDashboardClient({
  loans,
}: CustomerDashboardClientProps) {
  const [selectedLoan, setSelectedLoan] = useState<CustomerLoan | null>(null);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);

  const handleViewLoan = (loan: CustomerLoan) => {
    setSelectedLoan(loan);
    setLoanDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "under_review":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="space-y-4">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium capitalize">
                  {loan.loan_type.replace("_", " ")} Loan
                </h4>
                <Badge className={getStatusColor(loan.status)}>
                  {loan.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(loan.loan_amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                Applied on {new Date(loan.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewLoan(loan)}
            >
              View Details
            </Button>
          </div>
        ))}
        <div className="pt-2">
          <Link href="/customer/loans">
            <Button variant="outline" className="w-full">
              View All Applications
            </Button>
          </Link>
        </div>
      </div>

      <LoanDetailsDialog
        loan={selectedLoan}
        open={loanDialogOpen}
        onOpenChange={setLoanDialogOpen}
      />
    </>
  );
}
