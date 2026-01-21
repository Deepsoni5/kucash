"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import {
  Eye,
  Download,
  DownloadCloud,
  FileText,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Hash,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreHorizontal,
  Image as ImageIcon,
  FileImage,
  Briefcase,
  Home,
  Receipt,
  Banknote,
  FolderOpen,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { updateLoanStatus } from "@/app/actions/loan-actions";
import { toast } from "sonner";

interface LoanApplication {
  id: string;
  loan_id: string;
  created_at: string;
  updated_at: string;
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
  status: "pending" | "approved" | "rejected";
  referral_code?: string;
  agent_id?: string;
  agent_commission: string;
  user_id: string;
  pan_card_url?: string;
  aadhar_card_url?: string;
  income_proof_url?: string;
  address_proof_url?: string;
  salary_slips_url?: string;
  bank_statements_url?: string;
  other_documents?: string;
  processed_by?: string;
  processed_at?: string;
  rejection_reason?: string;
  approval_notes?: string;
  approved_amount?: string;
  approved_tenure?: number;
  interest_rate?: string;
  processing_fee?: string;
  disbursed_amount?: string;
  disbursed_at?: string;
  disbursement_reference?: string;
  application_source: string;
  ip_address?: string;
  user_agent?: string;
  users?: {
    full_name: string;
    email: string;
    mobile_number?: string;
    photo_url?: string;
  };
  agent_user?: {
    full_name: string;
    email: string;
    mobile_number?: string;
    agent_id?: string;
  };
}

interface LoansTableProps {
  loans: LoanApplication[];
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const loanTypeColors = {
  personal: "bg-blue-100 text-blue-800 border-blue-200",
  business: "bg-purple-100 text-purple-800 border-purple-200",
  home: "bg-green-100 text-green-800 border-green-200",
  car: "bg-orange-100 text-orange-800 border-orange-200",
};

export function LoansTable({ loans }: LoansTableProps) {
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loanTypeFilter, setLoanTypeFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [amountFilter, setAmountFilter] = useState<string>("all");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (
    loanId: string,
    newStatus: "pending" | "approved" | "rejected"
  ) => {
    setIsUpdating(true);
    try {
      const result = await updateLoanStatus(loanId, newStatus);
      if (result.success) {
        toast.success(`Loan status updated to ${newStatus}`);
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to update loan status");
      }
    } catch (error) {
      toast.error("An error occurred while updating loan status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter and search logic
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch =
        loan.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loan_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.phone.includes(searchTerm) ||
        loan.pan_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (loan.agent_id &&
          loan.agent_id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || loan.status === statusFilter;
      const matchesLoanType =
        loanTypeFilter === "all" || loan.loan_type === loanTypeFilter;

      const matchesDate = (() => {
        if (dateFilter === "all") return true;
        const loanDate = new Date(loan.created_at);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - loanDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case "today":
            return daysDiff === 0;
          case "week":
            return daysDiff <= 7;
          case "month":
            return daysDiff <= 30;
          case "quarter":
            return daysDiff <= 90;
          default:
            return true;
        }
      })();

      const matchesAmount = (() => {
        if (amountFilter === "all") return true;
        const amount = parseFloat(loan.loan_amount);
        switch (amountFilter) {
          case "small":
            return amount <= 500000;
          case "medium":
            return amount > 500000 && amount <= 2000000;
          case "large":
            return amount > 2000000 && amount <= 5000000;
          case "xlarge":
            return amount > 5000000;
          default:
            return true;
        }
      })();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLoanType &&
        matchesDate &&
        matchesAmount
      );
    });
  }, [
    loans,
    searchTerm,
    statusFilter,
    loanTypeFilter,
    dateFilter,
    amountFilter,
  ]);

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleWhatsAppContact = (loan: LoanApplication) => {
    const phoneNumber = loan.users?.mobile_number || loan.phone;
    if (!phoneNumber) {
      toast.error("No phone number available for this applicant");
      return;
    }

    const cleanNumber = phoneNumber.replace(/[^\d+]/g, "");
    const message = `Hello ${loan.full_name}, I'm contacting you regarding your loan application ${loan.loan_id}. Please let me know if you have any questions.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const getFileExtension = (url: string) => {
    // Try to get extension from URL path
    const path = url.split("?")[0];
    const extension = path.split(".").pop()?.toLowerCase();
    
    // Check if it's a known image or PDF extension
    if (["jpg", "jpeg", "png", "gif", "webp", "pdf"].includes(extension || "")) {
      return extension;
    }
    
    // Fallback based on content type checking if possible, or default to jpg for images
    // If it looks like a cloudinary URL without extension, it might be an image
    return "jpg";
  };

  const isPdf = (url: string) => {
    return getFileExtension(url) === "pdf";
  };

  const renderDocumentPreview = (url: string, alt: string) => {
    if (isPdf(url)) {
      return (
        <div className="w-full h-20 bg-gray-100 flex flex-col items-center justify-center rounded mb-2 text-gray-500">
           <FileText className="w-8 h-8 mb-1" />
           <span className="text-xs">PDF Document</span>
        </div>
      );
    }
    
    return (
      <CloudinaryImage
        src={url}
        alt={alt}
        width={100}
        height={60}
        className="w-full h-20 object-cover rounded mb-2"
      />
    );
  };

  const downloadDocument = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success(`Downloaded ${filename}`);
    } catch (error) {
      toast.error(`Failed to download ${filename}`);
    }
  };

  const downloadAllDocuments = async (loan: LoanApplication) => {
    const documents = [
      {
        url: loan.pan_card_url,
        name: `pan_${loan.full_name.replace(/\s+/g, "_")}`,
      },
      {
        url: loan.aadhar_card_url,
        name: `aadhar_${loan.full_name.replace(/\s+/g, "_")}`,
      },
      {
        url: loan.income_proof_url,
        name: `income_${loan.full_name.replace(/\s+/g, "_")}`,
      },
      {
        url: loan.address_proof_url,
        name: `address_${loan.full_name.replace(/\s+/g, "_")}`,
      },
      {
        url: loan.salary_slips_url,
        name: `salary_${loan.full_name.replace(/\s+/g, "_")}`,
      },
      {
        url: loan.bank_statements_url,
        name: `bank_${loan.full_name.replace(/\s+/g, "_")}`,
      },
    ].filter((doc) => doc.url);

    for (const doc of documents) {
      if (doc.url) {
        const extension = getFileExtension(doc.url) || "jpg";
        await downloadDocument(doc.url, `${doc.name}.${extension}`);
        // Add delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    toast.success(
      `Downloaded ${documents.length} documents for ${loan.full_name}`
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Loan ID",
      "Applicant Name",
      "Email",
      "Phone",
      "Loan Type",
      "Amount",
      "Status",
      "Agent ID",
      "Commission",
      "Created Date",
      "Employment Type",
      "Monthly Income",
      "Tenure",
      "Purpose",
    ];

    const csvData = filteredLoans.map((loan) => [
      loan.loan_id,
      loan.full_name,
      loan.email,
      loan.phone,
      loan.loan_type,
      loan.loan_amount,
      loan.status,
      loan.agent_id || "Direct",
      loan.agent_commission,
      formatDate(loan.created_at),
      loan.employment_type,
      loan.monthly_income,
      loan.tenure,
      loan.loan_purpose,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `loan_applications_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Exported loan applications to CSV");
  };

  const renderUserAvatar = (
    loan: LoanApplication,
    size: "sm" | "md" | "lg" = "sm"
  ) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-16 h-16 text-lg",
    };

    const photoUrl = loan.users?.photo_url;
    const name = loan.users?.full_name || loan.full_name;

    if (photoUrl) {
      return (
        <CloudinaryImage
          src={photoUrl}
          alt={name}
          width={size === "sm" ? 32 : size === "md" ? 40 : 64}
          height={size === "sm" ? 32 : size === "md" ? 40 : 64}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center`}
      >
        <span
          className={`${
            sizeClasses[size].split(" ")[2]
          } font-medium text-white`}
        >
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </span>
      </div>
    );
  };

  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-2">No loan applications found</h3>
        <p className="text-muted-foreground">
          Loan applications will appear here once they are submitted.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search loans, names, IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="car">Car</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={amountFilter} onValueChange={setAmountFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Amounts</SelectItem>
              <SelectItem value="small">≤ ₹5L</SelectItem>
              <SelectItem value="medium">₹5L - ₹20L</SelectItem>
              <SelectItem value="large">₹20L - ₹50L</SelectItem>
              <SelectItem value="xlarge"> ₹50L</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => {
              filteredLoans.forEach((loan) => downloadAllDocuments(loan));
            }}
            variant="outline"
            size="sm"
          >
            <DownloadCloud className="w-4 h-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLoans.length} of {loans.length} applications
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {filteredLoans.map((loan) => {
          const StatusIcon = statusIcons[loan.status];
          return (
            <Card key={loan.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {renderUserAvatar(loan, "sm")}
                  <div>
                    <div className="font-medium">{loan.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {loan.loan_id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {loan.email}
                    </div>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLoan(loan)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="text-sm font-bold text-blue-600">
                    {formatCurrency(loan.loan_amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {loan.loan_type}
                  </div>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="text-sm font-bold text-purple-600">
                    {loan.tenure} months
                  </div>
                  <div className="text-xs text-muted-foreground">Tenure</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Select
                    defaultValue={loan.status}
                    onValueChange={(
                      value: "pending" | "approved" | "rejected"
                    ) => handleStatusUpdate(loan.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-yellow-500" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="approved">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Approved
                        </div>
                      </SelectItem>
                      <SelectItem value="rejected">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-3 h-3 text-red-500" />
                          Rejected
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {loan.agent_id && (
                    <Badge variant="outline" className="text-blue-600">
                      {loan.agent_id}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(loan.created_at)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWhatsAppContact(loan)}
                  className="text-green-600 hover:text-green-700"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadAllDocuments(loan)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Docs
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Loan Details</TableHead>
              <TableHead>Amount & Terms</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => {
              const StatusIcon = statusIcons[loan.status];
              return (
                <TableRow key={loan.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {renderUserAvatar(loan, "sm")}
                      <div>
                        <div className="font-medium">{loan.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {loan.loan_id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {loan.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className={
                          loanTypeColors[
                            loan.loan_type as keyof typeof loanTypeColors
                          ] || "bg-gray-100 text-gray-800"
                        }
                      >
                        {loan.loan_type}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {loan.loan_purpose}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {loan.employment_type} •{" "}
                        {formatCurrency(loan.monthly_income)}/mo
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-blue-600">
                        {formatCurrency(loan.loan_amount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {loan.tenure} months
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(loan.created_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={loan.status}
                      onValueChange={(
                        value: "pending" | "approved" | "rejected"
                      ) => handleStatusUpdate(loan.id, value)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-yellow-500" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="approved">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            Approved
                          </div>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <div className="flex items-center gap-2">
                            <XCircle className="w-3 h-3 text-red-500" />
                            Rejected
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {loan.agent_id ? (
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-blue-600">
                          {loan.agent_id}
                        </Badge>
                        {loan.agent_user && (
                          <div className="text-xs text-muted-foreground">
                            {loan.agent_user.full_name}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(loan.agent_commission)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Direct
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {loan.pan_card_url && (
                        <FileImage className="w-3 h-3 text-blue-500" />
                      )}
                      {loan.aadhar_card_url && (
                        <CreditCard className="w-3 h-3 text-green-500" />
                      )}
                      {loan.income_proof_url && (
                        <Receipt className="w-3 h-3 text-purple-500" />
                      )}
                      {loan.address_proof_url && (
                        <Home className="w-3 h-3 text-orange-500" />
                      )}
                      <span className="text-xs text-muted-foreground ml-1">
                        {
                          [
                            loan.pan_card_url,
                            loan.aadhar_card_url,
                            loan.income_proof_url,
                            loan.address_proof_url,
                          ].filter(Boolean).length
                        }{" "}
                        docs
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLoan(loan)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleWhatsAppContact(loan)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>
                            Download Documents
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => downloadAllDocuments(loan)}
                          >
                            <DownloadCloud className="w-4 h-4 mr-2" />
                            All Documents
                          </DropdownMenuItem>
                          {loan.pan_card_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                downloadDocument(
                                  loan.pan_card_url!,
                                  `pan_${loan.full_name.replace(
                                    /\s+/g,
                                    "_"
                                  )}.jpg`
                                )
                              }
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              PAN Card
                            </DropdownMenuItem>
                          )}
                          {loan.aadhar_card_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                downloadDocument(
                                  loan.aadhar_card_url!,
                                  `aadhar_${loan.full_name.replace(
                                    /\s+/g,
                                    "_"
                                  )}.jpg`
                                )
                              }
                            >
                              <FileImage className="w-4 h-4 mr-2" />
                              Aadhar Card
                            </DropdownMenuItem>
                          )}
                          {loan.income_proof_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                downloadDocument(
                                  loan.income_proof_url!,
                                  `income_${loan.full_name.replace(
                                    /\s+/g,
                                    "_"
                                  )}.jpg`
                                )
                              }
                            >
                              <Receipt className="w-4 h-4 mr-2" />
                              Income Proof
                            </DropdownMenuItem>
                          )}
                          {loan.address_proof_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                downloadDocument(
                                  loan.address_proof_url!,
                                  `address_${loan.full_name.replace(
                                    /\s+/g,
                                    "_"
                                  )}.jpg`
                                )
                              }
                            >
                              <Home className="w-4 h-4 mr-2" />
                              Address Proof
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Loan Details Dialog */}
      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
            <DialogDescription>
              Complete information about the loan application
            </DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="flex items-center gap-4">
                {renderUserAvatar(selectedLoan, "lg")}
                <div>
                  <h3 className="text-xl font-medium">
                    {selectedLoan.full_name}
                  </h3>
                  <p className="text-muted-foreground">{selectedLoan.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge
                      variant="outline"
                      className={statusColors[selectedLoan.status]}
                    >
                      {statusIcons[selectedLoan.status] &&
                        React.createElement(statusIcons[selectedLoan.status], {
                          className: "w-3 h-3 mr-1",
                        })}
                      {selectedLoan.status.charAt(0).toUpperCase() +
                        selectedLoan.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-blue-600 font-medium">
                      {selectedLoan.loan_id}
                    </span>
                  </div>
                </div>
              </div>

              {/* Loan Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(selectedLoan.loan_amount)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Loan Amount
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-xl font-bold text-purple-600">
                    {selectedLoan.tenure}
                  </div>
                  <div className="text-sm text-muted-foreground">Months</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Banknote className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedLoan.monthly_income)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Monthly Income
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-xl font-bold text-orange-600">
                    {formatCurrency(selectedLoan.agent_commission)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Commission
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <p className="text-sm">{selectedLoan.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gender</Label>
                  <p className="text-sm capitalize">{selectedLoan.gender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date of Birth</Label>
                  <p className="text-sm">
                    {new Date(selectedLoan.date_of_birth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">PAN Number</Label>
                  <p className="text-sm font-mono">{selectedLoan.pan_number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Aadhar Number</Label>
                  <p className="text-sm font-mono">
                    {selectedLoan.aadhar_number}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Employment Type</Label>
                  <p className="text-sm capitalize">
                    {selectedLoan.employment_type}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-sm font-medium">Current Address</Label>
                  <p className="text-sm">{selectedLoan.current_address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm">{selectedLoan.company_name}</p>
                </div>
              </div>

              {/* Loan Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Loan Type</Label>
                  <Badge
                    variant="outline"
                    className={
                      loanTypeColors[
                        selectedLoan.loan_type as keyof typeof loanTypeColors
                      ]
                    }
                  >
                    {selectedLoan.loan_type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Loan Purpose</Label>
                  <p className="text-sm">{selectedLoan.loan_purpose}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Application Source
                  </Label>
                  <p className="text-sm capitalize">
                    {selectedLoan.application_source}
                  </p>
                </div>
                {selectedLoan.agent_id && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Agent ID</Label>
                      <p className="text-sm font-mono">
                        {selectedLoan.agent_id}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Referral Code
                      </Label>
                      <p className="text-sm font-mono">
                        {selectedLoan.referral_code}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <Label className="text-sm font-medium">Created Date</Label>
                  <p className="text-sm">
                    {formatDate(selectedLoan.created_at)}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div>
                <Label className="text-lg font-medium mb-4 block">
                  Documents
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedLoan.pan_card_url && (
                    <div className="text-center p-4 border rounded-lg">
                      {renderDocumentPreview(selectedLoan.pan_card_url, "PAN Card")}
                      <p className="text-sm font-medium">PAN Card</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() =>
                          downloadDocument(
                            selectedLoan.pan_card_url!,
                            `pan_${selectedLoan.full_name.replace(
                              /\s+/g,
                              "_"
                            )}.${getFileExtension(selectedLoan.pan_card_url!)}`
                          )
                        }
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                  {selectedLoan.aadhar_card_url && (
                    <div className="text-center p-4 border rounded-lg">
                       {renderDocumentPreview(selectedLoan.aadhar_card_url, "Aadhar Card")}
                      <p className="text-sm font-medium">Aadhar Card</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() =>
                          downloadDocument(
                            selectedLoan.aadhar_card_url!,
                            `aadhar_${selectedLoan.full_name.replace(
                              /\s+/g,
                              "_"
                            )}.${getFileExtension(selectedLoan.aadhar_card_url!)}`
                          )
                        }
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                  {selectedLoan.income_proof_url && (
                    <div className="text-center p-4 border rounded-lg">
                      {renderDocumentPreview(selectedLoan.income_proof_url, "Income Proof")}
                      <p className="text-sm font-medium">Income Proof</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() =>
                          downloadDocument(
                            selectedLoan.income_proof_url!,
                            `income_${selectedLoan.full_name.replace(
                              /\s+/g,
                              "_"
                            )}.${getFileExtension(selectedLoan.income_proof_url!)}`
                          )
                        }
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                  {selectedLoan.address_proof_url && (
                    <div className="text-center p-4 border rounded-lg">
                      {renderDocumentPreview(selectedLoan.address_proof_url, "Address Proof")}
                      <p className="text-sm font-medium">Address Proof</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() =>
                          downloadDocument(
                            selectedLoan.address_proof_url!,
                            `address_${selectedLoan.full_name.replace(
                              /\s+/g,
                              "_"
                            )}.${getFileExtension(selectedLoan.address_proof_url!)}`
                          )
                        }
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleWhatsAppContact(selectedLoan)}
                  className="text-green-600 hover:text-green-700"
                >
                  <WhatsAppIcon className="w-4 h-4 mr-2" />
                  Contact Applicant
                </Button>
                <Button
                  variant="outline"
                  onClick={() => downloadAllDocuments(selectedLoan)}
                >
                  <DownloadCloud className="w-4 h-4 mr-2" />
                  Download All Documents
                </Button>
                <Button variant="outline" onClick={() => setSelectedLoan(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
