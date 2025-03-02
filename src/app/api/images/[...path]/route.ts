import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  try {
    // Get path parameters
    const path = params.path.join('/');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const width = searchParams.get('width');
    const quality = searchParams.get('quality') || '85';
    
    if (!process.env.AWS_CLOUDFRONT_URL) {
      return NextResponse.json(
        { error: 'Missing CloudFront configuration' },
        { status: 500 }
      );
    }
    
    // Ensure CloudFront URL doesn't end with a slash
    const cloudfrontUrl = process.env.AWS_CLOUDFRONT_URL.endsWith('/')
      ? process.env.AWS_CLOUDFRONT_URL.slice(0, -1)
      : process.env.AWS_CLOUDFRONT_URL;
    
    // Get the original image from CloudFront
    const imageUrl = `${cloudfrontUrl}/${encodeURIComponent(path)}`;
    
    console.log('Fetching image from:', imageUrl);
    
    // Fetch the image with explicit headers
    const response = await fetch(imageUrl, {
      headers: {
        'Accept': 'image/*',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('CloudFront fetch error:', {
        status: response.status,
        statusText: response.statusText,
        url: imageUrl
      });
      
      return NextResponse.json(
        { 
          error: 'Image not found', 
          status: response.status,
          url: imageUrl 
        },
        { status: response.status }
      );
    }
    
    // Get the image buffer
    const buffer = await response.arrayBuffer();
    
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
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 