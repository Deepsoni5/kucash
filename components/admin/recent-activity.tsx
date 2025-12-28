"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MessageSquare,
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  recentLoans: Array<{
    id: string;
    loan_id: string;
    full_name: string;
    loan_type: string;
    loan_amount: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
  }>;
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    status: string;
    created_at: string;
  }>;
  recentUsers: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
  }>;
}

export function RecentActivity({
  recentLoans,
  recentContacts,
  recentUsers,
}: RecentActivityProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "rejected":
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "agent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "moderator":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Loan Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4" />
            Recent Loans
          </CardTitle>
          <Link href="/admin/loans">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLoans.length > 0 ? (
            <>
              {recentLoans.slice(0, 5).map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {loan.full_name}
                      </p>
                      {getStatusIcon(loan.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{loan.loan_type}</span>
                      <span>•</span>
                      <span>{formatCurrency(loan.loan_amount)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(loan.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(loan.status)} text-xs`}
                  >
                    {loan.status}
                  </Badge>
                </div>
              ))}
              <Link href="/admin/loans">
                <Button variant="outline" size="sm" className="w-full">
                  View All Loans
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent loan applications</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Contact Submissions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="w-4 h-4" />
            Recent Contacts
          </CardTitle>
          <Link href="/admin/contacts">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentContacts.length > 0 ? (
            <>
              {recentContacts.slice(0, 5).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {contact.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contact.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(contact.created_at)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(contact.status)} text-xs`}
                  >
                    {contact.status}
                  </Badge>
                </div>
              ))}
              <Link href="/admin/contacts">
                <Button variant="outline" size="sm" className="w-full">
                  View All Contacts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent contact submissions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4" />
            New Users
          </CardTitle>
          <Link href="/admin/users">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentUsers.length > 0 ? (
            <>
              {recentUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {user.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge
                      variant="outline"
                      className={`${getRoleColor(user.role)} text-xs`}
                    >
                      {user.role}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.is_active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/admin/users">
                <Button variant="outline" size="sm" className="w-full">
                  View All Users
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent user registrations</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
