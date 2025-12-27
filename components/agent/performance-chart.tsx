"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  MonthlyPerformance,
  AgentStats,
} from "@/app/actions/agent-dashboard-actions";

interface PerformanceChartProps {
  monthlyData: MonthlyPerformance[];
  stats: AgentStats;
}

export function PerformanceChart({
  monthlyData,
  stats,
}: PerformanceChartProps) {
  const maxApplications = Math.max(
    ...monthlyData.map((d) => d.applications),
    1
  );
  const maxCommission = Math.max(...monthlyData.map((d) => d.commission), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Applications Chart */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Monthly Applications
            </h4>
            <div className="space-y-2">
              {monthlyData.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No data available
                </div>
              ) : (
                monthlyData.map((data) => (
                  <div key={data.month} className="flex items-center gap-3">
                    <div className="w-8 text-xs text-muted-foreground">
                      {data.month}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (data.applications / maxApplications) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground w-8 text-right">
                        {data.applications}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Commission Chart */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Monthly Commission (₹)
            </h4>
            <div className="space-y-2">
              {monthlyData.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No data available
                </div>
              ) : (
                monthlyData.map((data) => (
                  <div key={data.month} className="flex items-center gap-3">
                    <div className="w-8 text-xs text-muted-foreground">
                      {data.month}
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (data.commission / maxCommission) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground w-12 text-right">
                        ₹
                        {data.commission >= 1000
                          ? (data.commission / 1000).toFixed(0) + "k"
                          : data.commission.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats.approvalRate}%
              </p>
              <p className="text-xs text-muted-foreground">Approval Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                ₹
                {stats.commissionEarned >= 100000
                  ? (stats.commissionEarned / 100000).toFixed(1) + "L"
                  : (stats.commissionEarned / 1000).toFixed(0) + "k"}
              </p>
              <p className="text-xs text-muted-foreground">Total Commission</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
