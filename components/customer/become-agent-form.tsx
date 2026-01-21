"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { becomeAgent } from "@/app/actions/become-agent-actions";
import { Loader2, Upload, UserCheck } from "lucide-react";
import Image from "next/image";

export function BecomeAgentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await becomeAgent(formData);

      if (result.success && result.redirectUrl) {
        toast.success("Congratulations! You are now an Agent.");
        // Force full page reload to update session and role
        window.location.href = result.redirectUrl;
      } else {
        toast.error(result.error || "Failed to upgrade account");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="postal_address">Postal Address</Label>
          <Textarea
            id="postal_address"
            name="postal_address"
            placeholder="Enter your full postal address"
            required
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_gpay_number">GPay Number</Label>
          <Input
            id="phone_gpay_number"
            name="phone_gpay_number"
            placeholder="10-digit mobile number linked to GPay"
            type="tel"
            maxLength={10}
            pattern="[0-9]{10}"
            required
          />
          <p className="text-xs text-muted-foreground">
            This number will be used for commission payouts.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo_url">Profile Photo</Label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 border-2 border-dashed rounded-full flex items-center justify-center bg-muted overflow-hidden">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <UserCheck className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <Input
                id="photo_url"
                name="photo_url"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a clear professional photo (JPG, PNG)
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Become an Agent"
        )}
      </Button>
    </form>
  );
}
