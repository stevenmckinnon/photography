import { NextResponse } from "next/server";
import { S3, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET() {
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY ||
    !process.env.AWS_BUCKET_NAME
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

  try {
    const data = await s3Client.listObjects({ Bucket: bucketName! });

    if (!data.Contents) {
      return NextResponse.json({ images: [] });
    }

    // Create an array of objects with the image details and presigned URLs
    const images = await Promise.all(
      data.Contents.map(async (object) => {
        if (!object.Key) return null;
        
        // Create a presigned URL that will work for direct access
        const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: object.Key,
        });
        
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
        
        return {
          name: object.Key,
          url: object.Key, // Keep the key for reference
          imageUrl: url, // Add the presigned URL for direct access
        };
      })
    ).then(results => results.filter(Boolean));

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error listing images from S3:", error);
    return new NextResponse("Error listing images from S3", { status: 500 });
  }
}
