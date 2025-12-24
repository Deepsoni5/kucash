"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Calendar,
  Eye,
  TrendingUp,
  BookOpen,
  ArrowRight,
  Mail,
  Bell,
} from "lucide-react";
import { BlogCategory, BlogPost } from "@/app/actions/blog-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogSidebarProps {
  categories: BlogCategory[];
  selectedCategory?: BlogCategory | null;
  recentPosts: BlogPost[];
}

export function BlogSidebar({
  categories,
  selectedCategory,
  recentPosts,
}: BlogSidebarProps) {
  const searchParams = useSearchParams();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-100">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl text-gray-900">Stay Updated</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Get the latest financial insights delivered to your inbox
          </p>
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white"
            />
            <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
              <Bell className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-red-600" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {/* All Categories Link */}
            <Link
              href="/blog"
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                !selectedCategory
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">All Articles</span>
              <Badge variant="secondary">
                {categories.reduce(
                  (sum, cat) => sum + (cat.post_count || 0),
                  0
                )}
              </Badge>
            </Link>

            {/* Category Links */}
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog?category=${category.slug}`}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedCategory?.id === category.id
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary">{category.post_count || 0}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
            Recent Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`}>
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      {post.featured_image_url ? (
                        <Image
                          src={post.featured_image_url}
                          alt={post.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-400">
                            K
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 text-sm mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.published_at)}
                        <span className="mx-2">•</span>
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <Link href="/blog">
              <Button
                variant="ghost"
                className="w-full text-red-600 hover:bg-red-50"
              >
                View All Articles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags - Placeholder for future implementation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-red-600" />
            Popular Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Business Loans",
              "Financial Planning",
              "Investment Tips",
              "Credit Score",
              "SME Growth",
              "Auto Loans",
              "Insurance",
              "Market Trends",
            ].map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact CTA */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
        <CardContent className="text-center p-6">
          <h3 className="text-lg font-bold mb-2">Need Financial Advice?</h3>
          <p className="text-gray-300 mb-4 text-sm">
            Get personalized financial solutions from our experts
          </p>
          <Link href="/contact">
            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
              Contact Us Today
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
