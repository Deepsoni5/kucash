"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";

// Mock data - replace with real data from your API
const statsData = {
  totalCustomers: 89,
  activeCustomers: 67,
  inactiveCustomers: 22,
  newThisMonth: 12,
};

export function CustomersStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statsData.totalCustomers}</div>
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
            {statsData.activeCustomers}
          </div>
          <p className="text-xs text-muted-foreground">
            {(
              (statsData.activeCustomers / statsData.totalCustomers) *
              100
            ).toFixed(1)}
            % of total
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
            {statsData.inactiveCustomers}
          </div>
          <p className="text-xs text-muted-foreground">
            {(
              (statsData.inactiveCustomers / statsData.totalCustomers) *
              100
            ).toFixed(1)}
            % of total
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
            {statsData.newThisMonth}
          </div>
          <p className="text-xs text-muted-foreground">
            +
            {(
              (statsData.newThisMonth / statsData.totalCustomers) *
              100
            ).toFixed(1)}
            % growth
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
