import { NextRequest, NextResponse } from 'next/server';
import { client } from '@gradio/client';
const sharp = require('sharp');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    // Get uploaded images (for IDM-VTON we need product image)
    const images: File[] = [];
    const MAX_IMAGES = 3;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per image

    for (let i = 0; i < MAX_IMAGES; i++) {
      const image = formData.get(`image${i}`) as File;
      if (image) {
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
    const firstImage = images[0];
    const bytes = await firstImage.arrayBuffer();

    // Compress image using sharp
    const compressedBuffer = await sharp(Buffer.from(bytes))
      .resize(1024, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    const base64Image = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;

    // Connect to Hugging Face IDM-VTON model
    const app = await client("yisol/IDM-VTON");

    // Use a default model image or white background for mockup
    // For mockup, we'll use the product image directly with prompt description
    const result = await app.predict("/tryon", [
      base64Image,  // Product image (will be used as garment)
      base64Image,  // Using same image as base (in production use model image)
      prompt,       // Description prompt
      true,         // Auto-mask
      true,         // Auto-crop
      30,           // Denoise steps
      42            // Seed
    ]);

    // Return the generated mockup
    return NextResponse.json({
      success: true,
      description: `Mock-up oluşturuldu: ${prompt}`,
      imageUrl: result.data[0], // Hugging Face returns image URL or base64
      message: 'Mock-up başarıyla oluşturuldu.',
    });

  } catch (error: any) {
    console.error('Mockup generation error:', error);
    return NextResponse.json(
      { error: 'Mock-up oluşturulurken hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}