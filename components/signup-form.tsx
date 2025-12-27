"use client";

import { useState } from "react";
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
import { Eye, EyeOff, Users, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { signupUser, uploadPhoto } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface SignupFormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "agent" | "";
  postalAddress: string;
  phoneGpayNumber: string;
  photoFile: File | null;
}

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    postalAddress: "",
    phoneGpayNumber: "",
    photoFile: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormData, string>>
  >({});

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Please select your login type";
    }

    // Agent-specific validations
    if (formData.role === "agent") {
      if (!formData.postalAddress.trim()) {
        newErrors.postalAddress = "Postal address is required for agents";
      }
      if (!formData.phoneGpayNumber.trim()) {
        newErrors.phoneGpayNumber = "Phone/GPay number is required for agents";
      } else if (!/^\d{10}$/.test(formData.phoneGpayNumber)) {
        newErrors.phoneGpayNumber =
          "Please enter a valid 10-digit phone number";
      }
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
      let photoUrl = "";

      // Upload photo if provided
      if (formData.photoFile) {
        const uploadResult = await uploadPhoto(formData.photoFile);
        if (uploadResult.error) {
          toast({
            variant: "destructive",
            title: "Upload Error",
            description: uploadResult.error,
          });
          setIsLoading(false);
          return;
        }
        photoUrl = uploadResult.url || "";
      }

      // Create FormData for server action
      const submitData = new FormData();
      submitData.append("fullName", formData.fullName);
      submitData.append("mobileNumber", formData.mobileNumber);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("role", formData.role);

      if (formData.role === "agent") {
        submitData.append("postalAddress", formData.postalAddress);
        submitData.append("phoneGpayNumber", `+91${formData.phoneGpayNumber}`); // Add +91 prefix
        if (photoUrl) {
          submitData.append("photoUrl", photoUrl);
        }
      }

      const result = await signupUser(submitData);

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Signup Failed",
          description: result.error,
        });
      } else {
        if (result.needsEmailVerification) {
          toast({
            title: "Account Created Successfully!",
            description: result.agentId
              ? `Your Agent ID is: ${result.agentId}. Please check your email to verify your account.`
              : "Please check your email to verify your account.",
          });
        } else {
          toast({
            title: "Account Created Successfully!",
            description: result.agentId
              ? `Your Agent ID is: ${result.agentId}`
              : "You can now login to your account.",
          });

          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Basic Information
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && (
              <p className="text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number *</Label>
            <div className="flex">
              <div className="flex items-center px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                +91
              </div>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="XXXXX XXXXX"
                value={formData.mobileNumber}
                onChange={(e) => {
                  // Only allow numbers and limit to 10 digits
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  handleInputChange("mobileNumber", value);
                }}
                className={`rounded-l-none ${
                  errors.mobileNumber ? "border-red-500" : ""
                }`}
                maxLength={10}
              />
            </div>
            {errors.mobileNumber && (
              <p className="text-xs text-red-500">{errors.mobileNumber}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email ID *</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className={
                  errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                }
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
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      {/* Login Type Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Account Type</h3>

        <div className="space-y-2">
          <Label htmlFor="role">Select Login Type *</Label>
          <Select
            value={formData.role}
            onValueChange={(value: "user" | "agent") =>
              handleInputChange("role", value)
            }
          >
            <SelectTrigger className={errors.role ? "border-red-500" : ""}>
              <SelectValue placeholder="Choose your account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer
                </div>
              </SelectItem>
              <SelectItem value="agent">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Agent
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
        </div>
      </div>

      {/* Agent-specific fields */}
      {formData.role === "agent" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5" />
                Agent Information
              </h3>

              <div className="space-y-2">
                <Label htmlFor="postalAddress">Postal Address *</Label>
                <Textarea
                  id="postalAddress"
                  placeholder="Enter your complete postal address"
                  value={formData.postalAddress}
                  onChange={(e) =>
                    handleInputChange("postalAddress", e.target.value)
                  }
                  className={errors.postalAddress ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.postalAddress && (
                  <p className="text-xs text-red-500">{errors.postalAddress}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneGpayNumber">Phone/GPay Number *</Label>
                <div className="flex">
                  <div className="flex items-center px-3 py-2 bg-muted border border-r-0 rounded-l-md text-sm text-muted-foreground">
                    +91
                  </div>
                  <Input
                    id="phoneGpayNumber"
                    type="tel"
                    placeholder="XXXXX XXXXX"
                    value={formData.phoneGpayNumber}
                    onChange={(e) => {
                      // Only allow numbers and limit to 10 digits
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      handleInputChange("phoneGpayNumber", value);
                    }}
                    className={`rounded-l-none ${
                      errors.phoneGpayNumber ? "border-red-500" : ""
                    }`}
                    maxLength={10}
                  />
                </div>
                {errors.phoneGpayNumber && (
                  <p className="text-xs text-red-500">
                    {errors.phoneGpayNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo Upload</Label>
                <FileUpload
                  accept="image/*"
                  maxSize={5}
                  onFileSelect={(file) =>
                    setFormData((prev) => ({ ...prev, photoFile: file }))
                  }
                  selectedFile={formData.photoFile}
                  placeholder="Upload your photo"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a clear photo for verification (optional)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full rounded-full bg-gradient-to-r from-primary to-accent"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
