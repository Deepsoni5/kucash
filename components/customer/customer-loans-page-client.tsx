"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CustomerLoansTable } from "./customer-loans-table";
import { CustomerLoan } from "@/app/actions/customer-loan-actions";

interface CustomerLoansPageClientProps {
  loans: CustomerLoan[];
}

export function CustomerLoansPageClient({
  loans,
}: CustomerLoansPageClientProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  return <CustomerLoansTable loans={loans} initialSearch={searchQuery || ""} />;
}
