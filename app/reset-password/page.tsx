import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Key } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password - KuCash | Create New Password",
  description:
    "Create a new password for your KuCash account. Enter your new password to regain access.",
};

// Make this page dynamic to prevent build-time errors with searchParams
export const dynamic = "force-dynamic";

function ResetPasswordPageContent() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 min-h-screen flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                  Reset Password
                </h1>
                <p className="text-muted-foreground">
                  Create a new secure password for your account
                </p>
              </div>

              {/* Reset Password Card */}
              <Card className="shadow-2xl border-border/50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">
                    Create New Password
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter a strong password to secure your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Suspense
                    fallback={
                      <div className="space-y-6 animate-pulse">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    }
                  >
                    <ResetPasswordForm />
                  </Suspense>

                  {/* Security Note */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">Password Requirements:</p>
                      <ul className="text-xs space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                      </ul>
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="text-center space-y-3 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Remember your password?
                    </p>
                    <Link href="/login">
                      <button className="text-primary hover:underline font-medium">
                        Back to Login
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Need help?{" "}
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    Contact Support
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  After resetting your password, you'll be automatically logged
                  in
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function ResetPasswordPage() {
  return <ResetPasswordPageContent />;
}
