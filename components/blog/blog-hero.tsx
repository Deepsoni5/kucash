"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, BookOpen, TrendingUp, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlogCategory } from "@/app/actions/blog-actions";

interface BlogHeroProps {
  selectedCategory?: BlogCategory | null;
  totalPosts: number;
  searchQuery?: string;
}

export function BlogHero({
  selectedCategory,
  totalPosts,
  searchQuery,
}: BlogHeroProps) {
  const [search, setSearch] = useState(searchQuery || "");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    router.push(`/blog?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/blog");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

        {/* Geometric Patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-purple-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-indigo-400/10 rounded-full blur-xl"></div>
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3e%3cpath d='m 60 0 l 0 60 l -60 0 z' fill='none' stroke='%23ffffff' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)'/%3e%3c/svg%3e")`,
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            {selectedCategory
              ? `${selectedCategory.name} Category`
              : "Financial Blog"}
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {selectedCategory ? (
              <>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-blue-200 mb-2">
                  Exploring
                </span>
                {selectedCategory.name}
              </>
            ) : (
              <>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-blue-200 mb-2">
                  Discover
                </span>
                Financial Insights
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
            {selectedCategory
              ? selectedCategory.description ||
                `Deep dive into ${selectedCategory.name.toLowerCase()} with expert analysis and actionable insights`
              : "Expert insights on loans, investments, and financial strategies to help you make informed decisions"}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center space-x-8 mb-12">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              <span className="text-lg font-semibold text-white">
                {totalPosts}
              </span>
              <span className="text-blue-200 ml-1">Articles</span>
            </div>
            {selectedCategory && (
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <Filter className="h-5 w-5 mr-2 text-blue-400" />
                <span className="text-blue-200">
                  in {selectedCategory.name}
                </span>
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative flex bg-white/95 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                  <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search articles, topics, or keywords..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-14 pr-4 h-16 text-lg bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-400 text-gray-700"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-16 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold border-0 rounded-l-none rounded-r-2xl transition-all duration-300 shadow-lg"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </form>

            {/* Active Filters */}
            {(selectedCategory || searchQuery) && (
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                <span className="text-blue-200 font-medium">
                  Active filters:
                </span>
                <div className="flex gap-3 flex-wrap">
                  {selectedCategory && (
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <Filter className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-white text-sm font-medium">
                        {selectedCategory.name}
                      </span>
                    </div>
                  )}
                  {searchQuery && (
                    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <Search className="h-4 w-4 mr-2 text-green-400" />
                      <span className="text-white text-sm font-medium">
                        "{searchQuery}"
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-blue-200 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <p className="text-blue-200 text-sm">
              Stay updated with the latest financial trends and expert advice
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-gray-50"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            fill="currentColor"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            fill="currentColor"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}
