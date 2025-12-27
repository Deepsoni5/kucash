"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Mock data for the chart - replace with real data
const monthlyData = [
  { month: "Jan", applications: 8, approved: 6, commission: 15000 },
  { month: "Feb", applications: 12, approved: 9, commission: 22500 },
  { month: "Mar", applications: 15, approved: 11, commission: 27500 },
  { month: "Apr", applications: 18, approved: 14, commission: 35000 },
  { month: "May", applications: 22, approved: 16, commission: 40000 },
  { month: "Jun", applications: 25, approved: 19, commission: 47500 },
];

export function PerformanceChart() {
  const maxApplications = Math.max(...monthlyData.map((d) => d.applications));
  const maxCommission = Math.max(...monthlyData.map((d) => d.commission));

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
              {monthlyData.map((data) => (
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
              ))}
            </div>
          </div>

          {/* Commission Chart */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Monthly Commission (₹)
            </h4>
            <div className="space-y-2">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex items-center gap-3">
                  <div className="w-8 text-xs text-muted-foreground">
                    {data.month}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(data.commission / maxCommission) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground w-12 text-right">
                      ₹{(data.commission / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">78%</p>
              <p className="text-xs text-muted-foreground">Approval Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">₹1.87L</p>
              <p className="text-xs text-muted-foreground">Total Commission</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
