import { ReportsFilters } from "@/components/agent/reports-filters";
import { ReportsTable } from "@/components/agent/reports-table";
import { ReportsStats } from "@/components/agent/reports-stats";

export default function AgentReports() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          View detailed reports of your loan applications and commission
          earnings
        </p>
      </div>

      {/* Reports Stats */}
      <ReportsStats />

      {/* Filters */}
      <ReportsFilters />

      {/* Reports Table */}
      <ReportsTable />
    </div>
  );
}
