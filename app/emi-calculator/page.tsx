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
import { Calculator, CheckCircle, TrendingUp, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
            color: "#22C55E",
          },
          {
            name: "Interest",
            value: calculation.totalInterest,
            color: "#F59E0B",
          },
        ]
      : activeTab === "amount" && amountCalculation
      ? [
          {
            name: "Principal",
            value: amountCalculation.maxLoanAmount,
            color: "#22C55E",
          },
          {
            name: "Interest",
            value: amountCalculation.totalInterest,
            color: "#F59E0B",
          },
        ]
      : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {data.name}: {formatCurrency(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
                Business Loan EMI Calculator
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Plan your installments with the business loan EMI calculator and
                apply for a business loan today!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-8">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Shield className="h-4 w-4" />
                  Top Digital LSP
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <TrendingUp className="h-4 w-4" />
                  5000+ SMEs Trust Us
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("emi")}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === "emi"
                      ? "bg-blue-600 text-white border-b-2 border-blue-600"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Calculate Loan EMI
                </button>
                <button
                  onClick={() => setActiveTab("amount")}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === "amount"
                      ? "bg-blue-600 text-white border-b-2 border-blue-600"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  Calculate Loan Amount
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Input Section */}
              <div className="p-6 sm:p-8 border-r border-gray-200 dark:border-gray-700">
                {activeTab === "emi" ? (
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Loan Details
                    </h3>

                    {/* Loan Amount */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Loan Amount
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ₹1Cr
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          ₹
                        </span>
                        <Input
                          type="number"
                          value={loanAmount}
                          onChange={(e) =>
                            setLoanAmount(Number(e.target.value))
                          }
                          className="pl-8 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          placeholder="1000000"
                        />
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Interest Rate
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                          className="pr-8 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          placeholder="12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Loan Tenure
                      </Label>
                      <div className="flex items-center gap-3 mb-3"></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
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
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        360M
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        type="number"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                        className="pr-16 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                        placeholder="120"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        Months
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      EMI Details
                    </h3>

                    {/* Desired EMI */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Desired EMI
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ₹1L
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          ₹
                        </span>
                        <Input
                          type="number"
                          value={desiredEMI}
                          onChange={(e) =>
                            setDesiredEMI(Number(e.target.value))
                          }
                          className="pl-8 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          placeholder="15000"
                        />
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Interest Rate
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                          className="pr-8 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          placeholder="12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          %
                        </span>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Loan Tenure
                      </Label>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
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
                          className="pr-16 h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          placeholder="120"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                          Months
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700">
                <div className="space-y-6">
                  {/* Main Result */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm font-medium">Principal</span>
                      <span className="w-2 h-2 bg-orange-400 rounded-full ml-4"></span>
                      <span className="text-sm font-medium">Interest</span>
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
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {activeTab === "emi" && calculation
                            ? `₹${formatNumber(calculation.emi)}`
                            : activeTab === "amount" && amountCalculation
                            ? `₹${formatNumber(
                                amountCalculation.maxLoanAmount
                              )}`
                            : "₹0"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {activeTab === "emi" ? "Your EMI" : "Max Loan Amount"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-4">
                    {activeTab === "emi" && calculation ? (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">
                            Principal Amount
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(calculation.principalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">
                            Interest Amount
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(calculation.totalInterest)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">
                            Total Payable Amount
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(calculation.totalAmount)}
                          </span>
                        </div>
                      </>
                    ) : activeTab === "amount" && amountCalculation ? (
                      <>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">
                            Max Loan Amount
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(amountCalculation.maxLoanAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">
                            Interest Amount
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(amountCalculation.totalInterest)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">
                            Total Payable Amount
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
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

          {/* Disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-4xl mx-auto">
              This calculator provided above are for illustrative purposes only.
              The actual amount and interest rates may vary based on factors
              such as creditworthiness, industry, and business type.
            </p>
          </div>
        </div>
      </main>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
      <WhatsAppButton />
    </>
  );
}
