import { NextRequest, NextResponse } from "next/server";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  
  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }
  
  if (!process.env.CLOUDINARY_URL) {
    console.error("Missing Cloudinary configuration");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  try {
    // Generate optimized Cloudinary URL
    const url = getOptimizedImageUrl(key);
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating Cloudinary URL:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
} 