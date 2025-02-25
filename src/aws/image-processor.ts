import Sharp from 'sharp';

export const handler = async (event: any) => {
  try {
    const { object } = event.getObject;
    
    // Get requested size from query parameters if available
    const { width, quality } = event.userRequest.url.queryStringParameters || {};
    
    // Process image with Sharp
    let imageProcessor = Sharp(object.body);
    
    // Resize if width parameter is provided
    if (width) {
      imageProcessor = imageProcessor.resize(parseInt(width, 10));
    } else {
      // Default resize to 800px width
      imageProcessor = imageProcessor.resize(800);
    }
    
    // Convert to WebP with specified or default quality
    const transformedImage = await imageProcessor
      .webp({ quality: quality ? parseInt(quality, 10) : 85 })
      .toBuffer();
    
    return {
      statusCode: 200,
      body: transformedImage,
      headers: { 
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      statusCode: 500,
      body: 'Error processing image',
      headers: { 'Content-Type': 'text/plain' }
    };
  }
}; 