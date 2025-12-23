"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                K
              </div>
              <span className="text-2xl font-bold text-primary">Kucash</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {
                "Your trusted partner for quick and hassle-free loans. Empowering dreams with instant financial solutions."
              }
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Loan Products */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Loan Products</h3>
            <ul className="space-y-3">
              <li className="text-muted-foreground">Personal Loan</li>
              <li className="text-muted-foreground">Business Loan</li>
              <li className="text-muted-foreground">Loan Against Property</li>
              <li className="text-muted-foreground">Vehicle Loan</li>
              <li className="text-muted-foreground">Invoice Discounting</li>
              <li className="text-muted-foreground">Working Capital Loan</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <a href="mailto:wecare@kucash.in" className="hover:text-primary transition-colors">
                  wecare@kucash.in
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <a href="tel:+919008367818" className="hover:text-primary transition-colors">
                  +91 9008367818
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <span className="text-sm leading-relaxed">
                  {
                    "NO:8, K.NO.13-3, 28TH CROSS, HULIMAVU MAIN ROAD, Hulimavu, Bangalore South, Bangalore - 560076, Karnataka"
                  }
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center sm:text-left">
            © {currentYear} Kucash. All rights reserved. | LSP loan service provider
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
