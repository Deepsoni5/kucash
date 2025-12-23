"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { submitLoanApplication, type LoanApplicationData } from "@/app/actions/loan-application"
import { useToast } from "@/hooks/use-toast"

export function LoanApplicationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openSection, setOpenSection] = useState<number>(1)
  const [applicationId, setApplicationId] = useState<string>("")
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<LoanApplicationData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    loanType: "",
    loanAmount: 0,
    tenure: "",
    purpose: "",
    employmentType: "",
    monthlyIncome: 0,
    companyName: "",
  })

  const handleInputChange = (field: keyof LoanApplicationData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await submitLoanApplication(formData)

      if (result.success) {
        setIsSubmitted(true)
        setApplicationId(result.applicationId || "")
        toast({
          title: "Success!",
          description: "Your loan application has been submitted successfully.",
        })
        setTimeout(() => {
          setIsSubmitted(false)
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            loanType: "",
            loanAmount: 0,
            tenure: "",
            purpose: "",
            employmentType: "",
            monthlyIncome: 0,
            companyName: "",
          })
        }, 10000)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit application. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSection = (section: number) => {
    setOpenSection(openSection === section ? 0 : section)
  }

  if (isSubmitted) {
    return (
      <section id="apply" className="py-20 lg:py-32 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto text-center border-2 border-primary">
            <CardContent className="p-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Application Submitted Successfully!</h3>
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
    )
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
            {"Fill in your details and get instant approval. Our team will contact you within 24 hours."}
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
              {/* Personal Information - Always Open */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Enter your first name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" placeholder="Enter your last name" required />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Number *</Label>
                    <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" required />
                </div>
              </div>

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
                    Loan Details
                  </h3>
                  {openSection === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {openSection === 2 && (
                  <div className="p-4 pt-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="loanType">Loan Type *</Label>
                        <Select required>
                          <SelectTrigger id="loanType">
                            <SelectValue placeholder="Select loan type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal Loan</SelectItem>
                            <SelectItem value="business">Business Loan</SelectItem>
                            <SelectItem value="property">Loan Against Property</SelectItem>
                            <SelectItem value="working-capital">Working Capital</SelectItem>
                            <SelectItem value="invoice">Invoice Discounting</SelectItem>
                            <SelectItem value="msme">MSME Loan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                        <Input id="loanAmount" type="number" placeholder="500000" required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="tenure">Loan Tenure (Months) *</Label>
                        <Select required>
                          <SelectTrigger id="tenure">
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">12 Months</SelectItem>
                            <SelectItem value="24">24 Months</SelectItem>
                            <SelectItem value="36">36 Months</SelectItem>
                            <SelectItem value="48">48 Months</SelectItem>
                            <SelectItem value="60">60 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purpose">Loan Purpose *</Label>
                        <Input id="purpose" placeholder="e.g., Business expansion" required />
                      </div>
                    </div>
                  </div>
                )}
              </div>

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
                    Employment & Income
                  </h3>
                  {openSection === 3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {openSection === 3 && (
                  <div className="p-4 pt-0 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="employmentType">Employment Type *</Label>
                        <Select required>
                          <SelectTrigger id="employmentType">
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salaried">Salaried</SelectItem>
                            <SelectItem value="self-employed">Self Employed</SelectItem>
                            <SelectItem value="business">Business Owner</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
                        <Input id="monthlyIncome" type="number" placeholder="50000" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company/Business Name *</Label>
                      <Input id="companyName" placeholder="Enter company or business name" required />
                    </div>
                  </div>
                )}
              </div>

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
                    Document Upload
                  </h3>
                  {openSection === 4 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {openSection === 4 && (
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
                        <p className="text-xs text-muted-foreground">{"(Salary slip, ITR, or Bank Statement)"}</p>
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
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-lg py-6 hover:scale-105 transition-transform"
                >
                  Submit Application
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {"By submitting, you agree to our Terms & Conditions and Privacy Policy"}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
