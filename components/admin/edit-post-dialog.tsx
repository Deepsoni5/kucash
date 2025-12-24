"use client";

import { useState, useEffect } from "react";
import { Post, updatePost, generateSlug } from "@/app/actions/post-actions";
import { getCategories } from "@/app/actions/category-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditPostDialogProps {
  post: Post;
  children: React.ReactNode;
}

export function EditPostDialog({ post, children }: EditPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Form state
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [content, setContent] = useState(post.content);
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    post.featured_image_url || ""
  );
  const [categoryId, setCategoryId] = useState(post.category_id || "");
  const [status, setStatus] = useState<"draft" | "published" | "archived">(
    post.status
  );
  const [metaTitle, setMetaTitle] = useState(post.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    post.meta_description || ""
  );
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  // Load categories when dialog opens
  useEffect(() => {
    if (open) {
      loadCategories();
    }
  }, [open]);

  // Reset form when post changes or dialog opens
  useEffect(() => {
    if (open) {
      setTitle(post.title);
      setSlug(post.slug);
      setContent(post.content);
      setExcerpt(post.excerpt || "");
      setFeaturedImageUrl(post.featured_image_url || "");
      setCategoryId(post.category_id || "");
      setStatus(post.status);
      setMetaTitle(post.meta_title || "");
      setMetaDescription(post.meta_description || "");
      setIsSlugManuallyEdited(false);
    }
  }, [post, open]);

  // Auto-generate slug from title (only if not manually edited)
  useEffect(() => {
    if (!isSlugManuallyEdited && title && title !== post.title) {
      const generateAndSetSlug = async () => {
        const newSlug = await generateSlug(title);
        setSlug(newSlug);
      };
      generateAndSetSlug();
    }
  }, [title, isSlugManuallyEdited, post.title]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setIsSlugManuallyEdited(true);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await updatePost(formData);
      toast.success("Post updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to the post details.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={post.id} />
          <input
            type="hidden"
            name="category_id"
            value={categoryId === "none" ? "" : categoryId}
          />

          <div className="grid gap-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            {/* Slug */}
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                name="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="post-slug"
                required
              />
              <p className="text-xs text-muted-foreground">
                URL-friendly version of the title.
              </p>
            </div>

            {/* Content */}
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={8}
                required
              />
            </div>

            {/* Excerpt */}
            <div className="grid gap-2">
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                name="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post"
                rows={3}
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category_id">Category</Label>
                <Select
                  value={categoryId || "none"}
                  onValueChange={(value) =>
                    setCategoryId(value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  name="status"
                  value={status}
                  onValueChange={(value: "draft" | "published" | "archived") =>
                    setStatus(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Featured Image */}
            <div className="grid gap-2">
              <Label htmlFor="edit-featured_image_url">
                Featured Image URL
              </Label>
              <Input
                id="edit-featured_image_url"
                name="featured_image_url"
                type="url"
                value={featuredImageUrl}
                onChange={(e) => setFeaturedImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* SEO Fields */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-medium">SEO Settings</h4>

              <div className="grid gap-2">
                <Label htmlFor="edit-meta_title">Meta Title</Label>
                <Input
                  id="edit-meta_title"
                  name="meta_title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO title (leave empty to use post title)"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-meta_description">Meta Description</Label>
                <Textarea
                  id="edit-meta_description"
                  name="meta_description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO description for search engines"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title || !slug || !content}
            >
              {isSubmitting ? "Updating..." : "Update Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
