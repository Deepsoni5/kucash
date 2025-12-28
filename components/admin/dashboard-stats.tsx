"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  UserCheck,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Heart,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  Target,
} from "lucide-react";

interface StatsData {
  users: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
    growth: number;
  };
  loans: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
    avgAmount: number;
    thisMonth: number;
    growth: number;
  };
  agents: {
    total: number;
    active: number;
    inactive: number;
  };
  commissions: {
    total: number;
    pending: number;
    earned: number;
    rejected: number;
    thisMonth: number;
  };
  contacts: {
    total: number;
    new: number;
    resolved: number;
    thisMonth: number;
  };
  blog: {
    posts: number;
    published: number;
    drafts: number;
    totalViews: number;
    totalLikes: number;
    categories: number;
  };
}

interface DashboardStatsProps {
  data: StatsData;
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <TrendingUp className="w-4 h-4 text-gray-400" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-green-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.users.total)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getGrowthIcon(data.users.growth)}
              <span className={`text-xs ${getGrowthColor(data.users.growth)}`}>
                {data.users.growth > 0 ? "+" : ""}
                {data.users.growth.toFixed(1)}% from last month
              </span>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                {data.users.active} active
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                {data.users.inactive} inactive
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
        </Card>

        {/* Loans */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loan Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.loans.total)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {getGrowthIcon(data.loans.growth)}
              <span className={`text-xs ${getGrowthColor(data.loans.growth)}`}>
                {data.loans.growth > 0 ? "+" : ""}
                {data.loans.growth.toFixed(1)}% from last month
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-500" />
                {data.loans.pending}
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {data.loans.approved}
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-500" />
                {data.loans.rejected}
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500" />
        </Card>

        {/* Loan Amount */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Loan Amount
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.loans.totalAmount)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Avg: {formatCurrency(data.loans.avgAmount)}
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">
                {data.loans.thisMonth} this month
              </Badge>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
        </Card>

        {/* Agents */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.agents.active}</div>
            <div className="text-xs text-muted-foreground mt-2">
              of {data.agents.total} total agents
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      data.agents.total > 0
                        ? (data.agents.active / data.agents.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
        </Card>
      </div>

      {/* Commission Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Commission */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Commission
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.commissions.total)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {formatCurrency(data.commissions.thisMonth)} this month
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500" />
        </Card>

        {/* Pending Commission */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Commission
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(data.commissions.pending)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Awaiting approval
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
        </Card>

        {/* Earned Commission */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Earned Commission
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.commissions.earned)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              From approved loans
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
        </Card>

        {/* Rejected Commission */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rejected Commission
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data.commissions.rejected)}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              From rejected loans
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500" />
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Contact Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contact Submissions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.contacts.total}</div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  {data.contacts.new} new
                </Badge>
                <Badge variant="default" className="text-xs">
                  {data.contacts.resolved} resolved
                </Badge>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {data.contacts.thisMonth} this month
            </div>
          </CardContent>
        </Card>

        {/* Blog Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Blog Performance
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(data.blog.totalViews)}
            </div>
            <div className="text-xs text-muted-foreground">Total views</div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {data.blog.published} posts
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500" />
                {data.blog.totalLikes} likes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <div className="text-xs text-muted-foreground mt-2">
              All systems running smoothly
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600">Live</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
