"use client"

import { UserCheck, ShieldCheck, ListChecks, Banknote } from "lucide-react"

const steps = [
  {
    icon: UserCheck,
    title: "Check Eligibility",
    description: "Enter basic details in our simple form. Our smart algorithm matches your profile with 100+ banking partners instantly.",
    step: "01",
  },
  {
    icon: ShieldCheck,
    title: "Paperless Verification",
    description: "No physical documents required. We use secure Account Aggregator technology to verify your income and KYC safely.",
    step: "02",
  },
  {
    icon: ListChecks,
    title: "Select Your Offer",
    description: "Compare interest rates and terms from top lenders. View the Key Fact Statement (KFS) before you decide.",
    step: "03",
  },
  {
    icon: Banknote,
    title: "Direct Bank Transfer",
    description: "Once e-signed, the loan amount is credited directly from the bank to your account within 24 hours. No wallet, no middleman.",
    step: "04",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-background">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            <span className="text-foreground">How It </span>
            <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {"Get your loan approved in 4 simple steps. Fast, secure, and completely digital process."}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent -translate-x-1/2 z-0" />
                )}

                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <Icon className="w-12 h-12 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
