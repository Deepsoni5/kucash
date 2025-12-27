"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AgentStats } from "@/app/actions/agent-dashboard-actions";

interface AgentStatsCardsProps {
  stats: AgentStats;
}

export function AgentStatsCards({ stats }: AgentStatsCardsProps) {
  const statsData = [
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Applications This Month",
      value: stats.applicationsThisMonth.toString(),
      icon: FileText,
      color: "text-green-500",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications.toString(),
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Commission Earned",
      value: `₹${stats.commissionEarned.toLocaleString("en-IN")}`,
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Approved Applications",
      value: stats.approvedApplications.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Rejected Applications",
      value: stats.rejectedApplications.toString(),
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">Total count</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
