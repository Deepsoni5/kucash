import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  folder?: string;
  resource_type?: "image" | "video" | "raw" | "auto";
  public_id?: string;
  transformation?: any[];
  tags?: string[];
}

/**
 * Upload file to Cloudinary
 * @param file - File buffer or base64 string
 * @param options - Upload options
 * @returns Promise with upload result
 */
export async function uploadToCloudinary(
  file: Buffer | string,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    const uploadOptions = {
      resource_type: options.resource_type || "auto",
      folder: options.folder || "kucash",
      ...options,
    };

    const fileToUpload: string =
      file instanceof Buffer
        ? `data:image/jpeg;base64,${file.toString("base64")}`
        : file;

    const result = await cloudinary.uploader.upload(
      fileToUpload,
      uploadOptions
    );

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - Public ID of the file to delete
 * @param resourceType - Type of resource (image, video, raw)
 * @returns Promise with deletion result
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image"
): Promise<{ result: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
}

/**
 * Generate optimized image URL with transformations
 * @param publicId - Public ID of the image
 * @param transformations - Array of transformations
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  publicId: string,
  transformations: any[] = []
): string {
  return cloudinary.url(publicId, {
    transformation: [
      { quality: "auto", fetch_format: "auto" },
      ...transformations,
    ],
  });
}

/**
 * Generate thumbnail URL
 * @param publicId - Public ID of the image
 * @param width - Thumbnail width (default: 150)
 * @param height - Thumbnail height (default: 150)
 * @returns Thumbnail URL
 */
export function getThumbnailUrl(
  publicId: string,
  width: number = 150,
  height: number = 150
): string {
  return getOptimizedImageUrl(publicId, [
    { width, height, crop: "fill", gravity: "face" },
  ]);
}

export default cloudinary;
