import { NextRequest, NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  
  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }
  
  if (
    !process.env.AWS_CLOUDFRONT_URL ||
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_BUCKET_NAME
  ) {
    console.error("Missing AWS configuration");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  try {
    // Ensure CloudFront URL doesn't end with a slash
    const cloudfrontUrl = process.env.AWS_CLOUDFRONT_URL.endsWith('/')
      ? process.env.AWS_CLOUDFRONT_URL.slice(0, -1)
      : process.env.AWS_CLOUDFRONT_URL;
    
    // Generate CloudFront URL with proper encoding for the original image
    const url = `${cloudfrontUrl}/${encodeURIComponent(key)}`;
    
    // Check if a WebP version exists
    const s3Client = new S3({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    const bucketName = process.env.AWS_BUCKET_NAME;
    const baseName = key.substring(0, key.lastIndexOf('.'));
    const webpKey = `${baseName}.webp`;
    
    // Check if the WebP version exists in S3
    try {
      await s3Client.headObject({
        Bucket: bucketName,
        Key: webpKey
      });
      
      // WebP exists, include its URL
      const webpUrl = `${cloudfrontUrl}/${encodeURIComponent(webpKey)}`;
      return NextResponse.json({ url, webpUrl, hasWebP: true });
    } catch (error) {
      // WebP doesn't exist or error occurred, return only the original URL
      console.log(`No WebP version found for ${key}`);
      return NextResponse.json({ url, hasWebP: false });
    }
  } catch (error) {
    console.error("Error generating CloudFront URL:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
} 