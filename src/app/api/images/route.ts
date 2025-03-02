import { NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";

export async function GET() {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_BUCKET_NAME ||
    !process.env.AWS_CLOUDFRONT_URL
  ) {
    console.error("Missing AWS credentials or configuration");
    return new NextResponse("Server configuration error", { status: 500 });
  }

  const s3Client = new S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const bucketName = process.env.AWS_BUCKET_NAME;
  // Ensure CloudFront URL doesn't end with a slash
  const cloudfrontUrl = process.env.AWS_CLOUDFRONT_URL.endsWith('/')
    ? process.env.AWS_CLOUDFRONT_URL.slice(0, -1)
    : process.env.AWS_CLOUDFRONT_URL;

  try {
    const data = await s3Client.listObjects({ Bucket: bucketName! });

    if (!data.Contents) {
      return NextResponse.json({ images: [] });
    }

    // Group files by their base name (without extension)
    const fileGroups: Record<string, { original: string; webp?: string }> = {};
    
    data.Contents.forEach((object) => {
      if (!object.Key) return;
      
      const key = object.Key;
      const isWebP = key.toLowerCase().endsWith('.webp');
      const extension = key.substring(key.lastIndexOf('.'));
      const baseName = key.substring(0, key.lastIndexOf('.'));
      
      if (!fileGroups[baseName]) {
        fileGroups[baseName] = { original: key };
      }
      
      if (isWebP) {
        fileGroups[baseName].webp = key;
      } else if (!fileGroups[baseName].original || extension.toLowerCase() !== '.webp') {
        // Prefer non-webp as the original fallback
        fileGroups[baseName].original = key;
      }
    });

    // Create an array of objects with the image details and CloudFront URLs
    const images = Object.entries(fileGroups)
      .map(([baseName, files]) => {
        const originalKey = files.original;
        const webpKey = files.webp;
        
        if (!originalKey) return null;
        
        // Generate CloudFront URLs with proper encoding
        const originalUrl = `${cloudfrontUrl}/${encodeURIComponent(originalKey)}`;
        const webpUrl = webpKey ? `${cloudfrontUrl}/${encodeURIComponent(webpKey)}` : null;
        
        return {
          name: baseName,
          url: originalKey, // Keep the original key for reference
          imageUrl: originalUrl, // Original image URL (jpg/png)
          webpUrl: webpUrl, // WebP version URL if available
          hasWebP: !!webpUrl,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error listing images from S3:", error);
    return new NextResponse("Error listing images from S3", { status: 500 });
  }
}
