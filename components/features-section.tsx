"use client"

import {
  Layers,
  Zap,
  ShieldCheck,
  Users,
  PhoneOff,
  Network,
  Banknote,
  Award,
} from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "One Application, Multiple Chances",
    description: "Don't run from bank to bank. Submit your details once, and we match you with the right lender for your profile.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Zap,
    title: "Paperless & Fast",
    description: "We prioritize digital-first lenders. Upload your documents from your phone and get approvals faster.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: ShieldCheck,
    title: "Data Security Guarantee",
    description: "We are an ethical Lending Service Provider (LSP). Your data is shared only with the lender you choose, securely and with your consent.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Users,
    title: "Options for Everyone",
    description: "From salaried professionals to business owners, we have a loan product for every need.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: PhoneOff,
    title: "No Spam Guarantee",
    description: "We respect your privacy. You will never receive unsolicited robocalls from us. We speak only when you want us to.",
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: Network,
    title: "The Aggregator Advantage",
    description: "Why apply to one bank when you can access 100? From the powerhouse lending of KuCash.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Banknote,
    title: "Zero Hidden Fees",
    description: "We display the 'All-Inclusive APR.' Processing fees, insurance, and penal charges are visible upfront in your KFS Menu.",
    color: "from-indigo-500 to-indigo-600",
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
            <span className="text-sm font-medium text-primary">Why KuCash</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            <span className="text-foreground">The KuCash </span>
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
                className={`group relative p-6 lg:p-8 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden ${index === features.length - 1 && features.length % 3 === 1 ? "lg:col-start-2" : ""
                  }`}
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
