"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Eye, MoreHorizontal, Phone, Mail, Search } from "lucide-react";
import { CustomerData } from "@/app/actions/agent-customers-actions";

interface CustomersTableProps {
  customers: CustomerData[];
}

const getStatusBadge = (isActive: boolean) => {
  if (isActive) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    );
  } else {
    return <Badge variant="secondary">Inactive</Badge>;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function CustomersTable({ customers }: CustomersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }
    const url = params.toString()
      ? `/agent/customers?${params.toString()}`
      : "/agent/customers";
    router.push(url);
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push("/agent/customers");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>All Customers ({customers.length})</CardTitle>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" onClick={handleSearch}>
              Search
            </Button>
            {searchTerm && (
              <Button variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Details</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Loan Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.user_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Joined:{" "}
                          {new Date(customer.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3" />
                          {customer.mobile_number}
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
                        <div className="flex gap-3 text-xs">
                          <span className="text-green-600">
                            <span className="font-medium">
                              {customer.approvedLoans}
                            </span>{" "}
                            approved
                          </span>
                          <span className="text-orange-600">
                            <span className="font-medium">
                              {customer.pendingLoans}
                            </span>{" "}
                            pending
                          </span>
                          <span className="text-red-600">
                            <span className="font-medium">
                              {customer.rejectedLoans}
                            </span>{" "}
                            rejected
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Approved: {formatCurrency(customer.totalLoanAmount)}
                        </p>
                        {customer.pendingLoanAmount > 0 && (
                          <p className="text-xs text-orange-600">
                            Pending:{" "}
                            {formatCurrency(customer.pendingLoanAmount)}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(customer.is_active)}</TableCell>

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
                                  Customer Details - {customer.full_name}
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
                                          {customer.full_name}
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
                                        <span>{customer.mobile_number}</span>
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
                                          Pending Loans:
                                        </span>
                                        <span className="font-medium text-orange-600">
                                          {customer.pendingLoans}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Rejected Loans:
                                        </span>
                                        <span className="font-medium text-red-600">
                                          {customer.rejectedLoans}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                          Approved Amount:
                                        </span>
                                        <span className="font-medium text-green-600">
                                          {formatCurrency(
                                            customer.totalLoanAmount
                                          )}
                                        </span>
                                      </div>
                                      {customer.pendingLoanAmount > 0 && (
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">
                                            Pending Amount:
                                          </span>
                                          <span className="font-medium text-orange-600">
                                            {formatCurrency(
                                              customer.pendingLoanAmount
                                            )}
                                          </span>
                                        </div>
                                      )}
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
                                        Status:
                                      </span>
                                      {getStatusBadge(customer.is_active)}
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Joined Date:
                                      </span>
                                      <span>
                                        {new Date(
                                          customer.created_at
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
  );
}
