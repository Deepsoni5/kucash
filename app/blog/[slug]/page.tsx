import { notFound } from "next/navigation";
import {
  getPublishedPost,
  getBlogCategories,
  getFeaturedPosts,
} from "@/app/actions/blog-actions";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { RelatedPosts } from "@/components/blog/related-posts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return {
      title: "Post Not Found - Kucash Blog",
    };
  }

  return {
    title: `${post.title} - Kucash Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [post, categories, recentPosts] = await Promise.all([
    getPublishedPost(slug),
    getBlogCategories(),
    getFeaturedPosts(),
  ]);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post)
  const relatedPosts = recentPosts
    .filter((p) => p.id !== post.id && p.categories?.id === post.categories?.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 md:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlogPostContent post={post} />

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BlogSidebar
                categories={categories}
                recentPosts={recentPosts.filter((p) => p.id !== post.id)}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
