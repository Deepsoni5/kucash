"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  role: string;
  mobile_number: string;
  is_active: boolean;
  created_at: string;
  postal_address?: string;
  phone_gpay_number?: string;
}

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsDialog({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Customer Details
            <Badge variant={customer.is_active ? "default" : "secondary"}>
              {customer.is_active ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{customer.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{customer.mobile_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{customer.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {new Date(customer.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {(customer.postal_address || customer.phone_gpay_number) && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Additional Information
                </h3>
                <div className="space-y-3">
                  {customer.postal_address && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Postal Address
                      </p>
                      <p className="font-medium">{customer.postal_address}</p>
                    </div>
                  )}
                  {customer.phone_gpay_number && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        GPay Number
                      </p>
                      <p className="font-medium">
                        {customer.phone_gpay_number}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
