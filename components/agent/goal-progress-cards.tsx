"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Users, DollarSign } from "lucide-react";
import { AgentStats } from "@/app/actions/agent-dashboard-actions";

interface GoalProgressCardsProps {
  stats: AgentStats;
}

export function GoalProgressCards({ stats }: GoalProgressCardsProps) {
  // Define monthly goals (these could come from database/settings)
  const goals = {
    applications: 20,
    commission: 100000,
    customers: 15,
    approvalRate: 80,
  };

  const progress = {
    applications: Math.min(
      (stats.applicationsThisMonth / goals.applications) * 100,
      100
    ),
    commission: Math.min(
      (stats.commissionEarned / goals.commission) * 100,
      100
    ),
    customers: Math.min((stats.totalCustomers / goals.customers) * 100, 100),
    approvalRate: Math.min(
      (stats.approvalRate / goals.approvalRate) * 100,
      100
    ),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 100) return "🎉 Goal Achieved!";
    if (percentage >= 75) return "🔥 Almost there!";
    if (percentage >= 50) return "📈 Good progress";
    return "💪 Keep going!";
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Applications Goal */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Monthly Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-700">
              {stats.applicationsThisMonth}
            </span>
            <span className="text-sm text-blue-600">
              / {goals.applications}
            </span>
          </div>
          <Progress value={progress.applications} className="h-2" />
          <p className="text-xs text-blue-600">
            {getProgressStatus(progress.applications)}
          </p>
        </CardContent>
      </Card>

      {/* Commission Goal */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Commission Target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-700">
              ₹{(stats.commissionEarned / 1000).toFixed(0)}k
            </span>
            <span className="text-sm text-green-600">
              / ₹{goals.commission / 1000}k
            </span>
          </div>
          <Progress value={progress.commission} className="h-2" />
          <p className="text-xs text-green-600">
            {getProgressStatus(progress.commission)}
          </p>
        </CardContent>
      </Card>

      {/* Customers Goal */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customer Base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-700">
              {stats.totalCustomers}
            </span>
            <span className="text-sm text-purple-600">/ {goals.customers}</span>
          </div>
          <Progress value={progress.customers} className="h-2" />
          <p className="text-xs text-purple-600">
            {getProgressStatus(progress.customers)}
          </p>
        </CardContent>
      </Card>

      {/* Approval Rate Goal */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Approval Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-orange-700">
              {stats.approvalRate}%
            </span>
            <span className="text-sm text-orange-600">
              / {goals.approvalRate}%
            </span>
          </div>
          <Progress value={progress.approvalRate} className="h-2" />
          <p className="text-xs text-orange-600">
            {getProgressStatus(progress.approvalRate)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
