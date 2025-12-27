"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, Mail, Calendar, DollarSign } from "lucide-react";

// Mock data - replace with real data from your API
const reportData = [
  {
    id: "APP001",
    customerName: "Rajesh Kumar",
    email: "rajesh@example.com",
    mobile: "+91 9876543210",
    amount: 250000,
    tenure: 24,
    purpose: "Business Expansion",
    status: "approved",
    appliedDate: "2025-12-25",
    approvedDate: "2025-12-26",
    commission: 5000,
    monthlyIncome: 45000,
  },
  {
    id: "APP002",
    customerName: "Priya Sharma",
    email: "priya@example.com",
    mobile: "+91 9876543211",
    amount: 180000,
    tenure: 18,
    purpose: "Personal Use",
    status: "disbursed",
    appliedDate: "2025-12-24",
    approvedDate: "2025-12-25",
    disbursedDate: "2025-12-26",
    commission: 3600,
    monthlyIncome: 35000,
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
    commission: 0,
    monthlyIncome: 55000,
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
    rejectedDate: "2025-12-23",
    commission: 0,
    monthlyIncome: 25000,
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
    approvedDate: "2025-12-22",
    disbursedDate: "2025-12-23",
    commission: 8000,
    monthlyIncome: 75000,
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

export function ReportsTable() {
  const totalCommission = reportData.reduce(
    (sum, item) => sum + item.commission,
    0
  );
  const totalLoanAmount = reportData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Applications
                </p>
                <p className="text-2xl font-bold">{reportData.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Loan Amount
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalLoanAmount)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Commission
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalCommission)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Customer Details</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Loan Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium">{item.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          Income: {formatCurrency(item.monthlyIncome)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3" />
                          {item.mobile}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Mail className="h-3 w-3" />
                          {item.email}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {formatCurrency(item.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.tenure} months • {item.purpose}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(item.status)}</TableCell>

                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>
                          Applied:{" "}
                          {new Date(item.appliedDate).toLocaleDateString()}
                        </div>
                        {item.approvedDate && (
                          <div className="text-green-600">
                            Approved:{" "}
                            {new Date(item.approvedDate).toLocaleDateString()}
                          </div>
                        )}
                        {item.disbursedDate && (
                          <div className="text-emerald-600">
                            Disbursed:{" "}
                            {new Date(item.disbursedDate).toLocaleDateString()}
                          </div>
                        )}
                        {item.rejectedDate && (
                          <div className="text-red-600">
                            Rejected:{" "}
                            {new Date(item.rejectedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            item.commission > 0
                              ? "text-green-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.commission > 0
                            ? formatCurrency(item.commission)
                            : "-"}
                        </p>
                        {item.commission > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {((item.commission / item.amount) * 100).toFixed(1)}
                            %
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
