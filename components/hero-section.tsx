"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden pt-20 md:pt-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-8 lg:py-20">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 animate-slide-in-up">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">RBI Registered NBFC</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              <span className="text-primary">Instant Loans</span>
              <br />
              <span className="text-foreground">That Power Your Dreams</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl text-pretty">
              {
                "Get quick approval on personal loans, business loans, and more. Minimal documentation, competitive rates, and funds in your account within 24 hours."
              }
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
              <div className="flex items-center gap-3 p-3 lg:p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm lg:text-base">Instant</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Approval</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 lg:p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm lg:text-base">Low Interest</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">Starting 9%</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 lg:p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm lg:text-base">100% Secure</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">RBI Approved</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <Link href="#apply" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-base lg:text-lg px-6 lg:px-8 py-5 lg:py-6 hover:scale-105 transition-transform"
                >
                  Apply for Loan
                  <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full rounded-full text-base lg:text-lg px-6 lg:px-8 py-5 lg:py-6 hover:bg-muted bg-transparent"
                >
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Social Proof - Mobile Optimized */}
            <div className="flex flex-wrap items-center gap-4 lg:gap-8 pt-4">
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary">₹5000+ Cr</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Loans Disbursed</div>
              </div>
              <div className="h-8 lg:h-12 w-px bg-border" />
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-accent">50,000+</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="h-8 lg:h-12 w-px bg-border" />
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-primary">4.8★</div>
                <div className="text-xs lg:text-sm text-muted-foreground">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div
            className="relative h-[350px] sm:h-[450px] lg:h-[600px] animate-slide-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=800&h=600&fit=crop&q=80"
                alt="Professional financial consultation and loan approval process"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay Card */}
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-8 lg:left-8 lg:right-8 bg-background/95 backdrop-blur-lg p-4 lg:p-6 rounded-2xl border border-border shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs lg:text-sm text-muted-foreground mb-1">Loan Amount</div>
                    <div className="text-2xl lg:text-3xl font-bold text-primary">₹1L - ₹50L</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs lg:text-sm text-muted-foreground mb-1">Approval Time</div>
                    <div className="text-2xl lg:text-3xl font-bold text-accent">{"< 24hrs"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
