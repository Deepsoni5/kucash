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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, LogIn, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login - KuCash | Secure Access to Your Account",
  description:
    "Login to your KuCash account using email and password. Secure authentication to manage your loans and applications.",
};

export default function LoginPage() {
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
                  {"Welcome Back"}
                </h1>
                <p className="text-muted-foreground">
                  {"Login to access your loan dashboard and applications"}
                </p>
              </div>

              {/* Login Card */}
              <Card className="shadow-2xl border-border/50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <LogIn className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">
                    Login to Your Account
                  </CardTitle>
                  <CardDescription className="text-base">
                    {"Enter your email and password to access your account"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Suspense
                    fallback={
                      <div className="space-y-4 animate-pulse">
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    }
                  >
                    <LoginForm />
                  </Suspense>

                  {/* Security Note */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {
                        "Your information is encrypted and secure. We never share your data."
                      }
                    </p>
                  </div>

                  {/* Footer Links */}
                  <div className="text-center space-y-3 pt-4">
                    <p className="text-sm text-muted-foreground">
                      {"Don't have an account?"}
                    </p>
                    <Link href="/signup">
                      <Button
                        variant="outline"
                        className="w-full rounded-full bg-transparent"
                      >
                        Create New Account
                      </Button>
                    </Link>

                    {/* Admin Login Link */}
                    <div className="pt-4 border-t border-border/50">
                      <Link
                        href="/admin/login"
                        className="text-sm text-primary hover:underline flex items-center justify-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Are you an admin? Login here
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  {"Need help?"}{" "}
                  <Link
                    href="/contact"
                    className="text-primary hover:underline"
                  >
                    Contact Support
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  {
                    "By logging in, you agree to our Terms & Conditions and Privacy Policy"
                  }
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
