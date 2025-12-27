import { ApplicationsTable } from "@/components/agent/applications-table";
import { ApplicationsFilters } from "@/components/agent/applications-filters";

export default function AgentApplications() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Loan Applications
        </h1>
        <p className="text-muted-foreground">
          Manage and track all loan applications submitted under your agent ID
        </p>
      </div>

      {/* Filters */}
      <ApplicationsFilters />

      {/* Applications Table */}
      <ApplicationsTable />
    </div>
  );
}
