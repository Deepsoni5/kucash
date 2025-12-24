import { requireAdminAuth } from "@/app/actions/admin-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Users,
  MessageSquare,
  Settings,
  TrendingUp,
  FileText,
  FolderOpen,
  Eye,
  Heart,
  Calendar,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

// Force dynamic rendering since we use cookies
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireAdminAuth();
  const supabase = await createClient();

  // Get dashboard stats
  const { count: contactCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true });

  const { count: newContactCount } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Get blog stats
  const { count: totalPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true });

  const { count: publishedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: draftPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  const { count: totalCategories } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  // Get total views and likes
  const { data: blogStats } = await supabase
    .from("posts")
    .select("views, likes")
    .eq("status", "published");

  const totalViews =
    blogStats?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;
  const totalLikes =
    blogStats?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0;

  // Get recent posts
  const { data: recentPosts } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      status,
      created_at,
      views,
      likes,
      categories (name)
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  // Get recent contacts
  const { data: recentContacts } = await supabase
    .from("contact_submissions")
    .select("id, name, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {session.full_name}!
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here's what's happening with your KuCash platform today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Users
              </CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {userCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Blog Posts
              </CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {publishedPosts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {draftPosts || 0} drafts, {totalCategories || 0} categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Blog Views
              </CardTitle>
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalLikes} total likes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Contact Forms
              </CardTitle>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {contactCount || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {newContactCount || 0} new submissions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Categories
              </CardTitle>
              <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {totalCategories || 0}
              </div>
              <p className="text-xs text-muted-foreground">Blog categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Engagement
              </CardTitle>
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-red-500">
                {totalLikes}
              </div>
              <p className="text-xs text-muted-foreground">Total likes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                System Status
              </CardTitle>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-500">
                Online
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Blog Posts
              </CardTitle>
              <CardDescription>
                Latest blog posts and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentPosts && recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{post.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              post.status === "published"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {post.status}
                          </Badge>
                          {post.categories && (
                            <Badge variant="outline">
                              {post.categories.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <a
                      href="/admin/posts"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      Manage All Posts
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No blog posts yet</p>
                  <p className="text-sm mt-2">Create your first blog post</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Contact Submissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Recent Contact Submissions
              </CardTitle>
              <CardDescription>
                Latest customer inquiries and messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentContacts && recentContacts.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{contact.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {contact.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            contact.status === "new" ? "default" : "secondary"
                          }
                        >
                          {contact.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <a
                      href="/admin/contacts"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      View All Submissions
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contact submissions yet</p>
                  <p className="text-sm mt-2">
                    New submissions will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
