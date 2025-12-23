import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings, Construction } from "lucide-react";

export default async function SettingsPage() {
  await requireAdminAuth();

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Configure application settings and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Construction className="w-5 h-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              System settings features are under development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">System Settings</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This section will allow you to configure system settings, manage
                application preferences, and control various features. Features
                coming soon!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
