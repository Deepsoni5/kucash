"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category_id: string | null;
  author_id: string;
  status: "draft" | "published" | "archived";
  views: number;
  likes: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
  users?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface CreatePostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category_id?: string;
  status: "draft" | "published";
  meta_title?: string;
  meta_description?: string;
}

export interface UpdatePostData extends CreatePostData {
  id: string;
}

// Get all posts with category and author info
export async function getPosts(): Promise<Post[]> {
  const supabase = await createClient();

  // First check if posts table exists by trying a simple query
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    // Return empty array if table doesn't exist or other error
    return [];
  }

  return data || [];
}

// Get single post
export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      categories (
        id,
        name,
        slug
      ),
      users (
        id,
        full_name,
        email
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

// Create post
export async function createPost(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const featured_image_url = formData.get("featured_image_url") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as "draft" | "published";
  const meta_title = formData.get("meta_title") as string;
  const meta_description = formData.get("meta_description") as string;

  if (!title || !slug || !content) {
    throw new Error("Title, slug and content are required");
  }

  const postData: any = {
    title,
    slug,
    content,
    excerpt: excerpt || null,
    featured_image_url: featured_image_url || null,
    category_id: category_id || null,
    author_id: user.id,
    status,
    meta_title: meta_title || null,
    meta_description: meta_description || null,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("posts").insert(postData);

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// Update post
export async function updatePost(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const featured_image_url = formData.get("featured_image_url") as string;
  const category_id = formData.get("category_id") as string;
  const status = formData.get("status") as "draft" | "published";
  const meta_title = formData.get("meta_title") as string;
  const meta_description = formData.get("meta_description") as string;

  if (!id || !title || !slug || !content) {
    throw new Error("ID, title, slug and content are required");
  }

  // Get current post to check if status changed
  const { data: currentPost } = await supabase
    .from("posts")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const updateData: any = {
    title,
    slug,
    content,
    excerpt: excerpt || null,
    featured_image_url: featured_image_url || null,
    category_id: category_id || null,
    status,
    meta_title: meta_title || null,
    meta_description: meta_description || null,
  };

  // Set published_at if status changed to published
  if (status === "published" && currentPost?.status !== "published") {
    updateData.published_at = new Date().toISOString();
  } else if (status !== "published") {
    updateData.published_at = null;
  }

  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// Delete post
export async function deletePost(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }

  revalidatePath("/admin/posts");
}

// Update post status
export async function updatePostStatus(
  id: string,
  status: "draft" | "published" | "archived"
) {
  const supabase = await createClient();

  const updateData: any = { status };

  // Set published_at if publishing
  if (status === "published") {
    updateData.published_at = new Date().toISOString();
  } else if (status === "draft" || status === "archived") {
    updateData.published_at = null;
  }

  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update post status: ${error.message}`);
  }

  revalidatePath("/admin/posts");
}

// Generate slug from title
export async function generateSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Get post stats
export async function getPostStats() {
  const supabase = await createClient();

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

  const { count: archivedPosts } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "archived");

  return {
    total: totalPosts || 0,
    published: publishedPosts || 0,
    draft: draftPosts || 0,
    archived: archivedPosts || 0,
  };
}
