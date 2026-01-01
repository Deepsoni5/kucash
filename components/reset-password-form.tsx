"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { updatePassword } from "@/app/actions/auth-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: "text-gray-400",
  });

  // Check if we have the required tokens from the URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setErrors({
        general:
          "Invalid or expired reset link. Please request a new password reset.",
      });
    }
  }, [accessToken, refreshToken]);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Upper and lowercase letters");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("At least one number");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("At least one special character");
    }

    let color = "text-red-500";
    if (score >= 3) color = "text-yellow-500";
    if (score === 4) color = "text-green-500";

    return { score, feedback, color };
  };

  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength({ score: 0, feedback: [], color: "text-gray-400" });
    }
  }, [password]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password is too weak";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!accessToken || !refreshToken) {
      newErrors.general = "Invalid or expired reset link";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("password", password);
      formData.append("accessToken", accessToken!);
      formData.append("refreshToken", refreshToken!);

      const result = await updatePassword(formData);

      if (result.error) {
        setErrors({ general: result.error });
        toast({
          variant: "destructive",
          title: "Password Reset Failed",
          description: result.error,
        });
      } else {
        toast({
          title: "Password Reset Successful!",
          description:
            "Your password has been updated. Redirecting to login...",
        });

        // Redirect to login after successful password reset
        setTimeout(() => {
          router.push(
            "/login?message=Password reset successful. Please log in with your new password."
          );
        }, 2000);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ general: "Failed to reset password. Please try again." });
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: "Failed to reset password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (errors.general && (!accessToken || !refreshToken)) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Invalid Reset Link
          </h3>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-800 dark:text-red-200">
              Password reset links expire after 1 hour for security reasons.
              Please request a new password reset if you need to change your
              password.
            </p>
          </div>

          <Button
            onClick={() => router.push("/forgot-password")}
            className="w-full"
          >
            Request New Reset Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-200">
            {errors.general}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">New Password *</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    level <= passwordStrength.score
                      ? passwordStrength.score === 1
                        ? "bg-red-500"
                        : passwordStrength.score === 2
                        ? "bg-orange-500"
                        : passwordStrength.score === 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
            {passwordStrength.feedback.length > 0 && (
              <p className={`text-xs ${passwordStrength.color}`}>
                Missing: {passwordStrength.feedback.join(", ")}
              </p>
            )}
          </div>
        )}

        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            className={`pr-10 ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="flex items-center gap-2">
            {password === confirmPassword ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-xs text-green-500">Passwords match</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-xs text-red-500">Passwords do not match</p>
              </>
            )}
          </div>
        )}

        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-200"
        disabled={isLoading || passwordStrength.score < 3}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Updating Password...
          </div>
        ) : (
          "Update Password"
        )}
      </Button>
    </form>
  );
}

// Loading fallback component
function ResetPasswordFormSkeleton() {
  return (
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
  );
}

// Main export with Suspense wrapper
export function ResetPasswordForm() {
  return (
    <Suspense fallback={<ResetPasswordFormSkeleton />}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
