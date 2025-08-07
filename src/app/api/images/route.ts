import { NextResponse } from "next/server";
import { listImages } from "@/lib/cloudinary";

export async function GET() {
  if (!process.env.CLOUDINARY_URL) {
    console.error("Missing Cloudinary URL configuration");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  try {
    const images = await listImages();

    // Transform Cloudinary images to match the expected format
    const transformedImages = images.map((image) => {
      // Strip Cloudinary random ID suffix (e.g., "_n6q8p9") from filename
      let cleanName = image.original_filename || image.public_id.split('/').pop() || image.public_id;
      
      // Remove Cloudinary suffix pattern (underscore followed by 6 alphanumeric characters)
      cleanName = cleanName.replace(/_[a-zA-Z0-9]{6}$/, '');
      
      return {
        name: cleanName,
        url: image.public_id,
        imageUrl: image.secure_url,
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
