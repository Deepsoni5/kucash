"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { FileText, User, DollarSign, Phone } from "lucide-react";

interface LoanFormData {
  // Customer Details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;

  // Loan Details
  loanAmount: string;
  loanPurpose: string;
  tenure: string;
  monthlyIncome: string;
  employmentType: string;
  companyName: string;

  // Documents
  aadharCard: File | null;
  panCard: File | null;
  salarySlips: File | null;
  bankStatements: File | null;

  // Agent Details (pre-filled)
  agentId: string;
  referralCode: string;
}

export function AgentLoanApplicationForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<LoanFormData>({
    // Customer Details
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",

    // Loan Details
    loanAmount: "",
    loanPurpose: "",
    tenure: "",
    monthlyIncome: "",
    employmentType: "",
    companyName: "",

    // Documents
    aadharCard: null,
    panCard: null,
    salarySlips: null,
    bankStatements: null,

    // Agent Details (pre-filled)
    agentId: user?.agentId || "",
    referralCode: user?.agentId || "",
  });

  const handleInputChange = (field: keyof LoanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: keyof LoanFormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement loan application submission API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Mock delay

      toast({
        title: "Application Submitted!",
        description:
          "The loan application has been submitted successfully. You'll receive updates on the status.",
      });

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        customerAddress: "",
        loanAmount: "",
        loanPurpose: "",
        tenure: "",
        monthlyIncome: "",
        employmentType: "",
        companyName: "",
        aadharCard: null,
        panCard: null,
        salarySlips: null,
        bankStatements: null,
        agentId: user?.agentId || "",
        referralCode: user?.agentId || "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  handleInputChange("customerName", e.target.value)
                }
                placeholder="Enter customer's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  handleInputChange("customerEmail", e.target.value)
                }
                placeholder="Enter customer's email"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Mobile Number *</Label>
              <Input
                id="customerPhone"
                value={formData.customerPhone}
                onChange={(e) =>
                  handleInputChange("customerPhone", e.target.value)
                }
                placeholder="Enter customer's mobile number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type *</Label>
              <Select
                value={formData.employmentType}
                onValueChange={(value) =>
                  handleInputChange("employmentType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaried">Salaried</SelectItem>
                  <SelectItem value="self-employed">Self Employed</SelectItem>
                  <SelectItem value="business">Business Owner</SelectItem>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerAddress">Address *</Label>
            <Textarea
              id="customerAddress"
              value={formData.customerAddress}
              onChange={(e) =>
                handleInputChange("customerAddress", e.target.value)
              }
              placeholder="Enter customer's complete address"
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Loan Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Loan Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
              <Input
                id="loanAmount"
                type="number"
                value={formData.loanAmount}
                onChange={(e) =>
                  handleInputChange("loanAmount", e.target.value)
                }
                placeholder="Enter loan amount"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tenure">Tenure (Months) *</Label>
              <Select
                value={formData.tenure}
                onValueChange={(value) => handleInputChange("tenure", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tenure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="18">18 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                  <SelectItem value="48">48 Months</SelectItem>
                  <SelectItem value="60">60 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) =>
                  handleInputChange("monthlyIncome", e.target.value)
                }
                placeholder="Enter monthly income"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company/Business Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                placeholder="Enter company or business name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanPurpose">Loan Purpose *</Label>
            <Select
              value={formData.loanPurpose}
              onValueChange={(value) => handleInputChange("loanPurpose", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select loan purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Use</SelectItem>
                <SelectItem value="business">Business Expansion</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="medical">Medical Emergency</SelectItem>
                <SelectItem value="home-improvement">
                  Home Improvement
                </SelectItem>
                <SelectItem value="debt-consolidation">
                  Debt Consolidation
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agent Information (Pre-filled) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Agent Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agentId">Agent ID</Label>
              <Input
                id="agentId"
                value={formData.agentId}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">Referral Code</Label>
              <Input
                id="referralCode"
                value={formData.referralCode}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> This application will be submitted under
              your agent ID ({user?.agentId}). The customer will be
              automatically linked to your account.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Aadhar Card *</Label>
              <FileUpload
                onFileSelect={(file) => handleFileChange("aadharCard", file)}
                selectedFile={formData.aadharCard}
                accept="image/*,.pdf"
                maxSize={5}
                placeholder="Upload Aadhar Card"
              />
            </div>

            <div className="space-y-2">
              <Label>PAN Card *</Label>
              <FileUpload
                onFileSelect={(file) => handleFileChange("panCard", file)}
                selectedFile={formData.panCard}
                accept="image/*,.pdf"
                maxSize={5}
                placeholder="Upload PAN Card"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Salary Slips (Last 3 months)</Label>
              <FileUpload
                onFileSelect={(file) => handleFileChange("salarySlips", file)}
                selectedFile={formData.salarySlips}
                accept="image/*,.pdf"
                maxSize={10}
                placeholder="Upload Salary Slips"
              />
            </div>

            <div className="space-y-2">
              <Label>Bank Statements (Last 6 months)</Label>
              <FileUpload
                onFileSelect={(file) =>
                  handleFileChange("bankStatements", file)
                }
                selectedFile={formData.bankStatements}
                accept="image/*,.pdf"
                maxSize={10}
                placeholder="Upload Bank Statements"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
