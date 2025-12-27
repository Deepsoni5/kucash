"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, IdCard } from "lucide-react";

import { CustomerLoan } from "@/app/actions/customer-loan-actions";

interface AgentDetailsDialogProps {
  agent: CustomerLoan["agent"] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentDetailsDialog({
  agent,
  open,
  onOpenChange,
}: AgentDetailsDialogProps) {
  if (!agent) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Agent Details
          </DialogTitle>
          <DialogDescription>
            Information about your assigned loan agent
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Agent Avatar */}
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Agent Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm text-muted-foreground">
                  {agent.full_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Agent ID</p>
                <p className="text-sm text-muted-foreground">
                  {agent.agent_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">
                  {agent.mobile_number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{agent.email}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20"
            >
              Active Agent
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
