import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kucash - Fast Personal & Business Loans in India | Instant Approval",
  description:
    "Get instant personal loans, business loans, and loan against property with Kucash. Quick approval, minimal documentation, competitive interest rates. Apply online in minutes.",
  keywords:
    "personal loan, business loan, instant loan, loan against property, quick loan approval, online loan India, Kucash",
  authors: [{ name: "Kucash" }],
  creator: "Kucash",
  publisher: "Kucash",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  metadataBase: new URL("https://kucash.in"),
  openGraph: {
    title: "Kucash - Fast Personal & Business Loans in India",
    description: "Get instant loans with quick approval. Minimal documentation, competitive rates. Apply now!",
    url: "https://kucash.in",
    siteName: "Kucash",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Kucash - Financial Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kucash - Fast Personal & Business Loans",
    description: "Get instant loans with quick approval. Apply now!",
    images: ["https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=630&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=32&h=32&fit=crop",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=16&h=16&fit=crop",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=180&h=180&fit=crop",
  },
  verification: {
    google: "your-google-verification-code",
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://kucash.in" />
        <meta name="theme-color" content="#0066FF" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1f2e" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ScrollToTop />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
