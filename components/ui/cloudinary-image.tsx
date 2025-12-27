"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  transformation?: string;
  priority?: boolean;
  fill?: boolean;
}

export function CloudinaryImage({
  src,
  alt,
  width = 400,
  height = 400,
  className,
  transformation,
  priority = false,
  fill = false,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extract public ID from Cloudinary URL
  const getPublicId = (url: string) => {
    const parts = url.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");
    if (uploadIndex !== -1 && uploadIndex < parts.length - 1) {
      // Skip version if present (starts with 'v' followed by numbers)
      const afterUpload = parts.slice(uploadIndex + 1);
      const versionIndex = afterUpload.findIndex((part) => /^v\d+$/.test(part));
      const pathParts =
        versionIndex !== -1 ? afterUpload.slice(versionIndex + 1) : afterUpload;
      return pathParts.join("/").replace(/\.[^/.]+$/, ""); // Remove file extension
    }
    return url;
  };

  // Build optimized Cloudinary URL
  const buildCloudinaryUrl = (publicId: string) => {
    const baseUrl = `https://res.cloudinary.com/dkut75boo/image/upload`;
    const transforms = [];

    // Add custom transformation if provided
    if (transformation) {
      transforms.push(transformation);
    } else {
      // Default optimizations
      transforms.push("f_auto,q_auto");
      if (!fill) {
        transforms.push(`w_${width},h_${height},c_fill`);
      }
    }

    const transformString = transforms.join(",");
    return `${baseUrl}/${transformString}/${publicId}`;
  };

  // Handle direct Cloudinary URLs or build optimized URL
  const imageUrl = src.includes("cloudinary.com")
    ? transformation
      ? buildCloudinaryUrl(getPublicId(src))
      : src
    : src;

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground rounded-lg",
          className
        )}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      <Image
        src={imageUrl}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />

      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse"
          style={fill ? undefined : { width, height }}
        >
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
    </div>
  );
}
