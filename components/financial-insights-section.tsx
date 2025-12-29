"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  PieChart,
  AlertCircle,
  CheckCircle,
  Info,
  Banknote,
  CreditCard,
  Wallet,
} from "lucide-react";

export function FinancialInsightsSection() {
  const loanBreakdown = [
    {
      component: "Loan Amount",
      amount: "₹1,00,000",
      notes: "Principal",
      icon: Banknote,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      component: "Processing Fee (2%)",
      amount: "₹2,000",
      notes: "Paid upfront (deducted from loan)",
      icon: CreditCard,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      component: "Net Amount Received",
      amount: "₹98,000",
      notes: "This is the cash you actually get",
      icon: Wallet,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      highlight: true,
    },
    {
      component: "Monthly EMI",
      amount: "₹8,885",
      notes: "Pay this every month for 12 months",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      component: "Total Amount to Repay",
      amount: "₹1,06,619",
      notes: "(EMI × 12 months)",
      icon: Calculator,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      component: "Total Interest Cost",
      amount: "₹6,619",
      notes: "(Total Repayment - Loan Amount)",
      icon: PieChart,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      borderColor: "border-indigo-200 dark:border-indigo-800",
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary/10 dark:bg-primary/20">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <Badge variant="secondary" className="text-sm font-medium">
              Financial Insights
            </Badge>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Loan Breakdown{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Example
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Understanding your loan structure helps you make informed financial
            decisions. Here's a detailed breakdown of how your loan works.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Loan Components */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-border/50 bg-card/80 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Calculator className="w-6 h-6 text-primary" />
                  Loan Components Breakdown
                </CardTitle>
                <p className="text-muted-foreground">
                  Detailed analysis of your ₹1,00,000 loan over 12 months
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {loanBreakdown.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                        item.highlight
                          ? "border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-lg"
                          : `${item.borderColor} ${item.bgColor}`
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl ${item.bgColor} border ${item.borderColor}`}
                        >
                          <Icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {item.component}
                            </h3>
                            <div className={`text-2xl font-bold ${item.color}`}>
                              {item.amount}
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {item.notes}
                          </p>
                        </div>
                      </div>
                      {item.highlight && (
                        <div className="absolute -top-2 -right-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Summary & Visual */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card className="border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Quick Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      You Borrow
                    </span>
                    <span className="font-bold text-foreground">₹1,00,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      You Receive
                    </span>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      ₹98,000
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      You Repay
                    </span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      ₹1,06,619
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">
                      Total Cost
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      ₹8,619
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bars */}
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Principal (94%)</span>
                      <span>₹1,00,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full w-[94%] shadow-lg"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>Interest (6%)</span>
                      <span>₹6,619</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full w-[6%] shadow-lg"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Note */}
            <Card className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50 flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                      Important Note
                    </h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300 leading-relaxed">
                      This is an example calculation. Actual rates may vary
                      based on your credit profile, loan amount, tenure, and
                      lender policies. Use our EMI calculator for personalized
                      estimates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Benefits */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-green-800 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Why Choose KuCash?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Transparent pricing with no hidden fees",
                  "Quick approval within 24 hours",
                  "Competitive interest rates",
                  "Flexible repayment options",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span className="text-sm text-green-700 dark:text-green-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 dark:from-primary/20 dark:via-accent/20 dark:to-secondary/20 border-2 border-primary/20 shadow-xl">
            <CardContent className="py-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Info className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">
                  Ready to Calculate Your EMI?
                </h3>
              </div>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Use our advanced EMI calculator to get personalized loan
                estimates based on your requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/emi-calculator"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Try EMI Calculator
                </a>
                <a
                  href="/#apply"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply for Loan
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
