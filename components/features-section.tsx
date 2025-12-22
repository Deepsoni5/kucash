"use client"

import { Shield, Clock, Percent, FileCheck, Smartphone, Headphones, Award, Users, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "100% Secure & Trusted",
    description: "RBI registered NBFC with bank-grade security and end-to-end encryption for all your data.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Lightning Fast Approval",
    description: "Get instant approval with our AI-powered verification system. Funds in your account within 24 hours.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: Percent,
    title: "Lowest Interest Rates",
    description: "Industry-leading competitive rates starting from just 9% with flexible EMI options.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: FileCheck,
    title: "Minimal Documentation",
    description: "Simple paperwork - just PAN, Aadhaar, and income proof. No hidden charges or complex forms.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Smartphone,
    title: "100% Digital Process",
    description: "Complete online application from the comfort of your home. No branch visits required.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Support",
    description: "Our dedicated team of financial experts is always available to assist you at every step.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Award,
    title: "Highest Approval Rate",
    description: "98% approval rate with flexible eligibility criteria for salaried and self-employed individuals.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Users,
    title: "50,000+ Happy Customers",
    description: "Join thousands of satisfied borrowers who trust Kucash for their financial needs.",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    icon: TrendingUp,
    title: "Flexible Loan Options",
    description: "Choose from multiple loan products tailored to your personal and business requirements.",
    color: "from-amber-500 to-amber-600",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Kucash</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-foreground">The Kucash </span>
            <span className="text-primary">Advantage</span>
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            {
              "Experience the difference with our customer-first approach, cutting-edge technology, and unwavering commitment to your financial success."
            }
          </p>
        </div>

        {/* Features Grid - 3 column layout for better visual */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative p-6 lg:p-8 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                />

                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed text-pretty">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-lg">{"Ready to experience hassle-free lending?"}</p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold transition-all hover:scale-105 shadow-lg"
          >
            Apply Now - Get Instant Approval
          </a>
        </div>
      </div>
    </section>
  )
}
