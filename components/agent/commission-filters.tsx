"use client";

import { useState } from "react";
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
import {
  CalendarIcon,
  Filter,
  Download,
  RefreshCw,
  FileSpreadsheet,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import router from "next/router";

export function CommissionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    searchParams.get("dateFrom")
      ? new Date(searchParams.get("dateFrom")!)
      : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    searchParams.get("dateTo")
      ? new Date(searchParams.get("dateTo")!)
      : undefined
  );
  const [status, setStatus] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get("searchTerm") || ""
  );

  const handleReset = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setStatus("all");
    setSearchTerm("");

    router.push("/agent/reports");
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (status !== "all") params.set("status", status);
    if (dateFrom) params.set("dateFrom", dateFrom.toISOString());
    if (dateTo) params.set("dateTo", dateTo.toISOString());
    if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());

    const queryString = params.toString();
    router.push(`/agent/reports${queryString ? `?${queryString}` : ""}`);
  };

  const handleExportPDF = () => {
    toast({
      title: "Export Started",
      description:
        "Your commission report PDF is being generated and will be downloaded shortly.",
    });
    // TODO: Implement PDF export functionality
  };

  const handleExportExcel = () => {
    toast({
      title: "Export Started",
      description:
        "Your commission report Excel file is being generated and will be downloaded shortly.",
    });
    // TODO: Implement Excel export functionality
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Search and Status */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Customer name, email, or loan ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Loan Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">
                    Pending (No Commission Yet)
                  </SelectItem>
                  <SelectItem value="under_review">
                    Under Review (No Commission Yet)
                  </SelectItem>
                  <SelectItem value="approved">
                    Approved (Commission Earned)
                  </SelectItem>
                  <SelectItem value="disbursed">
                    Disbursed (Commission Earned)
                  </SelectItem>
                  <SelectItem value="rejected">
                    Rejected (No Commission)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Commission Status</Label>
              <Select
                onValueChange={(value) => {
                  switch (value) {
                    case "earned":
                      setStatus("approved");
                      break;
                    case "pending":
                      setStatus("pending");
                      break;
                    case "none":
                      setStatus("rejected");
                      break;
                    default:
                      setStatus("all");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All commission types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Commission Types</SelectItem>
                  <SelectItem value="earned">✅ Earned Commission</SelectItem>
                  <SelectItem value="pending">⏳ Pending Commission</SelectItem>
                  <SelectItem value="none">❌ No Commission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quick Filters</Label>
              <Select
                onValueChange={(value) => {
                  const today = new Date();
                  switch (value) {
                    case "today":
                      setDateFrom(today);
                      setDateTo(today);
                      break;
                    case "week":
                      const weekAgo = new Date(today);
                      weekAgo.setDate(today.getDate() - 7);
                      setDateFrom(weekAgo);
                      setDateTo(today);
                      break;
                    case "month":
                      const monthAgo = new Date(today);
                      monthAgo.setMonth(today.getMonth() - 1);
                      setDateFrom(monthAgo);
                      setDateTo(today);
                      break;
                    case "quarter":
                      const quarterAgo = new Date(today);
                      quarterAgo.setMonth(today.getMonth() - 3);
                      setDateFrom(quarterAgo);
                      setDateTo(today);
                      break;
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quick filters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid gap-4 sm:grid-cols-2">
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
                    initialFocus
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
                    initialFocus
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

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleExportExcel}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export Excel
              </Button>

              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
