import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, Clock, ArrowRight } from "lucide-react";
import { BlogPost, BlogCategory } from "@/app/actions/blog-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogGridProps {
  posts: BlogPost[];
  selectedCategory?: BlogCategory | null;
  searchQuery?: string;
}

export function BlogGrid({
  posts,
  selectedCategory,
  searchQuery,
}: BlogGridProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? "No articles found" : "No articles yet"}
          </h3>
          <p className="text-gray-600 mb-8">
            {searchQuery
              ? `We couldn't find any articles matching "${searchQuery}". Try different keywords or browse by category.`
              : selectedCategory
              ? `No articles have been published in ${selectedCategory.name} yet. Check back soon!`
              : "We're working on creating amazing content for you. Check back soon!"}
          </p>
          {(searchQuery || selectedCategory) && (
            <Link href="/blog">
              <Button>View All Articles</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {selectedCategory
            ? `Articles in ${selectedCategory.name}`
            : searchQuery
            ? `Search Results for "${searchQuery}"`
            : "Latest Articles"}
        </h2>
        <p className="text-gray-600">
          {posts.length} article{posts.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              {post.featured_image_url ? (
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold">K</span>
                    </div>
                    <p className="text-sm">Kucash Blog</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Category & Meta */}
              <div className="flex items-center justify-between mb-3">
                {post.categories && (
                  <Link
                    href={`/blog?category=${post.categories.slug}`}
                    className="inline-block"
                  >
                    <Badge
                      variant="outline"
                      className="hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      {post.categories.name}
                    </Badge>
                  </Link>
                )}
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {estimateReadTime(post.content)} min read
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {truncateText(post.excerpt, 150)}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.published_at)}
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.views} views
                </div>
              </div>

              {/* Read More Button */}
              <Link href={`/blog/${post.slug}`}>
                <Button
                  variant="ghost"
                  className="w-full group-hover:bg-red-50 group-hover:text-red-600 transition-colors"
                >
                  Read Article
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Load More - Placeholder for future pagination */}
      {posts.length >= 10 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
}
