"use client"

import { TrendingUp, Users, Award, MapPin } from "lucide-react"

const stats = [
  {
    icon: TrendingUp,
    value: "₹5000+ Cr",
    label: "Total Loans Disbursed",
    color: "bg-blue-500",
    iconColor: "text-blue-500",
  },
  {
    icon: Users,
    value: "50,000+",
    label: "Happy Customers",
    color: "bg-teal-500",
    iconColor: "text-teal-500",
  },
  {
    icon: Award,
    value: "4.8/5",
    label: "Customer Rating",
    color: "bg-purple-500",
    iconColor: "text-purple-500",
  },
  {
    icon: MapPin,
    value: "100+",
    label: "Cities Covered",
    color: "bg-orange-500",
    iconColor: "text-orange-500",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="group relative bg-card rounded-3xl p-8 border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Floating icon */}
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Value with enhanced styling */}
                <div className={`text-4xl lg:text-5xl font-bold mb-2 ${stat.iconColor} text-center`}>{stat.value}</div>

                {/* Label */}
                <div className="text-muted-foreground text-center font-medium">{stat.label}</div>

                {/* Subtle glow effect on hover */}
                <div
                  className={`absolute inset-0 rounded-3xl ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-2xl`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
