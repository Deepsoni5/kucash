"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  getWeeklyActivity,
  ActivityData,
} from "@/app/actions/agent-dashboard-actions";

interface WeeklyActivityHeatmapProps {
  agentId: string;
}

export function WeeklyActivityHeatmap({ agentId }: WeeklyActivityHeatmapProps) {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const result = await getWeeklyActivity(agentId);
        setData(result);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [agentId]);

  const getActivityLevel = (
    applications: number,
    calls: number,
    meetings: number
  ) => {
    const total = applications * 3 + calls + meetings * 2; // Weighted activity score
    if (total >= 15) return "high";
    if (total >= 8) return "medium";
    if (total >= 3) return "low";
    return "none";
  };

  const getActivityColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-blue-300";
      default:
        return "bg-gray-200";
    }
  };

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getDateNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
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
            <Calendar className="h-5 w-5" />
            Weekly Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">No activity data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Weekly Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap */}
          <div className="flex justify-between items-center">
            {data.map((day, index) => {
              const level = getActivityLevel(
                day.applications,
                day.calls,
                day.meetings
              );
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="text-xs text-muted-foreground font-medium">
                    {getDayName(day.date)}
                  </div>
                  <div
                    className={`w-8 h-8 rounded-lg ${getActivityColor(
                      level
                    )} flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:scale-110 transition-transform`}
                    title={`${day.applications} applications, ${day.calls} calls, ${day.meetings} meetings`}
                  >
                    {getDateNumber(day.date)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {day.applications + day.calls + day.meetings}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">
                Activity Level:
              </span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-200"></div>
                <span className="text-xs">None</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-300"></div>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-xs">High</span>
              </div>
            </div>
          </div>

          {/* Today's Summary */}
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Today's Activity</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {data[data.length - 1]?.applications || 0}
                </p>
                <p className="text-xs text-muted-foreground">Applications</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">
                  {data[data.length - 1]?.calls || 0}
                </p>
                <p className="text-xs text-muted-foreground">Calls</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">
                  {data[data.length - 1]?.meetings || 0}
                </p>
                <p className="text-xs text-muted-foreground">Meetings</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
