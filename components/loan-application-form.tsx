"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
  Ticket,
  LogIn,
  UserPlus,
  Lock,
} from "lucide-react";
import {
  submitLoanApplication,
  validateReferralCode,
} from "@/app/actions/loan-application";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface OtherDocument {
  name: string;
  file: File | null;
}

interface LoanApplicationFormProps {
  skipUserPrefill?: boolean;
  agentReferralCode?: string;
}

export function LoanApplicationForm({
  skipUserPrefill = false,
  agentReferralCode,
}: LoanApplicationFormProps) {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY EARLY RETURNS
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState<number>(-1); // -1 means all sections collapsed by default
  const [applicationId, setApplicationId] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
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
    loanAmount: "",
    tenure: "",
    purpose: "",
    employmentType: "",
    monthlyIncome: "",
    companyName: "",
    referralCode: "",
  });

  // Prefill user data when user is available (unless skipUserPrefill is true)
  useEffect(() => {
    if (user && !loading && !skipUserPrefill) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        phone: user.mobileNumber || "",
        fullName: user.fullName || "",
      }));
    }

    // Prefill agent referral code if provided
    if (agentReferralCode) {
      setFormData((prev) => ({
        ...prev,
        referralCode: agentReferralCode,
      }));
    }
  }, [user, loading, skipUserPrefill, agentReferralCode]);

  const [otherDocuments, setOtherDocuments] = useState<OtherDocument[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<{
    panCard: File | null;
    aadharCard: File | null;
    incomeProof: File | null;
    addressProof: File | null;
  }>({
    panCard: null,
    aadharCard: null,
    incomeProof: null,
    addressProof: null,
  });

  // File input refs to clear them after submission
  const panCardRef = useRef<HTMLInputElement>(null);
  const aadharCardRef = useRef<HTMLInputElement>(null);
  const incomeProofRef = useRef<HTMLInputElement>(null);
  const addressProofRef = useRef<HTMLInputElement>(null);

  // Effect to restore file input values when section reopens
  useEffect(() => {
    if (openSection === 5) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        if (selectedFiles.panCard && panCardRef.current) {
          // Create a new FileList with the selected file
          const dt = new DataTransfer();
          dt.items.add(selectedFiles.panCard);
          panCardRef.current.files = dt.files;
        }
        if (selectedFiles.aadharCard && aadharCardRef.current) {
          const dt = new DataTransfer();
          dt.items.add(selectedFiles.aadharCard);
          aadharCardRef.current.files = dt.files;
        }
        if (selectedFiles.incomeProof && incomeProofRef.current) {
          const dt = new DataTransfer();
          dt.items.add(selectedFiles.incomeProof);
          incomeProofRef.current.files = dt.files;
        }
        if (selectedFiles.addressProof && addressProofRef.current) {
          const dt = new DataTransfer();
          dt.items.add(selectedFiles.addressProof);
          addressProofRef.current.files = dt.files;
        }
      }, 0);
    }
  }, [openSection, selectedFiles]);

  const [referralValidation, setReferralValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    error: string | null;
    agentName: string | null;
  }>({
    isValidating: false,
    isValid: null,
    error: null,
    agentName: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate referral code if provided
      if (formData.referralCode && referralValidation.isValid !== true) {
        toast({
          title: "Invalid Referral Code",
          description: "Please enter a valid referral code or leave it empty.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const form = e.target as HTMLFormElement;
      const formDataToSubmit = new FormData(form);

      // Add files from state instead of relying on form elements
      if (selectedFiles.panCard) {
        formDataToSubmit.set("panCard", selectedFiles.panCard);
      }
      if (selectedFiles.aadharCard) {
        formDataToSubmit.set("aadharCard", selectedFiles.aadharCard);
      }
      if (selectedFiles.incomeProof) {
        formDataToSubmit.set("incomeProof", selectedFiles.incomeProof);
      }
      if (selectedFiles.addressProof) {
        formDataToSubmit.set("addressProof", selectedFiles.addressProof);
      }

      // Debug: Log all form data being submitted
      console.log("=== FORM DATA BEING SUBMITTED ===");
      for (const [key, value] of formDataToSubmit.entries()) {
        console.log(`${key}:`, value);
      }
      console.log("=== END FORM DATA ===");

      // Add other documents count and data
      formDataToSubmit.append(
        "otherDocsCount",
        otherDocuments.length.toString()
      );
      otherDocuments.forEach((doc, index) => {
        if (doc.name && doc.file) {
          formDataToSubmit.append(`otherDocName_${index}`, doc.name);
          formDataToSubmit.append(`otherDocFile_${index}`, doc.file);
        }
      });

      const result = await submitLoanApplication(formDataToSubmit);

      if (result.success) {
        setIsSubmitted(true);
        setApplicationId(result.applicationId || "");
        toast({
          title: "Success!",
          description: skipUserPrefill
            ? `Customer loan application has been submitted successfully. Loan ID: ${result.applicationId}`
            : `Your loan application has been submitted successfully. Your Loan ID is: ${result.applicationId}`,
        });
        setTimeout(() => {
          setIsSubmitted(false);
          // Reset form but keep user's prefilled data (unless skipUserPrefill is true)
          setFormData({
            fullName: skipUserPrefill ? "" : user?.fullName || "",
            email: skipUserPrefill ? "" : user?.email || "",
            phone: skipUserPrefill ? "" : user?.mobileNumber || "",
            gender: "",
            dateOfBirth: "",
            currentAddress: "",
            permanentAddress: "",
            panNumber: "",
            aadharNumber: "",
            loanType: "",
            loanAmount: "",
            tenure: "",
            purpose: "",
            employmentType: "",
            monthlyIncome: "",
            companyName: "",
            referralCode: agentReferralCode || "",
          });
          setOtherDocuments([]);
          setSelectedFiles({
            panCard: null,
            aadharCard: null,
            incomeProof: null,
            addressProof: null,
          });
          // Clear file input values
          if (panCardRef.current) panCardRef.current.value = "";
          if (aadharCardRef.current) aadharCardRef.current.value = "";
          if (incomeProofRef.current) incomeProofRef.current.value = "";
          if (addressProofRef.current) addressProofRef.current.value = "";
          setReferralValidation({
            isValidating: false,
            isValid: null,
            error: null,
            agentName: null,
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

  const addOtherDocument = () => {
    setOtherDocuments([...otherDocuments, { name: "", file: null }]);
  };

  const removeOtherDocument = (index: number) => {
    const newDocs = otherDocuments.filter((_, i) => i !== index);
    setOtherDocuments(newDocs);
  };

  const updateOtherDocument = (
    index: number,
    field: "name" | "file",
    value: string | File
  ) => {
    const newDocs = [...otherDocuments];
    newDocs[index] = { ...newDocs[index], [field]: value };
    setOtherDocuments(newDocs);
  };

  // Debounced referral code validation
  const validateReferralCodeDebounced = async (code: string) => {
    if (!code || code.trim() === "") {
      setReferralValidation({
        isValidating: false,
        isValid: null,
        error: null,
        agentName: null,
      });
      return;
    }

    setReferralValidation((prev) => ({ ...prev, isValidating: true }));

    try {
      const result = await validateReferralCode(code);

      if (result.valid) {
        setReferralValidation({
          isValidating: false,
          isValid: true,
          error: null,
          agentName: result.agent?.name || null,
        });
      } else {
        setReferralValidation({
          isValidating: false,
          isValid: false,
          error: result.error || "Invalid referral code",
          agentName: null,
        });
      }
    } catch (error) {
      setReferralValidation({
        isValidating: false,
        isValid: false,
        error: "Unable to validate referral code",
        agentName: null,
      });
    }
  };

  // Debounce referral code validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.referralCode) {
        validateReferralCodeDebounced(formData.referralCode);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [formData.referralCode]);

  // NOW SAFE TO DO CONDITIONAL RENDERING AFTER ALL HOOKS
  // Show loading state while checking authentication
  if (loading) {
    return (
      <section id="apply" className="py-20 lg:py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              <span className="text-foreground">Apply for </span>
              <span className="text-primary">
                {skipUserPrefill ? "Customer Loan" : "Your Loan"}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              {skipUserPrefill
                ? "Fill in customer details and get instant approval. Our team will contact them within 24 hours."
                : "Fill in your details and get instant approval. Our team will contact you within 24 hours."}
            </p>
          </div>
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-12">
              <Loader2 className="w-8 h-8 mx-auto animate-spin mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Show login prompt for non-authenticated users (unless skipUserPrefill is true for agents)
  if (!user && !skipUserPrefill) {
    return (
      <section id="apply" className="py-20 lg:py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              <span className="text-foreground">Apply for </span>
              <span className="text-primary">
                {skipUserPrefill ? "Customer Loan" : "Your Loan"}
              </span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              {skipUserPrefill
                ? "Fill in customer details and get instant approval. Our team will contact them within 24 hours."
                : "Fill in your details and get instant approval. Our team will contact you within 24 hours."}
            </p>
          </div>

          {/* Login Prompt Card */}
          <Card className="max-w-2xl mx-auto text-center border-2 border-primary/20 shadow-2xl">
            <CardContent className="p-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                Please Login to Apply for Loan
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                To ensure the security of your application and provide you with
                the best service, please login to your account or create a new
                one to continue with your loan application.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    <LogIn className="mr-2 h-5 w-5" />
                    Login to Apply
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Create Account
                  </Button>
                </Link>
              </div>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Why do I need to login?</strong>
                  <br />
                  • Secure application process
                  <br />
                  • Track your application status
                  <br />
                  • Faster processing with saved details
                  <br />• Direct communication with our team
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (isSubmitted) {
    return (
      <section id="apply" className="py-20 lg:py-24 bg-background">
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
                {skipUserPrefill
                  ? "Thank you for submitting the customer's application. Our team will review it and contact the customer within 24 hours."
                  : "Thank you for choosing KuCash. Our team will review your application and contact you within 24 hours."}
              </p>
              <p className="text-sm text-muted-foreground">
                {"Application ID: #KC"}
                {applicationId}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="py-20 lg:py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            <span className="text-foreground">Apply for </span>
            <span className="text-primary">
              {skipUserPrefill ? "Customer Loan" : "Your Loan"}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {skipUserPrefill
              ? "Fill in customer details and get instant approval. Our team will contact them within 24 hours."
              : "Fill in your details and get instant approval. Our team will contact you within 24 hours."}
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
              {/* Hidden inputs to ensure all data is submitted regardless of section state */}
              <div className="hidden">
                <input
                  type="hidden"
                  name="currentAddress"
                  value={formData.currentAddress}
                />
                <input
                  type="hidden"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                />
                <input
                  type="hidden"
                  name="loanType"
                  value={formData.loanType}
                />
                <input
                  type="hidden"
                  name="loanAmount"
                  value={formData.loanAmount}
                />
                <input type="hidden" name="tenure" value={formData.tenure} />
                <input type="hidden" name="purpose" value={formData.purpose} />
                <input
                  type="hidden"
                  name="employmentType"
                  value={formData.employmentType}
                />
                <input
                  type="hidden"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                />
                <input
                  type="hidden"
                  name="companyName"
                  value={formData.companyName}
                />
              </div>
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
                      name="fullName"
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
                      <input
                        type="hidden"
                        name="gender"
                        value={formData.gender}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
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
                        name="email"
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
                        name="phone"
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
                        name="panNumber"
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
                      <Label htmlFor="aadharNumber">Aadhaar Number * (Without Space)</Label>
                      <Input
                        id="aadharNumber"
                        name="aadharNumber"
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
                        name="currentAddress"
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
                        name="permanentAddress"
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
                        <input
                          type="hidden"
                          name="loanType"
                          value={formData.loanType}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                        <Input
                          id="loanAmount"
                          name="loanAmount"
                          type="number"
                          placeholder="500000"
                          required
                          value={formData.loanAmount}
                          onChange={(e) =>
                            handleInputChange("loanAmount", e.target.value)
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
                        <input
                          type="hidden"
                          name="tenure"
                          value={formData.tenure}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Loan Purpose *</Label>
                        <Input
                          id="purpose"
                          name="purpose"
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
                            <SelectItem value="freelancer">
                              Freelancer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <input
                          type="hidden"
                          name="employmentType"
                          value={formData.employmentType}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">
                          Monthly Income (₹) *
                        </Label>
                        <Input
                          id="monthlyIncome"
                          name="monthlyIncome"
                          type="number"
                          placeholder="50000"
                          required
                          value={formData.monthlyIncome}
                          onChange={(e) =>
                            handleInputChange("monthlyIncome", e.target.value)
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
                        name="companyName"
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
                            name="panCard"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="cursor-pointer"
                            ref={panCardRef}
                            key={`panCard-${
                              selectedFiles.panCard?.name || "empty"
                            }`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && file.size > 2 * 1024 * 1024) {
                                // 2MB limit
                                toast({
                                  title: "File too large",
                                  description:
                                    "PAN Card file must be less than 2MB",
                                  variant: "destructive",
                                });
                                e.target.value = "";
                              } else {
                                setSelectedFiles((prev) => ({
                                  ...prev,
                                  panCard: file || null,
                                }));
                              }
                            }}
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                        {selectedFiles.panCard && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Selected: {selectedFiles.panCard.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Max size: 2MB
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadharCard">
                          Aadhaar Card * 
                        </Label>
                        <div className="relative">
                          <Input
                            id="aadharCard"
                            name="aadharCard"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="cursor-pointer"
                            ref={aadharCardRef}
                            key={`aadharCard-${
                              selectedFiles.aadharCard?.name || "empty"
                            }`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && file.size > 2 * 1024 * 1024) {
                                // 2MB limit
                                toast({
                                  title: "File too large",
                                  description:
                                    "Aadhaar Card file must be less than 2MB",
                                  variant: "destructive",
                                });
                                e.target.value = "";
                              } else {
                                setSelectedFiles((prev) => ({
                                  ...prev,
                                  aadharCard: file || null,
                                }));
                              }
                            }}
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                        {selectedFiles.aadharCard && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Selected: {selectedFiles.aadharCard.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Max size: 2MB
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="incomeProof">Income Proof *</Label>
                        <div className="relative">
                          <Input
                            id="incomeProof"
                            name="incomeProof"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="cursor-pointer"
                            ref={incomeProofRef}
                            key={`incomeProof-${
                              selectedFiles.incomeProof?.name || "empty"
                            }`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && file.size > 2 * 1024 * 1024) {
                                // 2MB limit
                                toast({
                                  title: "File too large",
                                  description:
                                    "Income Proof file must be less than 2MB",
                                  variant: "destructive",
                                });
                                e.target.value = "";
                              } else {
                                setSelectedFiles((prev) => ({
                                  ...prev,
                                  incomeProof: file || null,
                                }));
                              }
                            }}
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                        {selectedFiles.incomeProof && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Selected: {selectedFiles.incomeProof.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {
                            "(Salary slip, ITR, or Bank Statement) - Max size: 2MB"
                          }
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addressProof">Address Proof</Label>
                        <div className="relative">
                          <Input
                            id="addressProof"
                            name="addressProof"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="cursor-pointer"
                            ref={addressProofRef}
                            key={`addressProof-${
                              selectedFiles.addressProof?.name || "empty"
                            }`}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && file.size > 2 * 1024 * 1024) {
                                // 2MB limit
                                toast({
                                  title: "File too large",
                                  description:
                                    "Address Proof file must be less than 2MB",
                                  variant: "destructive",
                                });
                                e.target.value = "";
                              } else {
                                setSelectedFiles((prev) => ({
                                  ...prev,
                                  addressProof: file || null,
                                }));
                              }
                            }}
                          />
                          <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                        {selectedFiles.addressProof && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Selected: {selectedFiles.addressProof.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Max size: 2MB
                        </p>
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
                          onClick={addOtherDocument}
                          className="rounded-full border-primary/30 text-primary hover:bg-primary/5 gap-2"
                        >
                          <Plus className="w-4 h-4" /> Add More
                        </Button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {otherDocuments.map((doc, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-muted/30 border border-dashed border-border relative group"
                          >
                            <button
                              type="button"
                              onClick={() => removeOtherDocument(idx)}
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
                                  onChange={(e) =>
                                    updateOtherDocument(
                                      idx,
                                      "name",
                                      e.target.value
                                    )
                                  }
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
                                      const file = e.target.files?.[0] || null;
                                      if (file && file.size > 2 * 1024 * 1024) {
                                        // 2MB limit
                                        toast({
                                          title: "File too large",
                                          description:
                                            "File must be less than 2MB",
                                          variant: "destructive",
                                        });
                                        e.target.value = "";
                                        return;
                                      }
                                      updateOtherDocument(
                                        idx,
                                        "file",
                                        file as File
                                      );
                                    }}
                                  />
                                  <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Max size: 2MB
                                </p>
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
                        {agentReferralCode
                          ? "Agent ID (automatically filled)"
                          : "Optional: Enter Agent ID if you have one"}
                      </p>
                    </div>
                  </div>
                  <div className="relative group">
                    <Input
                      id="referralCode"
                      name="referralCode"
                      placeholder="Enter 6 Digit Agent ID (e.g. AKN001)"
                      className={`rounded-2xl border-primary/20 bg-background/50 focus-visible:ring-primary pl-12 pr-12 h-14 text-lg tracking-wider ${
                        referralValidation.isValid === false
                          ? "border-red-300 focus-visible:ring-red-500"
                          : referralValidation.isValid === true
                          ? "border-green-300 focus-visible:ring-green-500"
                          : ""
                      } ${agentReferralCode ? "opacity-60" : ""}`}
                      value={formData.referralCode}
                      disabled={!!agentReferralCode}
                      onChange={(e) =>
                        handleInputChange(
                          "referralCode",
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                    <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40 group-focus-within:text-primary transition-colors" />

                    {/* Validation Status Icon */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      {referralValidation.isValidating && (
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      )}
                      {referralValidation.isValid === true && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {referralValidation.isValid === false && (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Validation Messages */}
                  {referralValidation.error && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {referralValidation.error}
                    </p>
                  )}
                  {referralValidation.isValid === true &&
                    referralValidation.agentName && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Valid referral code - Agent:{" "}
                        {referralValidation.agentName}
                      </p>
                    )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={
                    isSubmitting ||
                    (formData.referralCode.trim() !== "" &&
                      referralValidation.isValid === false)
                  }
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
                {formData.referralCode.trim() !== "" &&
                  referralValidation.isValid === false && (
                    <p className="text-center text-sm text-red-500 mt-2">
                      Please enter a valid referral code or leave it empty
                    </p>
                  )}
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
