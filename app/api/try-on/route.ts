import { NextRequest, NextResponse } from 'next/server';
import { client } from '@gradio/client';
import { getProducts } from '@/lib/firebase-helpers';

export async function POST(request: NextRequest) {
  try {
    const { userImage, productId } = await request.json();

    if (!userImage || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get product details from Firebase
    const products = await getProducts();
    const product = products.find(p => p.id === productId);

    if (!product || !product.images || product.images.length === 0) {
      return NextResponse.json(
        { error: 'Product not found or has no images' },
        { status: 404 }
      );
    }

    // Get the first product image (garment image)
    const garmentImage = product.images[0];

    // Connect to Hugging Face IDM-VTON model
    const app = await client("yisol/IDM-VTON");

    // Call the try-on API
    const result = await app.predict("/tryon", [
      userImage,      // User's photo (base64 with data:image prefix)
      garmentImage,   // Product/garment image URL
      "High quality virtual try-on, professional photography", // Description
      true,           // Auto-mask (automatically detect garment area)
      true,           // Auto-crop
      30,             // Denoise steps (quality setting)
      42              // Seed (for reproducibility)
    ]);

    // Return the result
    const resultData = result.data as any;
    return NextResponse.json({
      success: true,
      resultImage: resultData[0], // Hugging Face returns the try-on result image
      message: 'Sanal deneme başarıyla tamamlandı',
    });

  } catch (error: any) {
    console.error('Try-on API error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      {
        error: 'Sanal deneme sırasında hata oluştu',
        details: error.message,
        hint: 'Hugging Face modeli yükleniyor veya meşgul olabilir. Lütfen 30 saniye sonra tekrar deneyin.'
      },
      { status: 500 }
    );
  }
}
