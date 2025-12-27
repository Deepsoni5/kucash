"use client";

import { useState, useMemo, useEffect } from "react";
import { CustomerLoan } from "@/app/actions/customer-loan-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  Search,
  Download,
  User,
  Calendar,
  IndianRupee,
} from "lucide-react";
import Link from "next/link";
import { AgentDetailsDialog } from "./agent-details-dialog";
import { LoanDetailsDialog } from "./loan-details-dialog";

interface CustomerLoansTableProps {
  loans: CustomerLoan[];
  initialSearch?: string;
}

export function CustomerLoansTable({
  loans,
  initialSearch = "",
}: CustomerLoansTableProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAgent, setSelectedAgent] = useState<
    CustomerLoan["agent"] | null
  >(null);
  const [selectedLoan, setSelectedLoan] = useState<CustomerLoan | null>(null);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [loanDialogOpen, setLoanDialogOpen] = useState(false);

  // Update search term when initialSearch changes
  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  // Filter and sort loans
  const filteredAndSortedLoans = useMemo(() => {
    let filtered = loans.filter((loan) => {
      const matchesSearch =
        loan.loan_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loan_purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || loan.status === statusFilter;
      const matchesType = typeFilter === "all" || loan.loan_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort loans
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof CustomerLoan];
      let bValue: any = b[sortBy as keyof CustomerLoan];

      if (sortBy === "loan_amount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === "created_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [loans, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);
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

  const exportToCSV = () => {
    const headers = [
      "Application ID",
      "Loan Type",
      "Amount",
      "Status",
      "Applied Date",
      "Purpose",
      "Employment Type",
      "Monthly Income",
    ];

    const csvData = filteredAndSortedLoans.map((loan) => [
      loan.loan_id,
      loan.loan_type.replace("_", " "),
      loan.loan_amount,
      loan.status,
      new Date(loan.created_at).toLocaleDateString(),
      loan.loan_purpose || "",
      loan.employment_type || "",
      loan.monthly_income || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loan-applications-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueStatuses = [...new Set(loans.map((loan) => loan.status))];
  const uniqueTypes = [...new Set(loans.map((loan) => loan.loan_type))];

  const handleViewAgent = (agent: CustomerLoan["agent"]) => {
    if (agent) {
      setSelectedAgent(agent);
      setAgentDialogOpen(true);
    }
  };

  const handleViewLoan = (loan: CustomerLoan) => {
    setSelectedLoan(loan);
    setLoanDialogOpen(true);
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <IndianRupee className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold mb-2">
          No loan applications found
        </h3>
        <p className="text-muted-foreground mb-4">
          You haven't applied for any loans yet. Start your financial journey
          today!
        </p>
        <Link href="/#apply">
          <Button>Apply for Your First Loan</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by loan type, purpose, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedLoans.length} of {loans.length} applications
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 min-w-[150px]"
                  onClick={() => {
                    if (sortBy === "loan_type") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("loan_type");
                      setSortOrder("asc");
                    }
                  }}
                >
                  Loan Type
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                  onClick={() => {
                    if (sortBy === "loan_amount") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("loan_amount");
                      setSortOrder("desc");
                    }
                  }}
                >
                  Amount
                </TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 min-w-[120px]"
                  onClick={() => {
                    if (sortBy === "created_at") {
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    } else {
                      setSortBy("created_at");
                      setSortOrder("desc");
                    }
                  }}
                >
                  Applied Date
                </TableHead>
                <TableHead className="min-w-[150px]">Purpose</TableHead>
                <TableHead className="min-w-[120px]">Agent</TableHead>
                <TableHead className="text-right min-w-[80px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedLoans.map((loan) => (
                <TableRow key={loan.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium capitalize">
                        {loan.loan_type.replace("_", " ")} Loan
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ID: {loan.loan_id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {formatCurrency(loan.loan_amount)}
                      </p>
                      {loan.monthly_income && (
                        <p className="text-sm text-muted-foreground">
                          Income: {formatCurrency(loan.monthly_income)}/mo
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(loan.status)}>
                      {loan.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(loan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p
                      className="max-w-[200px] truncate"
                      title={loan.loan_purpose}
                    >
                      {loan.loan_purpose || "Not specified"}
                    </p>
                  </TableCell>
                  <TableCell>
                    {loan.agent ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {loan.agent.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {loan.agent.agent_id}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No agent assigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewLoan(loan)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {loan.agent && (
                          <DropdownMenuItem
                            onClick={() => handleViewAgent(loan.agent)}
                          >
                            <User className="mr-2 h-4 w-4" />
                            View Agent
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialogs */}
      <AgentDetailsDialog
        agent={selectedAgent}
        open={agentDialogOpen}
        onOpenChange={setAgentDialogOpen}
      />
      <LoanDetailsDialog
        loan={selectedLoan}
        open={loanDialogOpen}
        onOpenChange={setLoanDialogOpen}
      />
    </div>
  );
}
