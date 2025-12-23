import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500/10 via-background to-orange-500/10 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to User Login
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
            Admin Access
          </h1>
          <p className="text-muted-foreground">
            Secure login for administrators only
          </p>
        </div>

        {/* Login Form */}
        <AdminLoginForm />

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Having trouble accessing your account? Contact the system
            administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
