"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, Download, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { exportApplicationsToCSV } from "@/app/actions/agent-applications-actions";
import { useAuth } from "@/contexts/auth-context";

export function ApplicationsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [status, setStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const search = searchParams.get("search") || "";
    const statusParam = searchParams.get("status") || "all";
    const dateFromParam = searchParams.get("dateFrom");
    const dateToParam = searchParams.get("dateTo");

    setSearchTerm(search);
    setStatus(statusParam);

    if (dateFromParam) {
      setDateFrom(new Date(dateFromParam));
    }

    if (dateToParam) {
      setDateTo(new Date(dateToParam));
    }
  }, [searchParams]);

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (status !== "all") params.set("status", status);
    if (dateFrom) params.set("dateFrom", dateFrom.toISOString().split("T")[0]);
    if (dateTo) params.set("dateTo", dateTo.toISOString().split("T")[0]);

    const queryString = params.toString();
    const url = queryString
      ? `/agent/applications?${queryString}`
      : "/agent/applications";

    console.log("Applying filters:", { searchTerm, status, dateFrom, dateTo });
    console.log("URL:", url);

    router.push(url);
  };

  const handleReset = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setStatus("all");
    setSearchTerm("");
    router.push("/agent/applications");
  };

  const handleExport = async () => {
    if (!user?.agentId) return;

    setIsExporting(true);
    try {
      const filters = {
        search: searchTerm || undefined,
        status: status !== "all" ? status : undefined,
        dateFrom: dateFrom?.toISOString().split("T")[0],
        dateTo: dateTo?.toISOString().split("T")[0],
      };

      const csvContent = await exportApplicationsToCSV(user.agentId, filters);

      if (csvContent) {
        // Create and download CSV file
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `loan-applications-${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error exporting applications:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Status Filter */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Customer name, email, or application ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="default" onClick={handleApplyFilters}>
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>

            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              variant="outline"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
