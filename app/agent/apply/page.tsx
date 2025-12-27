import { AgentLoanApplicationForm } from "@/components/agent/agent-loan-application-form";

export default function AgentApply() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Apply for Customer
        </h1>
        <p className="text-muted-foreground">
          Submit a loan application on behalf of your customer
        </p>
      </div>

      {/* Application Form */}
      <AgentLoanApplicationForm />
    </div>
  );
}
