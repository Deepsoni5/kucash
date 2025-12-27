import { LoanApplicationForm } from "@/components/loan-application-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AgentApply() {
  // Get current user and verify they are an agent
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    redirect("/login");
  }

  // Get user profile to get agent_id
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", authUser.id)
    .single();

  if (
    profileError ||
    !userProfile ||
    userProfile.role !== "agent" ||
    !userProfile.agent_id
  ) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Apply for Customer
        </h1>
        <p className="text-muted-foreground">
          Submit a loan application on behalf of your customer using the same
          form as the main website
        </p>
      </div>

      {/* Use the exact same form as landing page but without prefilled data and with agent referral code */}
      <LoanApplicationForm
        skipUserPrefill={true}
        agentReferralCode={userProfile.agent_id}
      />
    </div>
  );
}
