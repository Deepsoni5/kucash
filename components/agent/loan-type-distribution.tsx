"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart } from "lucide-react";
import {
  getLoanTypeDistribution,
  LoanTypeData,
} from "@/app/actions/agent-dashboard-actions";

interface LoanTypeDistributionProps {
  agentId: string;
}

export function LoanTypeDistribution({ agentId }: LoanTypeDistributionProps) {
  const [data, setData] = useState<LoanTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanTypeData = async () => {
      try {
        const result = await getLoanTypeDistribution(agentId);
        setData(result);
      } catch (error) {
        console.error("Error fetching loan type data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanTypeData();
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
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Loan Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Loan Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No loan data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Loan Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis
                dataKey="type"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "count"
                    ? `${value} applications`
                    : formatCurrency(value),
                  name === "count"
                    ? "Applications"
                    : name === "amount"
                    ? "Total Amount"
                    : "Commission",
                ]}
                labelStyle={{ color: "#000" }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Table */}
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
            <span>Type</span>
            <span className="text-right">Count</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Commission</span>
          </div>
          {data.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 text-xs">
              <span className="font-medium">{item.type}</span>
              <span className="text-right">{item.count}</span>
              <span className="text-right">{formatCurrency(item.amount)}</span>
              <span className="text-right text-green-600">
                {formatCurrency(item.commission)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
