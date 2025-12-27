"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { CustomerStats } from "@/app/actions/agent-customers-actions";

interface CustomersStatsProps {
  stats: CustomerStats;
}

export function CustomersStats({ stats }: CustomersStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            All customers under your agent ID
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Customers
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.activeCustomers}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalCustomers > 0
              ? `${(
                  (stats.activeCustomers / stats.totalCustomers) *
                  100
                ).toFixed(1)}% of total`
              : "0% of total"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inactive Customers
          </CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.inactiveCustomers}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalCustomers > 0
              ? `${(
                  (stats.inactiveCustomers / stats.totalCustomers) *
                  100
                ).toFixed(1)}% of total`
              : "0% of total"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.newThisMonth}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalCustomers > 0
              ? `+${((stats.newThisMonth / stats.totalCustomers) * 100).toFixed(
                  1
                )}% growth`
              : "No growth data"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
