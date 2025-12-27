"use client";

import { BlogCategory } from "@/app/actions/blog-actions";
import { deletePost, Post } from "@/app/actions/post-actions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Eye } from "lucide-react";
import { CreatePostDialog } from "./create-post-dialog";
import { EditPostDialog } from "./edit-post-dialog";
import Link from "next/link";

interface PostsTableProps {
  posts: Post[];
  categories: BlogCategory[];
}

export function PostsTable({ posts, categories }: PostsTableProps) {
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge variant="default">Published</Badge>;
      case "DRAFT":
        return <Badge variant="secondary">Draft</Badge>;
      case "ARCHIVED":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <CreatePostDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </CreatePostDialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div>
                    <div className="font-medium truncate max-w-[250px]">
                      {post.title}
                    </div>
                    <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {post.excerpt}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {post.categories ? (
                    <Badge variant="outline">{post.categories.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">No category</span>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(post.status)}</TableCell>
                <TableCell className="text-muted-foreground">Admin</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(post.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {post.status === "published" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <EditPostDialog post={post as Post}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </EditPostDialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs are now inline with buttons */}
    </div>
  );
}
