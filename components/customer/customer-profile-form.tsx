"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateCustomerProfile } from "@/app/actions/customer-loan-actions";
import { Loader2, Save, User, Phone, CreditCard } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  agent_id?: string;
  mobile_number: string;
  is_active: boolean;
  photo_url?: string;
  postal_address?: string;
  phone_gpay_number?: string;
}

interface CustomerProfileFormProps {
  userProfile: UserProfile;
}

export function CustomerProfileForm({ userProfile }: CustomerProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userProfile.full_name || "",
    mobile_number: userProfile.mobile_number || "",
    phone_gpay_number: userProfile.phone_gpay_number || "",
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateCustomerProfile(userProfile.user_id, formData);

      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-semibold">Personal Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => handleInputChange("full_name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={userProfile.email}
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed for security reasons
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-semibold">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobile_number">Mobile Number *</Label>
            <Input
              id="mobile_number"
              type="tel"
              value={formData.mobile_number}
              onChange={(e) =>
                handleInputChange("mobile_number", e.target.value)
              }
              placeholder="+91 XXXXX XXXXX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_gpay_number">GPay/UPI Number</Label>
            <Input
              id="phone_gpay_number"
              type="tel"
              value={formData.phone_gpay_number}
              onChange={(e) =>
                handleInputChange("phone_gpay_number", e.target.value)
              }
              placeholder="+91 XXXXX XXXXX"
            />
            <p className="text-xs text-muted-foreground">
              For loan disbursement and EMI collection
            </p>
          </div>
        </div>
      </div>

      {/* Account Information (Read-only) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-4 h-4 text-primary" />
          <h3 className="text-lg font-semibold">Account Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Account Status</Label>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  userProfile.is_active ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-sm">
                {userProfile.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="text-sm capitalize">
              {userProfile.role.replace("_", " ")}
            </div>
          </div>
        </div>

        {userProfile.agent_id && (
          <div className="space-y-2">
            <Label>Assigned Agent ID</Label>
            <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {userProfile.agent_id}
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Profile
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
