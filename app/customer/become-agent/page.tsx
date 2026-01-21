import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerLayout } from "@/components/customer/customer-layout";
import { BecomeAgentForm } from "@/components/customer/become-agent-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default async function BecomeAgentPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userProfile) {
    redirect("/login");
  }

  // If already an agent, redirect to agent dashboard
  if (userProfile.role === "agent") {
    redirect("/agent/dashboard");
  }

  return (
    <CustomerLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Become a KuCash Agent
          </h1>
          <p className="text-muted-foreground mt-2">
            Join our partner network and earn commissions by referring loans.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Agent Application
            </CardTitle>
            <CardDescription>
              Complete your profile to activate your agent account immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BecomeAgentForm />
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
