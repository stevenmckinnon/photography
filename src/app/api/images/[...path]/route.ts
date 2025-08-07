import { NextRequest, NextResponse } from 'next/server';
import { getImageUrl } from '@/lib/cloudinary';

export async function GET(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  
  try {
    // Get path parameters
    const path = params.path.join('/');
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const width = searchParams.get('width');
    const quality = searchParams.get('quality') || '80';
    
    if (!process.env.CLOUDINARY_URL) {
      return NextResponse.json(
        { error: 'Missing Cloudinary configuration' },
        { status: 500 }
      );
    }
    
    // Generate Cloudinary URL with transformations
    const imageUrl = getImageUrl(path, {
      width: width ? parseInt(width, 10) : undefined,
      quality: parseInt(quality, 10),
      format: 'webp',
      crop: 'fill'
    });
    
    // Redirect to the Cloudinary URL
    return NextResponse.redirect(imageUrl);
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 