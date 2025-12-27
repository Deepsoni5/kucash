"use client";

import { useState } from "react";
import { AgentSidebar } from "./agent-sidebar";
import { AgentHeader } from "./agent-header";

interface AgentLayoutProps {
  children: React.ReactNode;
  user: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    role: string;
    agentId?: string;
    mobileNumber: string;
    isActive: boolean;
  };
}

export function AgentLayout({ children, user }: AgentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AgentSidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:pl-72">
        <AgentHeader user={user} setSidebarOpen={setSidebarOpen} />

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
