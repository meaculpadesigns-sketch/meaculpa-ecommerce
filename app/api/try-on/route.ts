import { NextRequest, NextResponse } from 'next/server';
import { client } from '@gradio/client';
import { getProducts } from '@/lib/firebase-helpers';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Try-on API started');

    const { userImage, productId } = await request.json();
    console.log('📦 Request data:', { productId, userImageLength: userImage?.length });

    if (!userImage || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get product details from Firebase
    console.log('🔍 Fetching product from Firebase...');
    const products = await getProducts();
    const product = products.find(p => p.id === productId);
    console.log('✅ Product found:', product?.name);

    if (!product || !product.images || product.images.length === 0) {
      return NextResponse.json(
        { error: 'Product not found or has no images' },
        { status: 404 }
      );
    }

    // Get the first product image (garment image)
    const garmentImage = product.images[0];
    console.log('👕 Garment image URL:', garmentImage);

    // Connect to Hugging Face IDM-VTON model with authentication
    console.log('🤗 Connecting to Hugging Face IDM-VTON...');
    const hfToken = process.env.HUGGINGFACE_API_TOKEN;
    console.log('🔑 HF Token exists:', !!hfToken);

    const app = await client("yisol/IDM-VTON", {
      hf_token: hfToken
    });
    console.log('✅ Connected to Hugging Face');

    // Call the try-on API
    console.log('🎨 Starting virtual try-on prediction...');
    const result = await app.predict("/tryon", [
      userImage,      // User's photo (base64 with data:image prefix)
      garmentImage,   // Product/garment image URL
      "High quality virtual try-on, professional photography", // Description
      true,           // Auto-mask (automatically detect garment area)
      true,           // Auto-crop
      30,             // Denoise steps (quality setting)
      42              // Seed (for reproducibility)
    ]);
    console.log('✅ Prediction completed');

    // Return the result
    const resultData = result.data as any;
    console.log('📤 Returning result, data type:', typeof resultData);
    return NextResponse.json({
      success: true,
      resultImage: resultData[0], // Hugging Face returns the try-on result image
      message: 'Sanal deneme başarıyla tamamlandı',
    });

  } catch (error: any) {
    console.error('❌ Try-on API error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    return NextResponse.json(
      {
        error: 'Sanal deneme sırasında hata oluştu',
        details: error.message,
        errorName: error.name,
        errorCode: error.code,
        hint: 'Hugging Face modeli yükleniyor veya meşgul olabilir. Lütfen 30 saniye sonra tekrar deneyin.'
      },
      { status: 500 }
    );
  }
}
