"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Eye,
  Clock,
  Heart,
  ArrowLeft,
  Copy,
  Check,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";
import {
  BlogPost,
  incrementPostViews,
  incrementPostLikes,
} from "@/app/actions/blog-actions";
import { hasUserLikedPost, markPostAsLiked } from "@/lib/blog-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [views, setViews] = useState(post.views);
  const [copied, setCopied] = useState(false);

  // Track view and check if user has liked this post
  useEffect(() => {
    // Increment view count
    incrementPostViews(post.id);
    setViews((prev) => prev + 1);

    // Check if user has already liked this post
    setIsLiked(hasUserLikedPost(post.id));
  }, [post.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  };

  const handleLike = async () => {
    if (isLiked) {
      toast.info("You've already liked this post!");
      return;
    }

    try {
      const newLikeCount = await incrementPostLikes(post.id);
      if (newLikeCount !== null) {
        setIsLiked(true);
        setLikes(newLikeCount);
        markPostAsLiked(post.id);
        toast.success("Thanks for liking this post!");
      }
    } catch (error) {
      toast.error("Failed to like post. Please try again.");
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy link");
      }
      return;
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    };

    if (platform && shareUrls[platform as keyof typeof shareUrls]) {
      window.open(
        shareUrls[platform as keyof typeof shareUrls],
        "_blank",
        "width=600,height=400"
      );
    }
  };

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Back Button */}
      <div className="p-6 pb-0">
        <Link href="/blog">
          <Button variant="ghost" className="mb-6 -ml-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Featured Image */}
      {post.featured_image_url && (
        <div className="relative h-64 sm:h-80 lg:h-96 mx-6 rounded-lg overflow-hidden">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 lg:p-8">
        {/* Category */}
        {post.categories && (
          <div className="mb-4">
            <Link href={`/blog?category=${post.categories.slug}`}>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
                {post.categories.name}
              </Badge>
            </Link>
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(post.published_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{estimateReadTime(post.content)} min read</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            <span>{views} views</span>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, "<br />"),
            }}
          />
        </div>

        <Separator className="my-12" />

        {/* Engagement Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Like Button */}
          <div className="flex items-center gap-4">
            <Button
              variant={isLiked ? "default" : "outline"}
              onClick={handleLike}
              disabled={isLiked}
              className={`${
                isLiked
                  ? "bg-red-600 hover:bg-red-700 text-white cursor-not-allowed"
                  : "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              }`}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
              />
              {likes} {likes === 1 ? "Like" : "Likes"}
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("facebook")}
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              📘
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("twitter")}
              className="hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200"
            >
              🐦
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("linkedin")}
              className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              💼
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare("copy")}
              className="hover:bg-gray-50"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Need Financial Guidance?
            </h3>
            <p className="text-gray-600 mb-4">
              Our experts are here to help you make informed financial decisions
            </p>
            <Link href="/contact">
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                Get Expert Advice
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
