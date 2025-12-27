"use server";

import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload agent photo to Cloudinary
 * @param formData - FormData containing the file
 * @returns Upload result with URL and public ID
 */
export async function uploadAgentPhoto(
  formData: FormData
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `agent_${timestamp}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, {
      folder: "kucash/agents/photos",
      public_id: filename,
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
      tags: ["agent", "profile", "photo"],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: "Failed to upload image. Please try again.",
    };
  }
}

/**
 * Upload document (PDF, images) to Cloudinary
 * @param formData - FormData containing the file
 * @param folder - Cloudinary folder path
 * @returns Upload result with URL and public ID
 */
export async function uploadDocument(
  formData: FormData,
  folder: string = "kucash/documents"
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type (images and PDFs)
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Only images (JPEG, PNG, WebP) and PDF files are allowed",
      };
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 10MB" };
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split(".").pop() || "file";
    const filename = `doc_${timestamp}.${extension}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, {
      folder,
      public_id: filename,
      resource_type: file.type === "application/pdf" ? "raw" : "image",
      tags: ["document", "upload"],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Document upload error:", error);
    return {
      success: false,
      error: "Failed to upload document. Please try again.",
    };
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource (image, raw)
 * @returns Deletion result
 */
export async function deleteUploadedFile(
  publicId: string,
  resourceType: "image" | "raw" = "image"
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteFromCloudinary(publicId, resourceType);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: "Failed to delete file",
    };
  }
}
