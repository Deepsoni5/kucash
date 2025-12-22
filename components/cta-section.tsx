"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            {"Ready to Get Your Loan Approved?"}
          </h2>
          <p className="text-xl text-white/90 mb-10 text-pretty leading-relaxed">
            {
              "Join thousands of satisfied customers who trusted Kucash for their financial needs. Apply now and get instant approval!"
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#apply">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 rounded-full text-lg px-8 py-6"
              >
                Apply for Loan Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="tel:+919008367818">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary rounded-full text-lg px-8 py-6 bg-transparent"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Us Now
              </Button>
            </Link>
          </div>

          <p className="text-white/80 mt-8 text-sm">
            {"🔒 100% Secure Application • RBI Registered NBFC • Quick Approval"}
          </p>
        </div>
      </div>
    </section>
  )
}
