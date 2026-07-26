import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import { DATA } from "@/data/resume";
import type { GalleryImage } from "@/types/gallery";

import {
  LIGHTBOX_WIDTH,
  buildSrcSet,
  getImageUrl,
  listImages,
} from "./cloudinary";

/**
 * Used when an image has no `alt` set in its Cloudinary context. Generic, but
 * a filename read aloud by a screen reader is worse than useless — set the
 * `alt` context field per image in the Cloudinary media library to improve it.
 */
const FALLBACK_ALT = `Photograph by ${DATA.name}`;

/** Width of the inlined blur-up preview. Small enough to embed as base64. */
const LQIP_WIDTH = 32;

/**
 * Sanity guard. Real previews measure 100-2000 bytes (busy images compress
 * worse). Anything past this means the transformation silently didn't apply,
 * so skip it rather than inline kilobytes per image.
 */
const LQIP_MAX_BYTES = 2560;

/**
 * Fetches a tiny preview and returns it as a data URI. Runs only when the
 * gallery cache is cold, so visitors pay no extra requests for it.
 *
 * Returns undefined on any failure — a missing preview must never break the
 * gallery.
 */
async function fetchBlurPlaceholder(
  publicId: string
): Promise<string | undefined> {
  try {
    // Force webp rather than f_auto: this runs server-side, where the Accept
    // header wouldn't reflect the visitor's browser anyway, and we need to
    // know the mime type for the data URI.
    // `q_auto:low` matters here — a numeric quality makes Cloudinary emit
    // lossless webp, which is ~3KB even at 32px versus ~200 bytes for this.
    const url = getImageUrl(publicId, {
      width: LQIP_WIDTH,
      quality: "auto:low",
      format: "webp",
    });

    const response = await fetch(url);
    if (!response.ok) return undefined;

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > LQIP_MAX_BYTES) {
      return undefined;
    }

    return `data:image/webp;base64,${bytes.toString("base64")}`;
  } catch {
    return undefined;
  }
}

/**
 * The gallery, straight from Cloudinary.
 *
 * Cached because `listImages` uses Cloudinary's *Admin* API, which is capped
 * at 500 calls/hour per account. Calling it per page view would take the
 * gallery down under very modest traffic. Revalidate on demand by calling
 * `revalidateTag("gallery")`.
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("gallery");

  if (!process.env.CLOUDINARY_URL) {
    throw new Error("Missing Cloudinary configuration");
  }

  const images = await listImages();

  return Promise.all(
    images.map(async (image): Promise<GalleryImage> => {
      // Strip Cloudinary random ID suffix (e.g., "_n6q8p9") from filename
      let cleanName =
        image.original_filename ||
        image.public_id.split("/").pop() ||
        image.public_id;

      // Remove Cloudinary suffix pattern (underscore + 6 alphanumerics)
      cleanName = cleanName.replace(/_[a-zA-Z0-9]{6}$/, "");

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
        blurDataURL: await fetchBlurPlaceholder(image.public_id),
        width: image.width,
        height: image.height,
      };
    })
  );
}
