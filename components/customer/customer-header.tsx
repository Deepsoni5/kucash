"use client";

import { Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CustomerLoan } from "@/app/actions/customer-loan-actions";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

export function CustomerHeader() {
  const { setTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CustomerLoan[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time search
  useEffect(() => {
    const searchLoans = async () => {
      if (!searchQuery.trim() || !user?.id) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        // Import the function dynamically to avoid SSR issues
        const { getCustomerLoans } = await import(
          "@/app/actions/customer-loan-actions"
        );
        const loans = await getCustomerLoans(user.id);

        // Filter loans based on search query
        const filtered = loans.filter(
          (loan) =>
            loan.loan_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loan.loan_purpose
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            loan.company_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            loan.loan_id.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults(filtered.slice(0, 5)); // Show max 5 results
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchLoans, 300); // Debounce search
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, user?.id]);

  const handleResultClick = (loan: CustomerLoan) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(`/customer/loans?search=${encodeURIComponent(loan.loan_id)}`);
  };

  const handleViewAll = () => {
    setShowResults(false);
    router.push(
      `/customer/loans?search=${encodeURIComponent(searchQuery.trim())}`
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "under_review":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <header className="h-16 bg-card border-b border-border px-4 lg:px-6">
      <div className="flex items-center justify-between h-full">
        {/* Search */}
        <div className="flex-1 max-w-md relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search loans, documents..."
              className="pl-10 bg-background/50"
              onFocus={() => searchQuery.trim() && setShowResults(true)}
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  {searchResults.map((loan) => (
                    <div
                      key={loan.id}
                      onClick={() => handleResultClick(loan)}
                      className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm capitalize">
                              {loan.loan_type.replace("_", " ")} Loan
                            </p>
                            <Badge
                              className={`${getStatusColor(
                                loan.status
                              )} text-xs`}
                            >
                              {loan.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            ID: {loan.loan_id} •{" "}
                            {formatCurrency(loan.loan_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleViewAll}
                      className="w-full text-primary hover:text-primary"
                    >
                      View all results for "{searchQuery}"
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No loans found for "{searchQuery}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleViewAll}
                    className="mt-2 text-primary hover:text-primary"
                  >
                    Search in all loans
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
