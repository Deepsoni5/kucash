"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  Target,
} from "lucide-react";

interface ChartData {
  loansByMonth: Array<{
    month: string;
    applications: number;
    approved: number;
    amount: number;
  }>;
  loansByType: Array<{
    type: string;
    count: number;
    amount: number;
  }>;
  userGrowth: Array<{
    month: string;
    users: number;
    agents: number;
  }>;
  agentPerformance: Array<{
    agent: string;
    applications: number;
    approved: number;
    commission: number;
    status: "pending" | "approved" | "rejected";
  }>;
  commissionTrend: Array<{
    month: string;
    pending: number;
    earned: number;
    rejected: number;
  }>;
}

interface DashboardChartsProps {
  data: ChartData;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMaxValue = (arr: number[]) => Math.max(...arr, 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Loan Applications Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Loan Applications Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.loansByMonth.map((month, index) => {
              const maxApplications = getMaxValue(
                data.loansByMonth.map((m) => m.applications)
              );
              const maxApproved = getMaxValue(
                data.loansByMonth.map((m) => m.approved)
              );
              const applicationWidth =
                (month.applications / maxApplications) * 100;
              const approvedWidth = (month.approved / maxApproved) * 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-blue-600">
                        {month.applications} apps
                      </span>
                      <span className="text-green-600">
                        {month.approved} approved
                      </span>
                      <span className="text-purple-600">
                        {formatCurrency(month.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${applicationWidth}%` }}
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${approvedWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Loan Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Loan Types Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.loansByType.map((type, index) => {
              const maxCount = getMaxValue(
                data.loansByType.map((t) => t.count)
              );
              const width = (type.count / maxCount) * 100;
              const colors = [
                "bg-blue-500",
                "bg-green-500",
                "bg-purple-500",
                "bg-orange-500",
                "bg-red-500",
              ];

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      />
                      <span className="font-medium capitalize">
                        {type.type}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {type.count} loans
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(type.amount)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        colors[index % colors.length]
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.userGrowth.map((month, index) => {
              const maxUsers = getMaxValue(data.userGrowth.map((m) => m.users));
              const maxAgents = getMaxValue(
                data.userGrowth.map((m) => m.agents)
              );
              const userWidth = (month.users / maxUsers) * 100;
              const agentWidth = (month.agents / maxAgents) * 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-blue-600">{month.users} users</span>
                      <span className="text-green-600">
                        {month.agents} agents
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${userWidth}%` }}
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${agentWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Agents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top Performing Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.agentPerformance.slice(0, 5).map((agent, index) => {
              const maxApplications = getMaxValue(
                data.agentPerformance.map((a) => a.applications)
              );
              const width = (agent.applications / maxApplications) * 100;
              const approvalRate =
                agent.applications > 0
                  ? (agent.approved / agent.applications) * 100
                  : 0;

              const getStatusBadge = (status: string) => {
                switch (status) {
                  case "approved":
                    return (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200 text-xs"
                      >
                        Earned
                      </Badge>
                    );
                  case "rejected":
                    return (
                      <Badge variant="destructive" className="text-xs">
                        Rejected
                      </Badge>
                    );
                  default:
                    return (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs"
                      >
                        Pending
                      </Badge>
                    );
                }
              };

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{agent.agent}</div>
                        <div className="text-xs text-muted-foreground">
                          {isNaN(approvalRate)
                            ? "0.0"
                            : approvalRate.toFixed(1)}
                          % approval rate
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {agent.applications} apps
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        {getStatusBadge(agent.status)}
                        <span className="text-xs text-green-600">
                          {formatCurrency(agent.commission)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Commission Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Commission Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.commissionTrend.map((month, index) => {
              const maxAmount = getMaxValue([
                ...data.commissionTrend.map((m) => m.pending),
                ...data.commissionTrend.map((m) => m.earned),
                ...data.commissionTrend.map((m) => m.rejected),
              ]);
              const pendingWidth = (month.pending / maxAmount) * 100;
              const earnedWidth = (month.earned / maxAmount) * 100;
              const rejectedWidth = (month.rejected / maxAmount) * 100;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-yellow-600">
                        {formatCurrency(month.pending)} pending
                      </span>
                      <span className="text-green-600">
                        {formatCurrency(month.earned)} earned
                      </span>
                      <span className="text-red-600">
                        {formatCurrency(month.rejected)} rejected
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${pendingWidth}%` }}
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${earnedWidth}%` }}
                      />
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rejectedWidth}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
