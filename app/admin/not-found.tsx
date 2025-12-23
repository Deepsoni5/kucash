import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "@/components/ui/back-button";
import { Shield, Home, ArrowLeft } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function AdminNotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto text-center">
        {/* Admin 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-6xl sm:text-7xl font-bold text-red-500/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-red-500/60" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-border/50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold mb-2">
              Admin Page Not Found
            </CardTitle>
            <CardDescription className="text-base">
              The admin page you're looking for doesn't exist or you don't have
              permission to access it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/admin/dashboard" className="block">
                <Button
                  variant="default"
                  className="w-full gap-2 bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90"
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <Home className="w-4 h-4" />
                  Main Site
                </Button>
              </Link>
            </div>

            {/* Quick Admin Links */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Quick admin navigation:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/admin/contacts">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Contact Forms
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm" className="text-xs">
                    User Management
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Back Button */}
            <div className="pt-4">
              <BackButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
