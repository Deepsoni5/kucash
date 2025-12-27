"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LoanApplication {
  id: string;
  loan_id: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  current_address: string;
  permanent_address: string;
  pan_number: string;
  aadhar_number: string;
  loan_type: string;
  loan_amount: string;
  loan_purpose: string;
  tenure: number;
  employment_type: string;
  monthly_income: string;
  company_name: string;
  status: string;
  created_at: string;
  agent_commission: string;
}

interface LoanDetailsDialogProps {
  loan: LoanApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function LoanDetailsDialog({
  loan,
  open,
  onOpenChange,
}: LoanDetailsDialogProps) {
  if (!loan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Loan Application Details
            {getStatusBadge(loan.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Loan ID</p>
                <p className="font-medium">{loan.loan_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Application Date
                </p>
                <p className="font-medium">
                  {new Date(loan.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{loan.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{loan.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{loan.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium capitalize">{loan.gender}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Loan Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Loan Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Loan Type</p>
                <p className="font-medium capitalize">{loan.loan_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loan Amount</p>
                <p className="font-medium">
                  ₹{parseInt(loan.loan_amount).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tenure</p>
                <p className="font-medium">{loan.tenure} months</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="font-medium">{loan.loan_purpose}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Employment Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Employment Type</p>
                <p className="font-medium capitalize">{loan.employment_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="font-medium">
                  ₹{parseInt(loan.monthly_income).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{loan.company_name}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Address Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Current Address</p>
                <p className="font-medium">{loan.current_address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Permanent Address
                </p>
                <p className="font-medium">{loan.permanent_address}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">PAN Number</p>
                <p className="font-medium">{loan.pan_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Aadhaar Number</p>
                <p className="font-medium">{loan.aadhar_number}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Commission */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Commission Details</h3>
            <div>
              <p className="text-sm text-muted-foreground">Agent Commission</p>
              <p className="font-medium text-green-600">
                ₹{parseInt(loan.agent_commission).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
