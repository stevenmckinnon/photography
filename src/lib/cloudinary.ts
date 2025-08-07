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
}

export async function listImages(folder?: string): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: 500,
    });

    return result.resources.map((resource: CloudinaryResource) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      resource_type: resource.resource_type,
      original_filename: resource.original_filename,
    }));
  } catch (error) {
    console.error('Error listing Cloudinary images:', error);
    throw error;
  }
}

export function getImageUrl(publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
} = {}): string {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    crop = 'fill'
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);

  const transformationString = transformations.length > 0 ? transformations.join(',') : '';

  return cloudinary.url(publicId, {
    secure: true,
    transformation: transformationString ? [transformationString] : undefined,
  });
}

export function getOptimizedImageUrl(publicId: string, width = 800): string {
  return getImageUrl(publicId, {
    width,
    quality: 80,
    format: 'webp',
    crop: 'fill'
  });
}

export function getThumbnailUrl(publicId: string, width = 400): string {
  return getImageUrl(publicId, {
    width,
    quality: 70,
    format: 'webp',
    crop: 'thumb'
  });
}
