import {
  getPublishedPosts,
  getBlogCategories,
  getFeaturedPosts,
} from "@/app/actions/blog-actions";
import { BlogHero } from "@/components/blog/blog-hero";
import { BlogGrid } from "@/components/blog/blog-grid";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { FeaturedPosts } from "@/components/blog/featured-posts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Blog - Kucash Financial Services",
  description:
    "Stay updated with the latest insights on loans, financial planning, and business growth strategies.",
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;
  const searchQuery = params.search;

  const [posts, categories, featuredPosts] = await Promise.all([
    getPublishedPosts(categorySlug),
    getBlogCategories(),
    getFeaturedPosts(),
  ]);

  // Filter posts by search query if provided
  const filteredPosts = searchQuery
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (post.excerpt &&
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts;

  const selectedCategory = categorySlug
    ? categories.find((cat) => cat.slug === categorySlug)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16 md:pt-20">
        <BlogHero
          selectedCategory={selectedCategory}
          totalPosts={filteredPosts.length}
          searchQuery={searchQuery}
        />
      </div>

      {/* Featured Posts Section - Only show on main blog page */}
      {!categorySlug && !searchQuery && <FeaturedPosts posts={featuredPosts} />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlogGrid
              posts={filteredPosts}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              recentPosts={featuredPosts}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
