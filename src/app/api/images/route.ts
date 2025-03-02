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

    // Create an array of objects with the image details and CloudFront URLs
    const images = data.Contents
      .map((object) => {
        if (!object.Key) return null;
        
        // Generate CloudFront URL with proper encoding
        const imageUrl = `${cloudfrontUrl}/${encodeURIComponent(object.Key)}`;
        
        return {
          name: object.Key,
          url: object.Key, // Keep the key for reference
          imageUrl: imageUrl, // Use CloudFront URL for direct access
        };
      })
      .filter(Boolean);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error listing images from S3:", error);
    return new NextResponse("Error listing images from S3", { status: 500 });
  }
}
