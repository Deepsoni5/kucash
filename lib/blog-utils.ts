// Client-side utility functions for blog functionality

// Check if user has liked a post (using localStorage)
export function hasUserLikedPost(postId: string): boolean {
  if (typeof window === "undefined") return false;
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
  return likedPosts.includes(postId);
}

// Mark post as liked by user
export function markPostAsLiked(postId: string): void {
  if (typeof window === "undefined") return;
  const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
  if (!likedPosts.includes(postId)) {
    likedPosts.push(postId);
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
  }
}
