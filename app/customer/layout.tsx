import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile to ensure they exist in our users table
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userProfile) {
    redirect("/login");
  }

  // Ensure user has customer role (not admin or agent)
  if (userProfile.role === "admin") {
    redirect("/admin/dashboard");
  }

  if (userProfile.role === "agent") {
    redirect("/agent/dashboard");
  }

  return <>{children}</>;
}
