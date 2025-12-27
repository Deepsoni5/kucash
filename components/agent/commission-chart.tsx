"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAgentCommissionStats,
  CommissionStats,
} from "@/app/actions/agent-reports-actions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CommissionChartProps {
  agentId: string;
}

export function CommissionChart({ agentId }: CommissionChartProps) {
  const [stats, setStats] = useState<CommissionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getAgentCommissionStats(agentId);
        if (result.success && result.data) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Error fetching commission stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [agentId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Commission Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading chart...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats || !stats.monthlyEarnings.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Commission Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Commission Earnings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your earned and pending commission over the last 6 months
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "earned"
                    ? "Earned Commission"
                    : "Pending Commission",
                ]}
                labelStyle={{ color: "#000" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="earned"
                name="Earned Commission"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pending"
                name="Pending Commission"
                fill="#eab308"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary below chart */}
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Total Earned (6 months)
            </p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(
                stats.monthlyEarnings.reduce(
                  (sum, month) => sum + month.earned,
                  0
                )
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Total Pending (6 months)
            </p>
            <p className="text-lg font-semibold text-yellow-600">
              {formatCurrency(
                stats.monthlyEarnings.reduce(
                  (sum, month) => sum + month.pending,
                  0
                )
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
