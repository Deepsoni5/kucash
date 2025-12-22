"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Home, CreditCard, Briefcase, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

const loanProducts = [
  {
    icon: CreditCard,
    title: "Personal Loan",
    description: "Quick personal loans for any purpose - medical, education, travel, or weddings.",
    amount: "₹50K - ₹25L",
    interest: "From 9.99%",
    tenure: "Up to 5 years",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Briefcase,
    title: "Business Loan",
    description: "Fuel your business growth with flexible working capital and expansion loans.",
    amount: "₹1L - ₹50L",
    interest: "From 11%",
    tenure: "Up to 7 years",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Home,
    title: "Loan Against Property",
    description: "Unlock the value of your property with competitive loan against property rates.",
    amount: "₹10L - ₹5Cr",
    interest: "From 8.5%",
    tenure: "Up to 15 years",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Building2,
    title: "Working Capital",
    description: "Maintain smooth business operations with our working capital solutions.",
    amount: "₹5L - ₹1Cr",
    interest: "From 10%",
    tenure: "Up to 3 years",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: TrendingUp,
    title: "Invoice Discounting",
    description: "Convert your unpaid invoices into immediate cash flow for your business.",
    amount: "₹1L - ₹50L",
    interest: "From 12%",
    tenure: "Up to 90 days",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Users,
    title: "MSME Loan",
    description: "Special loan programs designed for micro, small and medium enterprises.",
    amount: "₹50K - ₹25L",
    interest: "From 10.5%",
    tenure: "Up to 5 years",
    color: "from-pink-500 to-pink-600",
  },
]

export function LoanProductsSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {loanProducts.map((product, index) => {
            const Icon = product.icon
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-border/50 hover:border-primary/50 overflow-hidden"
              >
                <CardHeader className="p-4 sm:p-6">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-xl text-foreground">{product.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-muted-foreground text-pretty leading-relaxed">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div>
                      <div className="text-muted-foreground text-[10px] sm:text-xs mb-1">Amount</div>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">{product.amount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] sm:text-xs mb-1">Interest</div>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">{product.interest}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-[10px] sm:text-xs mb-1">Tenure</div>
                      <div className="font-semibold text-foreground text-xs sm:text-sm">{product.tenure}</div>
                    </div>
                  </div>
                  <Link href="#apply">
                    <Button
                      variant="outline"
                      className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent text-xs sm:text-sm py-4 sm:py-5"
                    >
                      Apply Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
