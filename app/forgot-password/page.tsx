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
import { Shield, Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password - KuCash | Reset Your Account Password",
  description:
    "Reset your KuCash account password. Enter your email to receive password reset instructions.",
};

export default function ForgotPasswordPage() {
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
                  Forgot Password?
                </h1>
                <p className="text-muted-foreground">
                  No worries! Enter your email and we'll send you reset
                  instructions
                </p>
              </div>

              {/* Forgot Password Card */}
              <Card className="shadow-2xl border-border/50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">
                    Reset Your Password
                  </CardTitle>
                  <CardDescription className="text-base">
                    Enter your email address and we'll send you a link to reset
                    your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ForgotPasswordForm />

                  {/* Security Note */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      We'll send you a secure link to reset your password. The
                      link will expire in 1 hour.
                    </p>
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

                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                          href="/signup"
                          className="text-primary hover:underline font-medium"
                        >
                          Sign up here
                        </Link>
                      </p>
                    </div>
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
                  If you don't receive an email within a few minutes, check your
                  spam folder
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
