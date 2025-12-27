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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Shield, UserPlus, Upload, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up - KuCash | Create Your Account",
  description:
    "Create your KuCash account to access loans and financial services. Quick and secure registration for customers and agents.",
};

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10 min-h-screen flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                  {"Create Your Account"}
                </h1>
                <p className="text-muted-foreground">
                  {"Join KuCash to access loans and financial services"}
                </p>
              </div>

              {/* Signup Card */}
              <Card className="shadow-2xl border-border/50">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Sign Up</CardTitle>
                  <CardDescription className="text-base">
                    {"Fill in your details to create your account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignupForm />

                  {/* Security Note */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border mt-6">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {
                        "Your information is encrypted and secure. We never share your data."
                      }
                    </p>
                  </div>

                  {/* Footer Links */}
                  <div className="text-center space-y-3 pt-6">
                    <p className="text-sm text-muted-foreground">
                      {"Already have an account?"}
                    </p>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="w-full rounded-full bg-transparent"
                      >
                        Login to Your Account
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
                    "By signing up, you agree to our Terms & Conditions and Privacy Policy"
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
