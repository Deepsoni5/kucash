import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - KuCash",
  description: "Administrator panel for KuCash loan management system",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The AdminLayout component handles the actual layout
  // This is just the Next.js layout wrapper
  return children;
}
