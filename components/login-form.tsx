"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { loginUser, resendVerificationEmail } from "@/app/actions/auth-actions";
import { sendOtp, verifyOtp } from "@/app/actions/otp-actions";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  
  // Email Login State
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});
  
  // Phone Login State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // General State
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);
  const [activeTab, setActiveTab] = useState("email");

  // Timer for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle URL parameters for success/error messages
  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");
    const verified = searchParams.get("verified");

    if (message) {
      toast({
        title: "Success!",
        description: decodeURIComponent(message),
      });
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("message");
      window.history.replaceState({}, "", url.toString());
    }

    if (verified === "true") {
      toast({
        title: "Email Verified!",
        description: "Your email has been verified successfully. You can now log in.",
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("verified");
      window.history.replaceState({}, "", url.toString());
    }

    if (error) {
      let errorMessage = "An error occurred. Please try again.";
      switch (error) {
        case "verification_failed":
          errorMessage = "Email verification failed. Please try again or contact support.";
          break;
        case "configuration_error":
          errorMessage = "Service configuration error. Please contact support.";
          break;
        case "callback_error":
          errorMessage = "Authentication error. Please try again.";
          break;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, toast]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);

      const result = await loginUser(submitData);

      if (result.error) {
        if (
          result.error.includes("not yet activated") ||
          result.error.includes("verify your email")
        ) {
          setShowResendOption(true);
        } else {
          setShowResendOption(false);
        }
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error,
        });
      } else {
        toast({
          title: "Login Successful!",
          description: "Redirecting to your dashboard...",
        });
        await refreshUser();
        setTimeout(() => {
          if (result.user?.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Failed to login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast({
        variant: "destructive",
        title: "Phone Required",
        description: "Please enter your mobile number.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("phone", phoneNumber);
      
      const result = await sendOtp(formData);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Failed to Send OTP",
          description: result.error,
        });
      } else {
        setIsOtpSent(true);
        setOtpTimer(60); // 1 minute cooldown
        toast({
          title: "OTP Sent!",
          description: "Please check your WhatsApp for the verification code.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("phone", phoneNumber);
      formData.append("otp", otpCode);
      
      const result = await verifyOtp(formData);
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: result.error,
        });
      } else if (result.redirectUrl) {
        toast({
          title: "Verified!",
          description: "Logging you in...",
        });
        // Redirect to the magic link which will handle the session
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address first.",
      });
      return;
    }

    setIsResendingEmail(true);
    try {
      const result = await resendVerificationEmail(formData.email);
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Resend Failed",
          description: result.error,
        });
      } else {
        toast({
          title: "Email Sent!",
          description: "Verification email has been sent. Please check your inbox.",
        });
        setShowResendOption(false);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Resend Failed",
        description: "Failed to resend verification email. Please try again.",
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="email" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
          <TabsTrigger value="email" className="text-sm font-medium">
            <Mail className="mr-2 h-4 w-4" />
            Email Login
          </TabsTrigger>
          <TabsTrigger value="phone" className="text-sm font-medium">
            <Phone className="mr-2 h-4 w-4" />
            Phone Login
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <form onSubmit={handleEmailSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {showResendOption && (
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Account Not Activated
                    </p>
                    <p className="text-xs text-orange-600 dark:text-orange-300">
                      Please check your email and click the verification link
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={isResendingEmail}
                    className="ml-4"
                  >
                    {isResendingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Email"
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full bg-gradient-to-r from-primary to-accent"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="phone">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5 h-5 w-8 flex items-center justify-center border-r border-border pr-2 text-muted-foreground">
                       <span className="text-sm font-medium">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setPhoneNumber(val);
                      }}
                      className="pl-14"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your 10-digit registered mobile number
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-gradient-to-r from-primary to-accent"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP via WhatsApp <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-4 text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Enter Verification Code</h3>
                    <p className="text-sm text-muted-foreground">
                      We sent a 6-digit code to <span className="font-medium text-foreground">{phoneNumber}</span>
                    </p>
                  </div>

                  <div className="flex justify-center py-4">
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={(value) => setOtpCode(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full bg-gradient-to-r from-primary to-accent"
                      disabled={isLoading || otpCode.length !== 6}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Login"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={() => setIsOtpSent(false)}
                    >
                      Change Number
                    </Button>
                    
                    {otpTimer > 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Resend OTP in {otpTimer}s
                      </p>
                    ) : (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="text-primary h-auto p-0 text-xs"
                        onClick={handleSendOtp}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
