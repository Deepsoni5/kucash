"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, LayoutDashboard, Users } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export function UserProfileDropdown() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const getDashboardLink = () => {
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "agent":
        return "/agent/dashboard";
      case "user":
        return "/customer/dashboard";
      default:
        return "/customer/dashboard";
    }
  };

  const getProfileLink = () => {
    switch (user.role) {
      case "agent":
        return "/agent/profile";
      case "user":
        return "/customer/profile";
      default:
        return "/customer/profile";
    }
  };

  const getDashboardLabel = () => {
    switch (user.role) {
      case "admin":
        return "Admin Dashboard";
      case "agent":
        return "Agent Dashboard";
      case "user":
        return "Customer Dashboard";
      default:
        return "Dashboard";
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user.fullName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.agentId && (
              <p className="text-xs leading-none text-muted-foreground">
                Agent ID: {user.agentId}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={getDashboardLink()} className="cursor-pointer">
            {user.role === "admin" ? (
              <Settings className="mr-2 h-4 w-4" />
            ) : user.role === "agent" ? (
              <Users className="mr-2 h-4 w-4" />
            ) : (
              <LayoutDashboard className="mr-2 h-4 w-4" />
            )}
            {getDashboardLabel()}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={getProfileLink()} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
