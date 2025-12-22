"use client"

import { FileText, CheckCircle, Banknote, Clock } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Apply Online",
    description: "Fill our simple application form with basic details in just 5 minutes.",
    step: "01",
  },
  {
    icon: CheckCircle,
    title: "Instant Verification",
    description: "Our AI-powered system verifies your documents instantly and securely.",
    step: "02",
  },
  {
    icon: Clock,
    title: "Quick Approval",
    description: "Get loan approval within hours. We value your time and urgency.",
    step: "03",
  },
  {
    icon: Banknote,
    title: "Receive Funds",
    description: "Amount credited directly to your bank account within 24 hours.",
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
