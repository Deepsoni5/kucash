"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RecentApplication } from "@/app/actions/agent-dashboard-actions";
import { useState } from "react";
import { LoanDetailsDialog } from "./loan-details-dialog";
import { CustomerDetailsDialog } from "./customer-details-dialog";
import {
  getLoanDetails,
  getCustomerDetails,
} from "@/app/actions/agent-dashboard-actions";

interface RecentApplicationsProps {
  applications: RecentApplication[];
  agentId: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Approved
        </Badge>
      );
    case "under_review":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Under Review
        </Badge>
      );
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function RecentApplications({
  applications,
  agentId,
}: RecentApplicationsProps) {
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleViewLoanDetails = async (loanId: string) => {
    setLoading(true);
    try {
      const loanDetails = await getLoanDetails(loanId, agentId);
      if (loanDetails) {
        setSelectedLoan(loanDetails);
        setLoanDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomerDetails = async (userId: string) => {
    setLoading(true);
    try {
      const customerDetails = await getCustomerDetails(userId);
      if (customerDetails) {
        setSelectedCustomer(customerDetails);
        setCustomerDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No applications found
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {application.full_name}
                      </p>
                      {getStatusBadge(application.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {application.loan_id} • {application.phone}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Amount: {application.loan_amount}</span>
                      <span>Tenure: {application.tenure} months</span>
                      <span>
                        Applied:{" "}
                        {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={loading}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewLoanDetails(application.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleViewCustomerDetails(application.user_id)
                        }
                      >
                        <User className="mr-2 h-4 w-4" />
                        View Customer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <LoanDetailsDialog
        loan={selectedLoan}
        open={loanDialogOpen}
        onOpenChange={setLoanDialogOpen}
      />

      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={customerDialogOpen}
        onOpenChange={setCustomerDialogOpen}
      />
    </>
  );
}
