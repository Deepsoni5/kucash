import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ArrowRight } from "lucide-react";
import { BlogPost } from "@/app/actions/blog-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

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

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Related Articles
        </h2>
        <p className="text-gray-600">
          Continue reading with these related insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
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
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold">K</span>
                    </div>
                    <p className="text-xs">Kucash</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Category */}
              {post.categories && (
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {post.categories.name}
                  </Badge>
                </div>
              )}

              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {truncateText(post.excerpt, 100)}
                </p>
              )}

              {/* Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(post.published_at)}
                </div>
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {post.views}
                </div>
              </div>

              {/* Read More */}
              <Link href={`/blog/${post.slug}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs group-hover:bg-red-50 group-hover:text-red-600 transition-colors"
                >
                  Read More
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <Link href="/blog">
          <Button variant="outline">
            View All Articles
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
