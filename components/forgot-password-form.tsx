"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle } from "lucide-react";
import { resetPassword } from "@/app/actions/auth-actions";
import { useToast } from "@/hooks/use-toast";

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      console.log(
        "🔵 FORGOT PASSWORD FORM: Calling resetPassword function with email:",
        email
      );
      const formData = new FormData();
      formData.append("email", email);

      console.log(
        "🔵 FORGOT PASSWORD FORM: FormData created, calling resetPassword..."
      );
      const result = await resetPassword(formData);
      console.log("🔵 FORGOT PASSWORD FORM: resetPassword returned:", result);

      if (result.error) {
        setError(result.error);
        toast({
          variant: "destructive",
          title: "Reset Failed",
          description: result.error,
        });
      } else {
        setIsEmailSent(true);
        toast({
          title: "Email Sent!",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Failed to send reset email. Please try again.");
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: "Failed to send reset email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await resetPassword(formData);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Resend Failed",
          description: result.error,
        });
      } else {
        toast({
          title: "Email Resent!",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Resend Failed",
        description: "Failed to resend email. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Check Your Email
          </h3>
          <p className="text-muted-foreground">
            We've sent password reset instructions to:
          </p>
          <p className="font-medium text-foreground break-all">{email}</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Next steps:</strong>
              <br />
              1. Check your email inbox (and spam folder)
              <br />
              2. Click the reset link in the email
              <br />
              3. Create your new password
            </p>
          </div>

          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Resending..." : "Resend Email"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className={`pl-10 ${error ? "border-red-500" : ""}`}
            autoComplete="email"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending Reset Link...
          </div>
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </form>
  );
}
