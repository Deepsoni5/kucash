import { AgentProfileForm } from "@/components/agent/agent-profile-form";

export default function AgentProfile() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Form */}
      <AgentProfileForm />
    </div>
  );
}
