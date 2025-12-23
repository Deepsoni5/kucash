"use client"

import { useEffect, useRef } from "react"

const partners = [
  {
    name: "Oxyzo",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=150&fit=crop&q=80",
  },
  {
    name: "Finlander",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=150&fit=crop&q=80",
  },
  {
    name: "FlexiLoans",
    logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=300&h=150&fit=crop&q=80",
  },
  {
    name: "Capital Float",
    logo: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=300&h=150&fit=crop&q=80",
  },
  {
    name: "Lendingkart",
    logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=150&fit=crop&q=80",
  },
  {
    name: "NeoGrowth",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=150&fit=crop&q=80",
  },
  {
    name: "Indifi",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=150&fit=crop&q=80",
  },
  {
    name: "Capital Trust",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=150&fit=crop&q=80",
  },
]

export function PartnersSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollInterval: NodeJS.Timeout

    const startScrolling = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft += 1
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
            scrollContainer.scrollLeft = 0
          }
        }
      }, 20)
    }

    startScrolling()

    return () => clearInterval(scrollInterval)
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-foreground">Our Official Partners</h2>
          <p className="text-base lg:text-lg text-muted-foreground text-pretty">
            {"Trusted collaborations with India's leading financial institutions"}
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-12 overflow-x-hidden"
            style={{
              scrollBehavior: "auto",
            }}
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-52 h-28 rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={`${partner.name} - KuCash partner`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">{"Partnered with 100+ Banks, NBFCs, and Financial Institutions."}</p>
        </div>
      </div>
    </section>
  )
}
