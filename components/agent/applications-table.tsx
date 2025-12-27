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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, MoreHorizontal, Phone, Mail, Edit } from "lucide-react";
import { UpdateStatusDialog } from "./update-status-dialog";

// Mock data - replace with real data from your API
const applications = [
  {
    id: "APP001",
    customerName: "Rajesh Kumar",
    email: "rajesh@example.com",
    mobile: "+91 9876543210",
    amount: 250000,
    tenure: 24,
    purpose: "Business Expansion",
    status: "pending",
    appliedDate: "2025-12-25",
    monthlyIncome: 45000,
    employmentType: "Self Employed",
  },
  {
    id: "APP002",
    customerName: "Priya Sharma",
    email: "priya@example.com",
    mobile: "+91 9876543211",
    amount: 180000,
    tenure: 18,
    purpose: "Personal Use",
    status: "approved",
    appliedDate: "2025-12-24",
    monthlyIncome: 35000,
    employmentType: "Salaried",
  },
  {
    id: "APP003",
    customerName: "Amit Patel",
    email: "amit@example.com",
    mobile: "+91 9876543212",
    amount: 300000,
    tenure: 36,
    purpose: "Home Improvement",
    status: "under_review",
    appliedDate: "2025-12-23",
    monthlyIncome: 55000,
    employmentType: "Salaried",
  },
  {
    id: "APP004",
    customerName: "Sunita Devi",
    email: "sunita@example.com",
    mobile: "+91 9876543213",
    amount: 150000,
    tenure: 12,
    purpose: "Medical Emergency",
    status: "rejected",
    appliedDate: "2025-12-22",
    monthlyIncome: 25000,
    employmentType: "Self Employed",
  },
  {
    id: "APP005",
    customerName: "Vikram Singh",
    email: "vikram@example.com",
    mobile: "+91 9876543214",
    amount: 400000,
    tenure: 48,
    purpose: "Business Expansion",
    status: "disbursed",
    appliedDate: "2025-12-21",
    monthlyIncome: 75000,
    employmentType: "Business Owner",
  },
];

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function ApplicationsTable() {
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);

  return (
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
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{application.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {application.employmentType}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" />
                        {application.mobile}
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
                        {formatCurrency(application.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Income: {formatCurrency(application.monthlyIncome)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{application.tenure} months</TableCell>
                  <TableCell>
                    <span className="text-sm">{application.purpose}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell>
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Application Details - {application.id}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Customer Information
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>Name:</strong>{" "}
                                      {application.customerName}
                                    </p>
                                    <p>
                                      <strong>Email:</strong>{" "}
                                      {application.email}
                                    </p>
                                    <p>
                                      <strong>Mobile:</strong>{" "}
                                      {application.mobile}
                                    </p>
                                    <p>
                                      <strong>Employment:</strong>{" "}
                                      {application.employmentType}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Loan Information
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <p>
                                      <strong>Amount:</strong>{" "}
                                      {formatCurrency(application.amount)}
                                    </p>
                                    <p>
                                      <strong>Tenure:</strong>{" "}
                                      {application.tenure} months
                                    </p>
                                    <p>
                                      <strong>Purpose:</strong>{" "}
                                      {application.purpose}
                                    </p>
                                    <p>
                                      <strong>Monthly Income:</strong>{" "}
                                      {formatCurrency(
                                        application.monthlyIncome
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">
                                  Application Status
                                </h4>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(application.status)}
                                  <span className="text-sm text-muted-foreground">
                                    Applied on{" "}
                                    {new Date(
                                      application.appliedDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedApplication(application);
                            setUpdateStatusOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Update Status
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Update Status Dialog */}
      <UpdateStatusDialog
        application={selectedApplication}
        open={updateStatusOpen}
        onOpenChange={setUpdateStatusOpen}
      />
    </Card>
  );
}
