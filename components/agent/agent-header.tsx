"use client";

import { Button } from "@/components/ui/button";
import { Menu, Bell, Copy, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface AgentHeaderProps {
  user: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    role: string;
    agentId?: string;
    mobileNumber: string;
    isActive: boolean;
    photoUrl?: string;
    postalAddress?: string;
    phoneGpayNumber?: string;
  };
  setSidebarOpen: (open: boolean) => void;
}

export function AgentHeader({ user, setSidebarOpen }: AgentHeaderProps) {
  const { toast } = useToast();

  const copyAgentId = async () => {
    if (user?.agentId) {
      try {
        await navigator.clipboard.writeText(user.agentId);
        toast({
          title: "Copied!",
          description: "Agent ID copied to clipboard.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Failed to copy Agent ID to clipboard.",
        });
      }
    }
  };
  return (
    <header className="bg-background border-b border-border">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Welcome back, {user.fullName.split(" ")[0]}!
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Agent ID: {user.agentId}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={copyAgentId}
                title="Copy Agent ID"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Back to Website Button */}
          <Link href="/" className="sm:hidden">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>

          {/* Desktop Back to Website Button */}
          <Link href="/" className="hidden sm:block">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Back to Website
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
