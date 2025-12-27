"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Customers",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Applications This Month",
    value: "18",
    change: "+8%",
    changeType: "positive" as const,
    icon: FileText,
    color: "text-green-500",
  },
  {
    title: "Pending Applications",
    value: "5",
    change: "-2",
    changeType: "neutral" as const,
    icon: Clock,
    color: "text-orange-500",
  },
  {
    title: "Commission Earned",
    value: "₹45,230",
    change: "+15%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "text-emerald-500",
  },
  {
    title: "Approved Applications",
    value: "12",
    change: "+3",
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Rejected Applications",
    value: "1",
    change: "0",
    changeType: "neutral" as const,
    icon: XCircle,
    color: "text-red-500",
  },
];

export function AgentStatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
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
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : stat.changeType === "negative"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }
              >
                {stat.change}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
