"use client";

import { ReactNode } from "react";
import { CustomerSidebar } from "./customer-sidebar";
import { CustomerHeader } from "./customer-header";

interface CustomerLayoutProps {
  children: ReactNode;
}

export function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <CustomerHeader />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <CustomerSidebar />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 min-w-0">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <CustomerHeader />
          </div>

          {/* Page Content */}
          <main className="p-4 lg:p-6 w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
