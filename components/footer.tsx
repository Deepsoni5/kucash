"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

// Custom X (Twitter) Icon Component
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Correct Threads Icon Component
function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 192 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo_k_4.png"
                alt="KuCash Logo"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {
                "Your trusted partner for quick and hassle-free loans. Empowering dreams with instant financial solutions."
              }
            </p>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://www.facebook.com/people/KuCash/61585595589673/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/KuCash_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
                aria-label="Follow us on X (formerly Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/kucash_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/kucash/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@KuCashOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://www.threads.com/@kucash_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary flex items-center justify-center hover:text-primary-foreground transition-colors"
                aria-label="Follow us on Threads"
              >
                <ThreadsIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Loan Products */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Our Products</h3>
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
                <a
                  href="mailto:wecare@kucash.in"
                  className="hover:text-primary transition-colors"
                >
                  wecare@kucash.in
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <a
                  href="tel:+919008367818"
                  className="hover:text-primary transition-colors"
                >
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

        {/* Disclaimer */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="bg-muted/30 rounded-lg p-4 sm:p-6">
            <h4 className="font-semibold text-foreground text-sm mb-2">
              Disclaimer
            </h4>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
              KuCash is a Loan Service Provider (LSP) partnering with
              RBI-regulated Banks and NBFCs. We facilitate loan applications but
              do not directly lend money or hold deposits. Approval, interest
              rates, and disbursal are at the sole discretion of our partner
              lenders. Please read the Key Fact Statement (KFS) carefully before
              signing any agreement.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm text-center sm:text-left leading-relaxed">
            <span className="block sm:inline">
              © {currentYear} KuCash. All rights reserved.
            </span>
            <span className="block sm:inline sm:ml-1">
              | LSP loan service provider
            </span>
            <span className="block sm:inline sm:ml-1">
              <br className="hidden sm:block" />
              Madhyavarti Solutions Private Limited
            </span>
            <span className="block sm:inline sm:ml-1">
              | CIN: U62099KA2024PTC187663
            </span>
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-muted-foreground justify-center sm:justify-end">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="hover:text-primary transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/grievance-redressal"
              className="hover:text-primary transition-colors"
            >
              Grievance Redressal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
