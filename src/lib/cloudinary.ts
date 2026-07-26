import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from URL format
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_URL.split('@')[1],
    api_key: process.env.CLOUDINARY_URL.split('://')[1].split(':')[0],
    api_secret: process.env.CLOUDINARY_URL.split('://')[1].split(':')[1].split('@')[0],
  });
} else {
  // Fallback to individual environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  original_filename: string;
  /** Custom context set in the Cloudinary media library (alt, caption). */
  context?: CloudinaryContext;
}

export interface CloudinaryContext {
  custom?: {
    alt?: string;
    caption?: string;
  };
}

export interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  access_mode: string;
  original_filename: string;
  context?: CloudinaryContext;
}

export async function listImages(folder?: string): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 500,
      // Opt in to custom metadata so per-image alt text and captions set in
      // the Cloudinary media library come through.
      context: true,
    });

    return result.resources.map((resource: CloudinaryResource) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      resource_type: resource.resource_type,
      original_filename: resource.original_filename,
      context: resource.context,
    }));
  } catch (error) {
    console.error('Error listing Cloudinary images:', error);
    throw error;
  }
}

export function getImageUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number | 'auto' | 'auto:low' | 'auto:eco' | 'auto:good' | 'auto:best';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
} = {}): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    // `limit` scales down to fit but never upscales, so we never pay to
    // deliver more pixels than the original actually has.
    crop = 'limit'
  } = options;

  // Must be an object — passing a raw string makes the SDK emit `t_<string>`,
  // which Cloudinary reads as a *named* transformation rather than parameters.
  return cloudinary.url(publicId, {
    secure: true,
    width,
    height,
    crop,
    quality,
    fetch_format: format,
  });
}

/** Widths offered to the browser for grid thumbnails. */
export const GRID_WIDTHS = [400, 600, 800, 1200, 1600] as const;

/** Width used for the lightbox / full-screen view. */
export const LIGHTBOX_WIDTH = 1800;

export function getOptimizedImageUrl(publicId: string, width = 800): string {
  return getImageUrl(publicId, { width });
}

/**
 * Builds a `srcset` so the browser downloads the smallest file that still
 * covers the rendered box at its device pixel ratio.
 */
export function buildSrcSet(publicId: string, widths: readonly number[] = GRID_WIDTHS): string {
  return widths
    .map((width) => `${getImageUrl(publicId, { width })} ${width}w`)
    .join(', ');
}
