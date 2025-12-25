"use client"

import { useEffect, useRef } from "react"

const partners = [
  { name: "Partner 1", logo: "/p1.png" },
  { name: "Partner 2", logo: "/p2.png" },
  { name: "Partner 3", logo: "/p3.png" },
  { name: "Partner 4", logo: "/p4.png" },
  { name: "Partner 6", logo: "/p6.png" },
  { name: "Partner 7", logo: "/p7.png" },
  { name: "Partner 8", logo: "/p8.png" },
  { name: "Partner 9", logo: "/p9.png" },
  { name: "Partner 10", logo: "/p10.png" },
  { name: "Partner 11", logo: "/p11.png" },
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-foreground">Our Lending Partners</h2>
          <p className="text-base lg:text-lg text-muted-foreground text-pretty">
            {"Trusted collaborations with India's leading financial institutions"}
          </p>
        </div>

        <div className="relative mt-8 md:mt-12">
          {/* Fades for smooth entry/exit */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex items-center gap-12 md:gap-24 overflow-x-hidden py-8 md:py-16"
            style={{
              scrollBehavior: "auto",
            }}
          >
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="flex-shrink-0"
              >
                <img
                  src={partner.logo || "/placeholder.svg"}
                  alt={`${partner.name} - KuCash partner`}
                  className="h-12 sm:h-16 md:h-28 w-auto object-contain transition-all duration-700 hover:scale-110 filter drop-shadow-sm hover:drop-shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-muted-foreground">{"Collaborating with 100+ Banks, NBFCs, and Financial Institutions."}</p>
        </div>
      </div>
    </section>
  )
}
