"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import {
  getAgentCommissionStats,
  CommissionStats as CommissionStatsType,
} from "@/app/actions/agent-reports-actions";

interface CommissionStatsProps {
  agentId: string;
}

export function CommissionStats({ agentId }: CommissionStatsProps) {
  const [stats, setStats] = useState<CommissionStatsType | null>(null);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Failed to load commission stats
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">
            Total Earned
          </CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {formatCurrency(stats.totalEarned)}
          </div>
          <div className="flex items-center text-xs text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            From {stats.approvedApplications} approved loans
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-yellow-800">
            Pending Commission
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">
            {formatCurrency(stats.pendingCommission)}
          </div>
          <div className="flex items-center text-xs text-yellow-600">
            <AlertTriangle className="mr-1 h-3 w-3" />
            From {stats.pendingApplications} pending loans
          </div>
          <div className="mt-2 p-2 bg-yellow-100 rounded-md">
            <p className="text-xs text-yellow-800 font-medium">
              ⚠️ You will receive commission only after loan approval
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applications
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalApplications}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="text-green-600">
              {stats.totalApplications > 0
                ? (
                    (stats.approvedApplications / stats.totalApplications) *
                    100
                  ).toFixed(1)
                : 0}
              % approval rate
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">
            Rejected Applications
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {stats.rejectedApplications}
          </div>
          <div className="flex items-center text-xs text-red-600">
            <span>No commission earned</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
