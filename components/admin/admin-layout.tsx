import { AdminSidebar } from "./admin-sidebar";
import { getAdminSession } from "@/app/actions/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getAdminSession();

  if (!session) {
    return null; // This should be handled by middleware
  }

  // Get contact form count
  const supabase = await createClient();
  const { count: contactCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  return (
    <div className="flex h-screen bg-slate-50">
      <AdminSidebar user={session} contactCount={contactCount || 0} />
      <main className="flex-1 overflow-auto">
        <div className="lg:hidden">
          {/* Mobile header spacer */}
          <div className="h-16 bg-white border-b"></div>
        </div>
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
