import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  
  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }
  
  if (!process.env.AWS_CLOUDFRONT_URL) {
    console.error("Missing CloudFront URL configuration");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  try {
    // Ensure CloudFront URL doesn't end with a slash
    const cloudfrontUrl = process.env.AWS_CLOUDFRONT_URL.endsWith('/')
      ? process.env.AWS_CLOUDFRONT_URL.slice(0, -1)
      : process.env.AWS_CLOUDFRONT_URL;
    
    // Generate CloudFront URL with proper encoding
    const url = `${cloudfrontUrl}/${encodeURIComponent(key)}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating CloudFront URL:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
} 