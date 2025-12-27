"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with real data from your API
const recentApplications = [
  {
    id: "APP001",
    customerName: "Rajesh Kumar",
    amount: "₹2,50,000",
    tenure: "24 months",
    status: "pending",
    appliedDate: "2025-12-25",
    mobile: "+91 9876543210",
  },
  {
    id: "APP002",
    customerName: "Priya Sharma",
    amount: "₹1,80,000",
    tenure: "18 months",
    status: "approved",
    appliedDate: "2025-12-24",
    mobile: "+91 9876543211",
  },
  {
    id: "APP003",
    customerName: "Amit Patel",
    amount: "₹3,00,000",
    tenure: "36 months",
    status: "under_review",
    appliedDate: "2025-12-23",
    mobile: "+91 9876543212",
  },
  {
    id: "APP004",
    customerName: "Sunita Devi",
    amount: "₹1,50,000",
    tenure: "12 months",
    status: "rejected",
    appliedDate: "2025-12-22",
    mobile: "+91 9876543213",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Approved
        </Badge>
      );
    case "under_review":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          Under Review
        </Badge>
      );
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export function RecentApplications() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Applications</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentApplications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {application.customerName}
                  </p>
                  {getStatusBadge(application.status)}
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {application.id} • {application.mobile}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Amount: {application.amount}</span>
                  <span>Tenure: {application.tenure}</span>
                  <span>
                    Applied:{" "}
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Update Status</DropdownMenuItem>
                  <DropdownMenuItem>Contact Customer</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
