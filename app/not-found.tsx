import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, ArrowLeft, Search, FileQuestion } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Kucash",
  description:
    "The page you're looking for doesn't exist. Return to Kucash homepage or explore our services.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl sm:text-9xl font-bold text-primary/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileQuestion className="w-16 h-16 sm:w-20 sm:h-20 text-primary/60" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-border/50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
              Oops! Page Not Found
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              The page you're looking for seems to have wandered off. Don't
              worry, even the best explorers sometimes take a wrong turn!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Helpful Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/" className="block">
                <Button
                  variant="default"
                  className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/contact" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <Search className="w-4 h-4" />
                  Get Help
                </Button>
              </Link>
            </div>

            {/* Quick Navigation */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">
                Or explore these popular sections:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/#services">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Our Services
                  </Button>
                </Link>
                <Link href="/#apply">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Apply for Loan
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="ghost" size="sm" className="text-xs">
                    About Us
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need immediate assistance?{" "}
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
