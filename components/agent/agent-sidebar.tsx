"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  User,
  FileText,
  BarChart3,
  LogOut,
  X,
  Users,
  CreditCard,
  Copy,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AgentSidebarProps {
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
  };
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigation = [
  { name: "Dashboard", href: "/agent/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/agent/profile", icon: User },
  { name: "Loan Applications", href: "/agent/applications", icon: FileText },
  { name: "Customer Management", href: "/agent/customers", icon: Users },
  { name: "Apply for Customer", href: "/agent/apply", icon: CreditCard },
  { name: "Reports & Analytics", href: "/agent/reports", icon: BarChart3 },
];

export function AgentSidebar({
  user,
  sidebarOpen,
  setSidebarOpen,
}: AgentSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

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
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <Link href="/agent/dashboard" className="flex items-center gap-2">
              <img src="/logo_k_4.png" alt="KuCash" className="h-8 w-auto" />
              <span className="text-lg font-semibold text-foreground">
                Agent Portal
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoUrl || ""} alt={user.fullName} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                {user.agentId && (
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-primary font-medium">
                      ID: {user.agentId}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={copyAgentId}
                      title="Copy Agent ID"
                    >
                      <Copy className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
