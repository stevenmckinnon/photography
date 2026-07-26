import { NextResponse } from "next/server";

import { getGalleryImages } from "@/lib/gallery";

export async function GET() {
  try {
    // Goes through the cached source so this endpoint can't burn the
    // Cloudinary Admin API quota.
    const images = await getGalleryImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error listing images from Cloudinary:", error);
    return new NextResponse("Error listing images from Cloudinary", {
      status: 500,
    });
  }
}
