"use server";

import { createClient } from "@/lib/supabase/server";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category_id: string | null;
  status: string;
  views: number;
  likes: number;
  published_at: string;
  created_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

// Internal type for Supabase response
interface SupabasePost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category_id: string | null;
  status: string;
  views: number;
  likes: number;
  published_at: string;
  created_at: string;
  categories?:
    | {
        id: string;
        name: string;
        slug: string;
      }[]
    | null;
}

// Helper function to convert Supabase response to BlogPost
function convertToBlogPost(supabasePost: SupabasePost): BlogPost {
  return {
    ...supabasePost,
    categories:
      supabasePost.categories && supabasePost.categories.length > 0
        ? supabasePost.categories[0]
        : null,
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
  post_count?: number;
}

// Get all published posts
export async function getPublishedPosts(
  categorySlug?: string
): Promise<BlogPost[]> {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image_url,
      category_id,
      status,
      views,
      likes,
      published_at,
      created_at,
      categories!inner (
        id,
        name,
        slug
      )
    `
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // Filter by category if provided
  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching published posts:", error);
    return [];
  }

  return (data || []).map(convertToBlogPost);
}

// Get single published post by slug
export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();

  console.log("Searching for post with slug:", slug);

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image_url,
      category_id,
      status,
      views,
      likes,
      published_at,
      created_at,
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    console.log("Attempted slug:", slug);

    // Try to find any posts with similar slugs for debugging
    const { data: allPosts } = await supabase
      .from("posts")
      .select("slug, title, status")
      .limit(10);

    console.log("Available posts:", allPosts);
    return null;
  }

  return data ? convertToBlogPost(data as SupabasePost) : null;
}

// Get all categories with post counts
export async function getBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      `
      id,
      name,
      slug,
      description,
      created_at
    `
    )
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  // Get post counts for each category
  const categoriesWithCounts = await Promise.all(
    (data || []).map(async (category) => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
        .eq("status", "published");

      return {
        ...category,
        post_count: count || 0,
      };
    })
  );

  return categoriesWithCounts;
}

// Get featured posts (latest 3 published posts)
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image_url,
      category_id,
      status,
      views,
      likes,
      published_at,
      created_at,
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }

  return (data || []).map(convertToBlogPost);
}

// Increment post views
export async function incrementPostViews(postId: string) {
  const supabase = await createClient();

  // First get current views
  const { data: currentPost } = await supabase
    .from("posts")
    .select("views")
    .eq("id", postId)
    .single();

  if (currentPost) {
    const { error } = await supabase
      .from("posts")
      .update({
        views: currentPost.views + 1,
      })
      .eq("id", postId);

    if (error) {
      console.error("Error incrementing views:", error);
    }
  }
}

// Increment post likes
export async function incrementPostLikes(postId: string) {
  const supabase = await createClient();

  // First get current likes
  const { data: currentPost } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", postId)
    .single();

  if (currentPost) {
    const newLikes = currentPost.likes + 1;

    const { data, error } = await supabase
      .from("posts")
      .update({
        likes: newLikes,
      })
      .eq("id", postId)
      .select("likes")
      .single();

    if (error) {
      console.error("Error incrementing likes:", error);
      return null;
    }

    return data?.likes || 0;
  }

  return null;
}

// Search posts

export async function searchPosts(query: string): Promise<BlogPost[]> {
  const supabase = await createClient();

  if (!query.trim()) {
    return getPublishedPosts();
  }

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      slug,
      content,
      excerpt,
      featured_image_url,
      category_id,
      status,
      views,
      likes,
      published_at,
      created_at,
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq("status", "published")
    .or(
      `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
    )
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error searching posts:", error);
    return [];
  }

  return (data || []).map(convertToBlogPost);
}
