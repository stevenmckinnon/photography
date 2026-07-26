import { NextResponse } from "next/server";
import {
  LIGHTBOX_WIDTH,
  buildSrcSet,
  getImageUrl,
  listImages,
} from "@/lib/cloudinary";
import { DATA } from "@/data/resume";
import type { GalleryImage } from "@/types/gallery";

/**
 * Used when an image has no `alt` set in its Cloudinary context. Generic, but
 * a filename read aloud by a screen reader is worse than useless — set the
 * `alt` context field per image in the Cloudinary media library to improve it.
 */
const FALLBACK_ALT = `Photograph by ${DATA.name}`;

export async function GET() {
  if (!process.env.CLOUDINARY_URL) {
    console.error("Missing Cloudinary URL configuration");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  try {
    const images = await listImages();

    const transformedImages: GalleryImage[] = images.map((image) => {
      // Strip Cloudinary random ID suffix (e.g., "_n6q8p9") from filename
      let cleanName = image.original_filename || image.public_id.split('/').pop() || image.public_id;

      // Remove Cloudinary suffix pattern (underscore followed by 6 alphanumeric characters)
      cleanName = cleanName.replace(/_[a-zA-Z0-9]{6}$/, '');

      const custom = image.context?.custom;

      return {
        name: cleanName,
        url: image.public_id,
        // Resized, auto-format, auto-quality derivatives. The originals are
        // 4000x6000 JPEGs — never send those to the browser.
        imageUrl: getImageUrl(image.public_id, { width: 800 }),
        srcSet: buildSrcSet(image.public_id),
        fullUrl: getImageUrl(image.public_id, { width: LIGHTBOX_WIDTH }),
        alt: custom?.alt || FALLBACK_ALT,
        caption: custom?.caption,
        width: image.width,
        height: image.height,
      };
    });

    return NextResponse.json({ images: transformedImages });
  } catch (error) {
    console.error("Error listing images from Cloudinary:", error);
    return new NextResponse("Error listing images from Cloudinary", { status: 500 });
  }
}
