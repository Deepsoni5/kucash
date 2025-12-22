import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Target, Eye, Award, Users, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Kucash | Leading Financial Services Provider in India",
  description:
    "Learn about Kucash, your trusted partner for instant loans. RBI registered NBFC with a mission to empower businesses and individuals with quick financial solutions.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                <span className="text-foreground">About </span>
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Kucash</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
                {
                  "We are on a mission to democratize access to financial services and empower every Indian with instant, hassle-free loans."
                }
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=600&fit=crop&q=80"
                  alt="Modern office workspace"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {
                    "Founded with a vision to bridge the gap between traditional banking and modern financial needs, Kucash has emerged as a leading fintech platform in India. We understand that time is money, and our streamlined digital processes ensure you get the funds you need, when you need them."
                  }
                </p>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {
                    "As an RBI registered NBFC, we combine regulatory compliance with technological innovation to offer secure, transparent, and customer-centric financial solutions. Our team of financial experts and technology professionals work tirelessly to make loans accessible to everyone - from individuals to large enterprises."
                  }
                </p>
                <Link href="#apply">
                  <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent">
                    Start Your Journey
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="p-10 rounded-3xl bg-gradient-to-br from-primary to-accent text-white">
                <Target className="w-12 h-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="leading-relaxed text-white/90">
                  {
                    "To provide instant, transparent, and affordable financial solutions that empower individuals and businesses to achieve their dreams without financial barriers."
                  }
                </p>
              </div>
              <div className="p-10 rounded-3xl bg-card border-2 border-primary/20">
                <Eye className="w-12 h-12 mb-6 text-primary" />
                <h3 className="text-2xl font-bold mb-4 text-foreground">Our Vision</h3>
                <p className="leading-relaxed text-muted-foreground">
                  {
                    "To become India's most trusted and customer-centric financial services platform, setting new standards in speed, transparency, and customer satisfaction."
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Our Core Values</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                {"The principles that guide everything we do"}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Trust & Security",
                  description: "Your data and money are safe with us. We follow the highest security standards.",
                },
                {
                  icon: Users,
                  title: "Customer First",
                  description: "Every decision we make prioritizes your needs and satisfaction.",
                },
                {
                  icon: TrendingUp,
                  title: "Innovation",
                  description: "We constantly innovate to make financial services faster and easier.",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  description: "We strive for excellence in every interaction and transaction.",
                },
              ].map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="text-center p-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 lg:py-32 bg-primary">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
              <div>
                <div className="text-5xl font-bold mb-2">₹5000+ Cr</div>
                <div className="text-white/90">Total Disbursed</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50,000+</div>
                <div className="text-white/90">Happy Customers</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100+</div>
                <div className="text-white/90">Cities Covered</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">4.8★</div>
                <div className="text-white/90">Customer Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground text-balance">
                {"Ready to Experience the Kucash Difference?"}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                {"Join thousands of satisfied customers and get your loan approved today."}
              </p>
              <Link href="/#apply">
                <Button size="lg" className="rounded-full bg-gradient-to-r from-primary to-accent text-lg px-8">
                  Apply for Loan Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
