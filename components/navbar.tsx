"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/auth-context";
import { UserProfileDropdown } from "@/components/user-profile-dropdown";
import router from "next/router";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Debug logging
  useEffect(() => {
    console.log("🔍 NAVBAR DEBUG - Auth state:", {
      user: user?.fullName || "No user",
      loading,
      hasUser: !!user,
    });
  }, [user, loading]);

  // Force re-render when auth state changes
  useEffect(() => {
    if (!loading) {
      console.log("🔄 NAVBAR: Auth loading completed, user:", !!user);
    }
  }, [user, loading]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      const hash = window.location.hash;
      if (hash === "#apply") {
        setTimeout(() => {
          const element = document.getElementById("apply");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 500);
      }
    }
  }, [pathname]);

  const handleApplyClick = () => {
    setIsOpen(false);
    if (pathname === "/") {
      const element = document.getElementById("apply");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#apply");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen
          ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo_k_4.png"
              alt="KuCash Logo"
              className="h-24 md:h-32 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-foreground font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            {/* Auth Section */}
            {!loading && (
              <>
                {user ? (
                  <UserProfileDropdown />
                ) : (
                  <Link href="/login" className="hidden md:block">
                    <Button
                      variant="outline"
                      className="rounded-full bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}

            <Link href="#apply" className="hidden md:block">
              <Button className="rounded-full bg-primary hover:bg-primary/90">
                Apply Now
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-foreground/80 hover:text-foreground font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {!loading && (
              <>
                {user ? (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="px-2 py-1">
                      <p className="text-sm font-medium">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      {user.agentId && (
                        <p className="text-xs text-muted-foreground">
                          Agent ID: {user.agentId}
                        </p>
                      )}
                    </div>
                    <Link
                      href={
                        user.role === "admin"
                          ? "/admin/dashboard"
                          : user.role === "agent"
                          ? "/agent/dashboard"
                          : "/customer/dashboard"
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="outline" className="w-full rounded-full">
                        {user.role === "admin"
                          ? "Admin Dashboard"
                          : user.role === "agent"
                          ? "Agent Dashboard"
                          : "Customer Dashboard"}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="outline"
                      className="w-full rounded-full bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}

            <Link
              href="#apply"
              className="block"
              onClick={() => setIsOpen(false)}
            >
              <Button className="w-full rounded-full bg-primary">
                Apply Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
