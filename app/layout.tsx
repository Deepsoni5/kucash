import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "KuCash | Instant Loans, Transparent Financing",
  description:
    "KuCash provides instant, transparent, and hassle-free loans in India. Get approved in minutes with our 100% digital process.",
  keywords:
    "personal loan, business loan, instant loan, loan against property, quick loan approval, online loan India, KuCash",
  authors: [{ name: "KuCash" }],
  creator: "KuCash",
  publisher: "KuCash",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  metadataBase: new URL("https://kucash.in"),
  openGraph: {
    title: "KuCash - Fast Personal & Business Loans in India",
    description:
      "Get instant loans with quick approval. Minimal documentation, competitive rates. Apply now!",
    url: "https://kucash.in",
    siteName: "KuCash",
    images: [
      {
        url: "/logo_k_8.png",
        width: 1200,
        height: 630,
        alt: "KuCash - Financial Solutions",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KuCash - Fast Personal & Business Loans",
    description: "Get instant loans with quick approval. Apply now!",
    images: ["/logo_k_8.png"],
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
    icon: "/logo_k_8.png",
    apple: "/logo_k_8.png",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href="https://kucash.in" />
        <meta
          name="theme-color"
          content="#0066FF"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1a1f2e"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ScrollToTop />
            {children}
            <Toaster />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
