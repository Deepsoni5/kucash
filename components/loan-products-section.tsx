"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Briefcase, Home, Car, Handshake, Users } from "lucide-react";
import Link from "next/link";

const loanProducts = [
  {
    icon: Zap,
    title: "Personal Loan",
    description:
      "Instant Cash, Zero Stress. Get funds for travel, medical needs, or emergencies in 24 hours. No collateral required.",
    amount: "₹50K - 1cr",
    interest: "From 9.99%",
    tenure: "Up to 5 years",
    color: "from-blue-500 to-blue-600",
    cta: "Apply now for instant approval.",
  },
  {
    icon: Briefcase,
    title: "Business Loan",
    description:
      "Fund Your Growth. Need capital to expand? Get hassle-free business loans with minimal documentation and quick disbursal.",
    amount: "₹5L - ₹5cr",
    interest: "From 11%",
    tenure: "Up to 7 years",
    color: "from-teal-500 to-teal-600",
    cta: "Scale your business today.",
  },
  {
    icon: Home,
    title: "Loan Against Property",
    description:
      "Unlock High Value. Get the lowest interest rates by pledging your property. High loan amounts with long repayment tenures (up to 15 years).",
    amount: "₹10L - ₹5Cr",
    interest: "From 8.5%",
    tenure: "Up to 15 years",
    color: "from-purple-500 to-purple-600",
    cta: "Leverage your asset now.",
  },
  {
    icon: Car,
    title: "Vehicle Loan",
    description:
      "Drive Your Dream. Up to 100% on-road financing for new and used vehicles. Instant sanction with affordable EMIs.",
    amount: "₹1L - ₹50L",
    interest: "From 10%",
    tenure: "Up to 7 years",
    color: "from-orange-500 to-orange-600",
    cta: "Get on the road faster.",
  },
  {
    icon: Handshake,
    title: "M&A Advisory & Deal Facilitation",
    description:
      "Turn strategic opportunities into successful transactions. We help businesses identify the right buyers, investors, or partners and facilitate smooth mergers, acquisitions, and strategic exits with confidentiality and precision.",
    amount: "₹5 Cr – ₹500+ Cr",
    interest: "Retainer / Success Fee",
    tenure: "End-to-End Facilitation",
    labels: {
      amount: "DEAL SIZE",
      interest: "ENGAGEMENT",
      tenure: "PROCESS",
    },
    color: "from-green-500 to-green-600",
    cta: "Explore Opportunities",
  },
  {
    icon: Briefcase,
    title: "Working Capital Loan",
    description:
      "Keep Your Business Moving. Cover daily expenses, payroll, and inventory gaps effortlessly. Flexible credit lines designed to smooth out seasonal cash crunches.",
    amount: "₹5L - ₹1Cr",
    interest: "From 10%",
    tenure: "Up to 3 years",
    color: "from-pink-500 to-pink-600",
    cta: "Stabilize your operations today.",
  },
];

export function LoanProductsSection() {
  return (
    <section className="py-20 lg:py-12 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            <span className="text-foreground">Comprehensive </span>
            <span className="text-primary">Loan Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {
              "Tailored financial products designed to meet your personal and business needs with competitive rates and flexible terms."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loanProducts.map((product, index) => {
            const Icon = product.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-border/50 hover:border-primary/50 overflow-hidden"
              >
                <CardHeader className="p-6">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {product.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground text-pretty leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-6 pt-0">
                  <div className="grid grid-cols-3 gap-2 text-sm border-y border-border/50 py-4 mb-4">
                    <div>
                      <div className="text-muted-foreground text-[10px] sm:text-xs mb-1 uppercase tracking-wider font-medium">
                        {product.labels?.amount || "Amount"}
                      </div>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">
                        {product.amount}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] sm:text-xs mb-1 uppercase tracking-wider font-medium">
                        {product.labels?.interest || "Interest"}
                      </div>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">
                        {product.interest}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] sm:text-xs mb-1 uppercase tracking-wider font-medium">
                        {product.labels?.tenure || "Tenure"}
                      </div>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">
                        {product.tenure}
                      </div>
                    </div>
                  </div>
                  <Link href="#apply" className="block">
                    <Button
                      className={`w-full rounded-full bg-gradient-to-r ${product.color} text-white hover:opacity-90 transition-all font-semibold py-6 shadow-md`}
                    >
                      {product.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
