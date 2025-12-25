"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  X,
  Trash2,
  Ticket,
} from "lucide-react";
import {
  submitLoanApplication,
  type LoanApplicationData,
} from "@/app/actions/loan-application";

interface ExtendedLoanApplicationData extends LoanApplicationData {
  otherDocuments?: { name: string; file: File | null }[];
}
import { useToast } from "@/hooks/use-toast";

export function LoanApplicationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState<number>(1);
  const [applicationId, setApplicationId] = useState<string>("");
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<ExtendedLoanApplicationData>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    currentAddress: "",
    permanentAddress: "",
    panNumber: "",
    aadharNumber: "",
    loanType: "",
    loanAmount: 0,
    tenure: "",
    purpose: "",
    employmentType: "",
    monthlyIncome: 0,
    companyName: "",
    referralCode: "",
    otherDocuments: [],
  });

  const handleInputChange = (
    field: keyof ExtendedLoanApplicationData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitLoanApplication(formData);

      if (result.success) {
        setIsSubmitted(true);
        setApplicationId(result.applicationId || "");
        toast({
          title: "Success!",
          description: "Your loan application has been submitted successfully.",
        });
        setTimeout(() => {
          setIsSubmitted(false);
          // Reset form
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            gender: "",
            dateOfBirth: "",
            currentAddress: "",
            permanentAddress: "",
            panNumber: "",
            aadharNumber: "",
            loanType: "",
            loanAmount: 0,
            tenure: "",
            purpose: "",
            employmentType: "",
            monthlyIncome: 0,
            companyName: "",
            referralCode: "",
            otherDocuments: [],
          });
        }, 10000);
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to submit application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? 0 : section);
  };

  if (isSubmitted) {
    return (
      <section id="apply" className="py-20 lg:py-32 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center border-2 border-primary">
            <CardContent className="p-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Application Submitted Successfully!
              </h3>
              <p className="text-muted-foreground mb-6">
                {
                  "Thank you for choosing KuCash. Our team will review your application and contact you within 24 hours."
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {"Application ID: #KC"}
                {applicationId.substring(0, 8).toUpperCase()}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-20 lg:py-32 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            <span className="text-foreground">Apply for </span>
            <span className="text-primary">Your Loan</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {
              "Fill in your details and get instant approval. Our team will contact you within 24 hours."
            }
          </p>
        </div>

        {/* Application Form */}
        <Card className="max-w-4xl mx-auto shadow-2xl border-border/50">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl">Loan Application Form</CardTitle>
            <CardDescription className="text-base">
              {"Please provide accurate information for quick processing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: Personal & Identity Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  Personal & Identity Details
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name (As per PAN) *</Label>
                    <Input
                      id="fullName"
                      placeholder="Enter your full name as it appears on your PAN card"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        required
                        value={formData.gender}
                        onValueChange={(val) =>
                          handleInputChange("gender", val)
                        }
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number *</Label>
                      <Input
                        id="panNumber"
                        placeholder="ABCDE1234F"
                        required
                        className="uppercase"
                        value={formData.panNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "panNumber",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhaar Number *</Label>
                      <Input
                        id="aadharNumber"
                        placeholder="XXXX XXXX XXXX"
                        required
                        value={formData.aadharNumber}
                        onChange={(e) =>
                          handleInputChange("aadharNumber", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Address Details */}
              <div className="border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection(2)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    Address Details
                  </h3>
                  {openSection === 2 ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {openSection === 2 && (
                  <div className="p-4 pt-0 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentAddress">Current Address *</Label>
                      <Input
                        id="currentAddress"
                        placeholder="Enter your current residential address"
                        required
                        value={formData.currentAddress}
                        onChange={(e) =>
                          handleInputChange("currentAddress", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="permanentAddress">
                        Permanent Address *
                      </Label>
                      <Input
                        id="permanentAddress"
                        placeholder="Enter your permanent address as per documents"
                        required
                        value={formData.permanentAddress}
                        onChange={(e) =>
                          handleInputChange("permanentAddress", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Loan Details */}
              <div className="border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection(3)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    Loan Details
                  </h3>
                  {openSection === 3 ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {openSection === 3 && (
                  <div className="p-4 pt-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="loanType">Loan Type *</Label>
                        <Select
                          required
                          value={formData.loanType}
                          onValueChange={(val) =>
                            handleInputChange("loanType", val)
                          }
                        >
                          <SelectTrigger id="loanType">
                            <SelectValue placeholder="Select loan type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">
                              Personal Loan
                            </SelectItem>
                            <SelectItem value="business">
                              Business Loan
                            </SelectItem>
                            <SelectItem value="property">
                              Loan Against Property
                            </SelectItem>
                            <SelectItem value="working-capital">
                              Working Capital
                            </SelectItem>
                            <SelectItem value="invoice">
                              Invoice Discounting
                            </SelectItem>
                            <SelectItem value="msme">MSME Loan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                        <Input
                          id="loanAmount"
                          type="number"
                          placeholder="500000"
                          required
                          value={formData.loanAmount || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "loanAmount",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tenure">Loan Tenure (Months) *</Label>
                        <Select
                          required
                          value={formData.tenure}
                          onValueChange={(val) =>
                            handleInputChange("tenure", val)
                          }
                        >
                          <SelectTrigger id="tenure">
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="36">36 Months</SelectItem>
                            <SelectItem value="48">48 Months</SelectItem>
                            <SelectItem value="60">60 Months</SelectItem>
                            <SelectItem value="72">72 Months</SelectItem>
                            <SelectItem value="84">84 Months</SelectItem>
                            <SelectItem value="120">120 Months</SelectItem>
                            <SelectItem value="180">180 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Loan Purpose *</Label>
                        <Input
                          id="purpose"
                          placeholder="e.g., Business expansion"
                          required
                          value={formData.purpose}
                          onChange={(e) =>
                            handleInputChange("purpose", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Employment & Income */}
              <div className="border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection(4)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    Employment & Income
                  </h3>
                  {openSection === 4 ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {openSection === 4 && (
                  <div className="p-4 pt-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="employmentType">
                          Employment Type *
                        </Label>
                        <Select
                          required
                          value={formData.employmentType}
                          onValueChange={(val) =>
                            handleInputChange("employmentType", val)
                          }
                        >
                          <SelectTrigger id="employmentType">
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salaried">Salaried</SelectItem>
                            <SelectItem value="self-employed">
                              Self Employed
                            </SelectItem>
                            <SelectItem value="business">
                              Business Owner
                            </SelectItem>
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">
                          Monthly Income (₹) *
                        </Label>
                        <Input
                          id="monthlyIncome"
                          type="number"
                          placeholder="50000"
                          required
                          value={formData.monthlyIncome || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "monthlyIncome",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">
                        Company/Business Name *
                      </Label>
                      <Input
                        id="companyName"
                        placeholder="Enter company or business name"
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 5: Document Upload */}
              <div className="border border-border rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection(5)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    Document Upload
                  </h3>
                  {openSection === 5 ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {openSection === 5 && (
                  <div className="p-4 pt-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="panCard">PAN Card *</Label>
                        <div className="relative">
                          <Input
                            id="panCard"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="cursor-pointer"
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadharCard">Aadhaar Card *</Label>
                        <div className="relative">
                          <Input
                            id="aadharCard"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="cursor-pointer"
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="incomeProof">Income Proof *</Label>
                        <div className="relative">
                          <Input
                            id="incomeProof"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="cursor-pointer"
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {"(Salary slip, ITR, or Bank Statement)"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressProof">Address Proof</Label>
                        <div className="relative">
                          <Input
                            id="addressProof"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="cursor-pointer"
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Other Documents */}
                    <div className="space-y-4 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-bold">
                          Other Documents (Optional)
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentDocs = formData.otherDocuments || [];
                            handleInputChange("otherDocuments", [
                              ...currentDocs,
                              { name: "", file: null },
                            ]);
                          }}
                          className="rounded-full border-primary/30 text-primary hover:bg-primary/5 gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add More
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {(formData.otherDocuments || []).map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-muted/30 border border-dashed border-border relative group"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                const currentDocs = [
                                  ...(formData.otherDocuments || []),
                                ];
                                currentDocs.splice(idx, 1);
                                handleInputChange(
                                  "otherDocuments",
                                  currentDocs
                                );
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider font-semibold opacity-70">
                                  Document Name
                                </Label>
                                <Input
                                  placeholder="e.g. GST Certificate"
                                  className="bg-background/50"
                                  value={doc.name}
                                  onChange={(e) => {
                                    const currentDocs = [
                                      ...(formData.otherDocuments || []),
                                    ];
                                    currentDocs[idx].name = e.target.value;
                                    handleInputChange(
                                      "otherDocuments",
                                      currentDocs
                                    );
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider font-semibold opacity-70">
                                  Upload File
                                </Label>
                                <div className="relative">
                                  <Input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="cursor-pointer bg-background/50"
                                    onChange={(e) => {
                                      const currentDocs = [
                                        ...(formData.otherDocuments || []),
                                      ];
                                      currentDocs[idx].file =
                                        e.target.files?.[0] || null;
                                      handleInputChange(
                                        "otherDocuments",
                                        currentDocs
                                      );
                                    }}
                                  />
                                  <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Referral Code - Before Submit */}
              <div className="pt-4 border-t border-border/50">
                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Ticket size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        Referral Code
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Optional: Enter Agent ID if you have one
                      </p>
                    </div>
                  </div>
                  <div className="relative group">
                    <Input
                      id="referralCode"
                      placeholder="Enter 6 Digit Agent ID (e.g. AKN001)"
                      className="rounded-2xl border-primary/20 bg-background/50 focus-visible:ring-primary pl-12 h-14 text-lg tracking-wider"
                      value={formData.referralCode}
                      onChange={(e) =>
                        handleInputChange(
                          "referralCode",
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-lg py-6 hover:scale-105 transition-transform disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {
                    "By submitting, you agree to our Terms & Conditions and Privacy Policy"
                  }
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
