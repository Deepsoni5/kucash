"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Phone, Mail, User, Loader2 } from "lucide-react";
import { LoanApplicationFull } from "@/app/actions/agent-applications-actions";
import { LoanDetailsDialog } from "./loan-details-dialog";
import { CustomerDetailsDialog } from "./customer-details-dialog";
import {
  getLoanDetails,
  getCustomerDetails,
} from "@/app/actions/agent-dashboard-actions";

interface ApplicationsTableProps {
  applications: LoanApplicationFull[];
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
    case "disbursed":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
          Disbursed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(parseInt(amount));
};

export function ApplicationsTable({
  applications,
  agentId,
}: ApplicationsTableProps) {
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handleViewLoanDetails = async (loanId: string) => {
    setLoading(loanId);
    try {
      const loanDetails = await getLoanDetails(loanId, agentId);
      if (loanDetails) {
        setSelectedLoan(loanDetails);
        setLoanDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
    } finally {
      setLoading(null);
    }
  };

  const handleViewCustomerDetails = async (userId: string, loanId: string) => {
    setLoading(loanId);
    try {
      const customerDetails = await getCustomerDetails(userId);
      if (customerDetails) {
        setSelectedCustomer(customerDetails);
        setCustomerDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tenure</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">
                        {application.loan_id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{application.full_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {application.employment_type}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3" />
                            {application.phone}
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Mail className="h-3 w-3" />
                            {application.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatCurrency(application.loan_amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Income: {formatCurrency(application.monthly_income)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{application.tenure} months</TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {application.loan_purpose}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      <TableCell>
                        {new Date(application.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={loading === application.id}
                            >
                              {loading === application.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewLoanDetails(application.id)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewCustomerDetails(
                                  application.user_id,
                                  application.id
                                )
                              }
                            >
                              <User className="mr-2 h-4 w-4" />
                              View Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
