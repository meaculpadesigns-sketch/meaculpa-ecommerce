import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
const sharp = require('sharp');

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key yapılandırılmamış. Lütfen .env.local dosyasına GEMINI_API_KEY ekleyin.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    // Get all uploaded images (limit to 3 images to avoid 413 error)
    const images: File[] = [];
    const MAX_IMAGES = 3;
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per image

    for (let i = 0; i < MAX_IMAGES; i++) {
      const image = formData.get(`image${i}`) as File;
      if (image) {
        // Check file size
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

    // Compress and convert images to base64
    const imageParts = await Promise.all(
      images.map(async (image) => {
        const bytes = await image.arrayBuffer();

        // Compress image using sharp (max 1200px width, quality 80)
        const compressedBuffer = await sharp(Buffer.from(bytes))
          .resize(1200, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80 })
          .toBuffer();

        const base64 = compressedBuffer.toString('base64');

        return {
          inlineData: {
            data: base64,
            mimeType: 'image/jpeg',
          },
        };
      })
    );

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const enhancedPrompt = `
Sen bir profesyonel ürün fotoğrafçısı ve mockup tasarımcısısın.
Yüklenen ürün fotoğraflarını analiz et ve şu isteğe göre mockup oluştur:

${prompt}

Lütfen ürünün mockup'ını nasıl oluşturacağını detaylı olarak açıkla.
Arka plan, ışıklandırma, kompozisyon ve sunum önerilerini belirt.
`;

    const result = await model.generateContent([enhancedPrompt, ...imageParts]);
    const response = await result.response;
    const mockupDescription = response.text();

    // Use the first compressed image as preview
    const previewUrl = `data:image/jpeg;base64,${imageParts[0].inlineData.data}`;

    // For now, return the AI description
    // In production, you would use this description to generate actual mockup
    return NextResponse.json({
      success: true,
      description: mockupDescription,
      imageUrl: previewUrl,
      message: 'Mock-up önerisi oluşturuldu. Gerçek mockup için görsel işleme servisi entegre edilmeli.',
    });

  } catch (error: any) {
    console.error('Mockup generation error:', error);
    return NextResponse.json(
      { error: 'Mock-up oluşturulurken hata oluştu: ' + error.message },
      { status: 500 }
    );
  }
}