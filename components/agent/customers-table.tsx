"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Eye, MoreHorizontal, Phone, Mail, Search, Filter } from "lucide-react";

// Mock data - replace with real data from your API
const customers = [
  {
    id: "CUST001",
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    mobile: "+91 9876543210",
    totalApplications: 3,
    approvedLoans: 2,
    totalLoanAmount: 450000,
    lastActivity: "2025-12-26",
    status: "active",
    joinedDate: "2025-10-15",
    monthlyIncome: 45000,
  },
  {
    id: "CUST002",
    name: "Priya Sharma",
    email: "priya@example.com",
    mobile: "+91 9876543211",
    totalApplications: 1,
    approvedLoans: 1,
    totalLoanAmount: 180000,
    lastActivity: "2025-12-25",
    status: "active",
    joinedDate: "2025-11-20",
    monthlyIncome: 35000,
  },
  {
    id: "CUST003",
    name: "Amit Patel",
    email: "amit@example.com",
    mobile: "+91 9876543212",
    totalApplications: 2,
    approvedLoans: 1,
    totalLoanAmount: 300000,
    lastActivity: "2025-12-23",
    status: "active",
    joinedDate: "2025-09-10",
    monthlyIncome: 55000,
  },
  {
    id: "CUST004",
    name: "Sunita Devi",
    email: "sunita@example.com",
    mobile: "+91 9876543213",
    totalApplications: 1,
    approvedLoans: 0,
    totalLoanAmount: 0,
    lastActivity: "2025-12-22",
    status: "inactive",
    joinedDate: "2025-12-01",
    monthlyIncome: 25000,
  },
  {
    id: "CUST005",
    name: "Vikram Singh",
    email: "vikram@example.com",
    mobile: "+91 9876543214",
    totalApplications: 2,
    approvedLoans: 2,
    totalLoanAmount: 700000,
    lastActivity: "2025-12-21",
    status: "active",
    joinedDate: "2025-08-05",
    monthlyIncome: 75000,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      );
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
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

export function CustomersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobile.includes(searchTerm)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Customer Details</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Loan Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>

                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined:{" "}
                        {new Date(customer.joinedDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Income: {formatCurrency(customer.monthlyIncome)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" />
                        {customer.mobile}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">
                          {customer.totalApplications}
                        </span>{" "}
                        applications
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-green-600">
                          {customer.approvedLoans}
                        </span>{" "}
                        approved
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total: {formatCurrency(customer.totalLoanAmount)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>{getStatusBadge(customer.status)}</TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {new Date(customer.lastActivity).toLocaleDateString()}
                    </span>
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
                                Customer Details - {customer.id}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">
                                    Personal Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Name:
                                      </span>
                                      <span className="font-medium">
                                        {customer.name}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Email:
                                      </span>
                                      <span>{customer.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Mobile:
                                      </span>
                                      <span>{customer.mobile}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Monthly Income:
                                      </span>
                                      <span className="font-medium">
                                        {formatCurrency(customer.monthlyIncome)}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-3">
                                    Loan Summary
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Total Applications:
                                      </span>
                                      <span className="font-medium">
                                        {customer.totalApplications}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Approved Loans:
                                      </span>
                                      <span className="font-medium text-green-600">
                                        {customer.approvedLoans}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Total Loan Amount:
                                      </span>
                                      <span className="font-medium">
                                        {formatCurrency(
                                          customer.totalLoanAmount
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Approval Rate:
                                      </span>
                                      <span className="font-medium">
                                        {customer.totalApplications > 0
                                          ? `${(
                                              (customer.approvedLoans /
                                                customer.totalApplications) *
                                              100
                                            ).toFixed(1)}%`
                                          : "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-3">
                                  Account Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Customer ID:
                                    </span>
                                    <span className="font-medium">
                                      {customer.id}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Status:
                                    </span>
                                    {getStatusBadge(customer.status)}
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Joined Date:
                                    </span>
                                    <span>
                                      {new Date(
                                        customer.joinedDate
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      Last Activity:
                                    </span>
                                    <span>
                                      {new Date(
                                        customer.lastActivity
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Customer
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
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
    </Card>
  );
}
