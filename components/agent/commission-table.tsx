"use client";

import { useEffect, useState } from "react";
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
import { Phone, Mail, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import {
  getAgentCommissionData,
  CommissionData,
} from "@/app/actions/agent-reports-actions";

interface CommissionTableProps {
  agentId: string;
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
  };
}

export function CommissionTable({ agentId, filters }: CommissionTableProps) {
  const [data, setData] = useState<CommissionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAgentCommissionData(agentId, filters);
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching commission data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [agentId, filters]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
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

  const getCommissionStatus = (status: string, commission: number) => {
    if (status === "approved" || status === "disbursed") {
      return (
        <div className="text-right">
          <p className="font-medium text-green-600">
            {formatCurrency(commission)}
          </p>
          <p className="text-xs text-green-600">✅ Earned</p>
        </div>
      );
    } else if (status === "pending" || status === "under_review") {
      return (
        <div className="text-right">
          <p className="font-medium text-yellow-600">
            {formatCurrency(commission)}
          </p>
          <p className="text-xs text-yellow-600 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Pending
          </p>
        </div>
      );
    } else {
      return (
        <div className="text-right">
          <p className="font-medium text-muted-foreground">-</p>
          <p className="text-xs text-red-600">❌ No Commission</p>
        </div>
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalCommissionEarned = data
    .filter((item) => item.status === "approved" || item.status === "disbursed")
    .reduce(
      (sum, item) => sum + parseFloat(item.agent_commission?.toString() || "0"),
      0
    );

  const totalCommissionPending = data
    .filter(
      (item) => item.status === "pending" || item.status === "under_review"
    )
    .reduce(
      (sum, item) => sum + parseFloat(item.agent_commission?.toString() || "0"),
      0
    );

  const totalLoanAmount = data.reduce(
    (sum, item) => sum + parseFloat(item.loan_amount?.toString() || "0"),
    0
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Commission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Applications
                </p>
                <p className="text-2xl font-bold">{data.length}</p>
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

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Commission Earned
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(totalCommissionEarned)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Commission Pending
                </p>
                <p className="text-2xl font-bold text-yellow-700">
                  {formatCurrency(totalCommissionPending)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Table */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed breakdown of your commission from each loan application
          </p>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No commission data found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Customer Details</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Loan Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.loan_id}>
                      <TableCell className="font-medium">
                        {item.loan_id}
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">{item.full_name}</p>
                          <p className="text-xs text-muted-foreground">
                            Monthly Income:{" "}
                            {formatCurrency(
                              parseFloat(item.monthly_income?.toString() || "0")
                            )}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3" />
                            {item.phone}
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
                            {formatCurrency(
                              parseFloat(item.loan_amount?.toString() || "0")
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {item.loan_type} loan
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{getStatusBadge(item.status)}</TableCell>

                      <TableCell>
                        <div className="text-xs space-y-1">
                          <div>
                            Applied:{" "}
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                          {item.processed_at && (
                            <div className="text-green-600">
                              Processed:{" "}
                              {new Date(item.processed_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {getCommissionStatus(
                          item.status,
                          parseFloat(item.agent_commission?.toString() || "0")
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Commission Warning */}
      {totalCommissionPending > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Pending Commission Notice
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  You have{" "}
                  <strong>{formatCurrency(totalCommissionPending)}</strong> in
                  pending commission from{" "}
                  {
                    data.filter(
                      (item) =>
                        item.status === "pending" ||
                        item.status === "under_review"
                    ).length
                  }{" "}
                  applications. Commission will be credited to your account only
                  after the loans are approved and disbursed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
