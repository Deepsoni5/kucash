import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth-actions";
import { AgentLayout } from "@/components/agent/agent-layout";

export default async function AgentLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getCurrentUser();

  // Redirect if not authenticated or not an agent
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "agent") {
    redirect("/");
  }

  return <AgentLayout user={user}>{children}</AgentLayout>;
}
