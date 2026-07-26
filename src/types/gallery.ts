export type GalleryImage = {
  /** Cleaned original filename, used as a stable React key. */
  name: string;
  /** Cloudinary public_id. */
  url: string;
  /** Default grid `src` (800px wide, auto format/quality). */
  imageUrl: string;
  /** Responsive candidates for the grid. */
  srcSet: string;
  /** Larger derivative used by the lightbox. */
  fullUrl: string;
  /**
   * Alt text. Sourced from the image's `alt` context field in Cloudinary when
   * set, otherwise a generic fallback — never the raw filename.
   */
  alt: string;
  /** Human-readable caption shown in the lightbox, when set in Cloudinary. */
  caption?: string;
  /**
   * Inlined ~24px preview (base64 data URI) painted behind the image so it
   * resolves from a blur instead of appearing out of nothing. Undefined if
   * the preview could not be generated.
   */
  blurDataURL?: string;
  width: number;
  height: number;
};
