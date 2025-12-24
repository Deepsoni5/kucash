"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";

interface EMICalculation {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  principalAmount: number;
}

interface LoanAmountCalculation {
  maxLoanAmount: number;
  totalAmount: number;
  totalInterest: number;
}

export default function EMICalculatorPage() {
  const [activeTab, setActiveTab] = useState<"emi" | "amount">("emi");

  // EMI Calculator States
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTenure, setLoanTenure] = useState(120);
  const [calculation, setCalculation] = useState<EMICalculation | null>(null);

  // Loan Amount Calculator States
  const [desiredEMI, setDesiredEMI] = useState(15000);
  const [amountInterestRate, setAmountInterestRate] = useState(12);
  const [amountTenure, setAmountTenure] = useState(120);
  const [amountCalculation, setAmountCalculation] =
    useState<LoanAmountCalculation | null>(null);

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanTenure;

    if (monthlyRate === 0) {
      const emi = principal / totalMonths;
      return {
        emi,
        totalAmount: principal,
        totalInterest: 0,
        principalAmount: principal,
      };
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalAmount = emi * totalMonths;
    const totalInterest = totalAmount - principal;

    return {
      emi,
      totalAmount,
      totalInterest,
      principalAmount: principal,
    };
  };

  const calculateLoanAmount = () => {
    const monthlyRate = amountInterestRate / 12 / 100;
    const totalMonths = amountTenure;

    if (monthlyRate === 0) {
      const maxLoanAmount = desiredEMI * totalMonths;
      return {
        maxLoanAmount,
        totalAmount: maxLoanAmount,
        totalInterest: 0,
      };
    }

    const maxLoanAmount =
      (desiredEMI * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));

    const totalAmount = desiredEMI * totalMonths;
    const totalInterest = totalAmount - maxLoanAmount;

    return {
      maxLoanAmount,
      totalAmount,
      totalInterest,
    };
  };

  useEffect(() => {
    const result = calculateEMI();
    setCalculation(result);
  }, [loanAmount, interestRate, loanTenure]);

  useEffect(() => {
    const result = calculateLoanAmount();
    setAmountCalculation(result);
  }, [desiredEMI, amountInterestRate, amountTenure]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(Math.round(num));
  };

  const pieData =
    activeTab === "emi" && calculation
      ? [
        {
          name: "Principal",
          value: calculation.principalAmount,
        },
        {
          name: "Interest",
          value: calculation.totalInterest,
        },
      ]
      : activeTab === "amount" && amountCalculation
        ? [
          {
            name: "Principal",
            value: amountCalculation.maxLoanAmount,
          },
          {
            name: "Interest",
            value: amountCalculation.totalInterest,
          },
        ]
        : [];

  const COLORS = ["#0066FF", "#00C2FF"]; // Brand primaries

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
            {payload[0].name}: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4 mt-8">
                Smart <span className="text-primary italic">EMI Calculator</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Plan your installments with the KuCash smart EMI calculator and
                apply for a loan today!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <Shield className="h-4 w-4" />
                  Top Digital LSP
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <TrendingUp className="h-4 w-4" />
                  5,000+ Stories of Trust
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  ₹500+ Cr Loans Disbursed
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Tab Navigation */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("emi")}
                  className={`flex-1 px-6 py-4 text-center font-bold transition-all ${activeTab === "emi"
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  Calculate Loan EMI
                </button>
                <button
                  onClick={() => setActiveTab("amount")}
                  className={`flex-1 px-6 py-4 text-center font-bold transition-all ${activeTab === "amount"
                    ? "bg-primary text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  Calculate Loan Amount
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Input Section */}
              <div className="p-6 sm:p-8 border-r border-slate-200 dark:border-slate-800">
                {activeTab === "emi" ? (
                  <div className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      Loan Details
                    </h3>

                    {/* Loan Amount */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                        Loan Amount
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-slate-400 font-bold">
                          ₹1L
                        </span>
                        <Slider
                          value={[loanAmount]}
                          onValueChange={(value) => setLoanAmount(value[0])}
                          max={10000000}
                          min={100000}
                          step={50000}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-400 font-bold">
                          ₹1Cr
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          ₹
                        </span>
                        <Input
                          type="number"
                          value={loanAmount}
                          onChange={(e) =>
                            setLoanAmount(Number(e.target.value))
                          }
                          className="pl-8 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                          placeholder="1000000"
                        />
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                        Interest Rate (p.a.)
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-slate-400 font-bold">
                          5%
                        </span>
                        <Slider
                          value={[interestRate]}
                          onValueChange={(value) => setInterestRate(value[0])}
                          max={30}
                          min={5}
                          step={0.1}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-400 font-bold">
                          30%
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={interestRate}
                          onChange={(e) =>
                            setInterestRate(Number(e.target.value))
                          }
                          step="0.1"
                          className="pr-8 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                          placeholder="12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                        Loan Tenure (Months)
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-slate-400 font-bold">
                          6M
                        </span>
                        <Slider
                          value={[loanTenure]}
                          onValueChange={(value) => setLoanTenure(value[0])}
                          max={360}
                          min={6}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-400 font-bold">
                          360M
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={loanTenure}
                          onChange={(e) =>
                            setLoanTenure(Number(e.target.value))
                          }
                          className="pr-20 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                          placeholder="120"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          Months
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                      EMI Details
                    </h3>

                    {/* Desired EMI */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                        Desired EMI
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-slate-400 font-bold">
                          ₹5K
                        </span>
                        <Slider
                          value={[desiredEMI]}
                          onValueChange={(value) => setDesiredEMI(value[0])}
                          max={100000}
                          min={5000}
                          step={1000}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-400 font-bold">
                          ₹1L
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          ₹
                        </span>
                        <Input
                          type="number"
                          value={desiredEMI}
                          onChange={(e) =>
                            setDesiredEMI(Number(e.target.value))
                          }
                          className="pl-8 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                          placeholder="15000"
                        />
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                        Interest Rate (p.a.)
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-slate-400 font-bold">
                          5%
                        </span>
                        <Slider
                          value={[amountInterestRate]}
                          onValueChange={(value) =>
                            setAmountInterestRate(value[0])
                          }
                          max={30}
                          min={5}
                          step={0.1}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-400 font-bold">
                          30%
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={amountInterestRate}
                          onChange={(e) =>
                            setAmountInterestRate(Number(e.target.value))
                          }
                          step="0.1"
                          className="pr-8 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                          placeholder="12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4">
                      <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">
                        Loan Tenure (Months)
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-slate-400 font-bold">
                          6M
                        </span>
                        <Slider
                          value={[amountTenure]}
                          onValueChange={(value) => setAmountTenure(value[0])}
                          max={360}
                          min={6}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-slate-400 font-bold">
                          360M
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          value={amountTenure}
                          onChange={(e) =>
                            setAmountTenure(Number(e.target.value))
                          }
                          className="pr-20 h-12 text-lg bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                          placeholder="120"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">
                          Months
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-slate-800 dark:to-slate-800">
                <div className="space-y-6">
                  {/* Main Result */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      <span className="text-xs font-bold uppercase tracking-widest">Principal</span>
                      <span className="w-2 h-2 bg-accent rounded-full ml-4"></span>
                      <span className="text-xs font-bold uppercase tracking-widest">Interest</span>
                    </div>

                    <div className="relative w-48 h-48 mx-auto mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {activeTab === "emi" && calculation
                            ? `₹${formatNumber(calculation.emi)}`
                            : activeTab === "amount" && amountCalculation
                              ? `₹${formatNumber(
                                amountCalculation.maxLoanAmount
                              )}`
                              : "₹0"}
                        </div>
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          {activeTab === "emi" ? "Expected EMI" : "Max Amount"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-4">
                    {activeTab === "emi" && calculation ? (
                      <>
                        <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            Principal Amount
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(calculation.principalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            Interest Amount
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(calculation.totalInterest)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-4 bg-primary/10 rounded-xl px-4 mt-2">
                          <span className="text-primary font-bold">
                            Total Payable
                          </span>
                          <span className="font-black text-primary text-xl">
                            {formatCurrency(calculation.totalAmount)}
                          </span>
                        </div>
                      </>
                    ) : activeTab === "amount" && amountCalculation ? (
                      <>
                        <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            Max Loan Amount
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(amountCalculation.maxLoanAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
                          <span className="text-slate-600 dark:text-slate-400 font-medium">
                            Interest Amount
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrency(amountCalculation.totalInterest)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-4 bg-primary/10 rounded-xl px-4 mt-2">
                          <span className="text-primary font-bold">
                            Total Payable
                          </span>
                          <span className="font-black text-primary text-xl">
                            {formatCurrency(amountCalculation.totalAmount)}
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/#apply">
              <Button size="lg" className="rounded-full px-12 py-8 text-xl font-black bg-primary text-white shadow-2xl hover:scale-105 transition-all">
                APPLY NOW <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-500 max-w-4xl mx-auto italic font-medium">
              * This simulator is for illustrative purposes only.
              Actual terms and interest rates will be subject to KuCash underwriting guidelines and regulated lender approvals.
              Key Fact Statement (KFS) will be shared before final disbursal.
            </p>
          </div>
        </div>
      </main>
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
      <WhatsAppButton />
    </>
  );
}
