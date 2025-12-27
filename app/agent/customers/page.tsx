import { CustomersTable } from "@/components/agent/customers-table";
import { CustomersStats } from "@/components/agent/customers-stats";

export default function AgentCustomers() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Customer Management
        </h1>
        <p className="text-muted-foreground">
          Manage all customers who have applied through your agent ID
        </p>
      </div>

      {/* Customer Stats */}
      <CustomersStats />

      {/* Customers Table */}
      <CustomersTable />
    </div>
  );
}
