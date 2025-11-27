import { NextRequest, NextResponse } from 'next/server';
import { client } from '@gradio/client';
const sharp = require('sharp');

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Mock-up generator API started');

    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    console.log('📝 Prompt:', prompt);

    // Get uploaded images (for IDM-VTON we need product image)
    const images: File[] = [];
    const MAX_IMAGES = 3;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per image

    for (let i = 0; i < MAX_IMAGES; i++) {
      const image = formData.get(`image${i}`) as File;
      if (image) {
        console.log(`📷 Image ${i}: ${image.name}, size: ${(image.size / 1024 / 1024).toFixed(2)}MB`);
        if (image.size > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: `Görsel ${i + 1} çok büyük. Maksimum 10MB olmalı.` },
            { status: 400 }
          );
        }
        images.push(image);
      }
    }

    if (!prompt || images.length === 0) {
      return NextResponse.json(
        { error: 'Prompt ve en az bir fotoğraf gerekli' },
        { status: 400 }
      );
    }

    // Convert first image to base64
    console.log('🔄 Converting image to base64...');
    const firstImage = images[0];
    const bytes = await firstImage.arrayBuffer();

    // Compress image using sharp
    console.log('🗜️ Compressing image with sharp...');
    const compressedBuffer = await sharp(Buffer.from(bytes))
      .resize(1024, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();
    console.log(`✅ Compressed to ${(compressedBuffer.length / 1024).toFixed(2)}KB`);

    const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

    // Connect to Hugging Face IDM-VTON model
    console.log('🤗 Connecting to Hugging Face IDM-VTON...');
    const app = await client("yisol/IDM-VTON");
    console.log('✅ Connected to Hugging Face');

    // Use a default model image or white background for mockup
    // For mockup, we'll use the product image directly with prompt description
    console.log('🎨 Starting mock-up generation...');
    const result = await app.predict("/tryon", [
      base64Image,  // Product image (will be used as garment)
      base64Image,  // Using same image as base (in production use model image)
      prompt,       // Description prompt
      true,         // Auto-mask
      true,         // Auto-crop
      30,           // Denoise steps
      42            // Seed
    ]);
    console.log('✅ Mock-up generation completed');

    // Return the generated mockup
    const resultData = result.data as any;
    console.log('📤 Returning result');
    return NextResponse.json({
      success: true,
      description: `Mock-up oluşturuldu: ${prompt}`,
      imageUrl: resultData[0], // Hugging Face returns image URL or base64
      message: 'Mock-up başarıyla oluşturuldu.',
    });

  } catch (error: any) {
    console.error('❌ Mockup generation error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    return NextResponse.json(
      {
        error: 'Mock-up oluşturulurken hata oluştu',
        details: error.message,
        errorName: error.name,
        errorCode: error.code,
        hint: 'Hugging Face modeli yükleniyor veya meşgul olabilir. Lütfen 30 saniye sonra tekrar deneyin.'
      },
      { status: 500 }
    );
  }
}