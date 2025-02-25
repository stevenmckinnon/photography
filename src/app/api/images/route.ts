import { NextResponse } from "next/server";
import { S3 } from "@aws-sdk/client-s3";

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

    // Create an array of objects with the image details
    const images = data.Contents.map((object) => {
      return {
        name: object.Key,
        url: object.Key,
      };
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error listing images from S3:", error);
    return new NextResponse("Error listing images from S3", { status: 500 });
  }
}
