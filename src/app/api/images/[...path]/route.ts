import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get path parameters
    const path = params.path.join('/');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const width = searchParams.get('width');
    const quality = searchParams.get('quality') || '85';
    
    // Get the original image from S3
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'photography',
      Key: path,
    });
    
    const { Body } = await s3Client.send(command);
    
    if (!Body) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Convert to ArrayBuffer
    const buffer = await Body.transformToByteArray();
    
    // Process with Sharp
    let imageProcessor = sharp(Buffer.from(buffer));
    
    // Resize if width parameter is provided
    if (width) {
      imageProcessor = imageProcessor.resize(parseInt(width, 10));
    }
    
    // Convert to WebP
    const processedImage = await imageProcessor
      .webp({ quality: parseInt(quality, 10) })
      .toBuffer();
    
    // Return the processed image
    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 