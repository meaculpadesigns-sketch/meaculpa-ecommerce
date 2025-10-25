import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userImage, productId } = await request.json();

    if (!userImage || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Call Gemini API for image generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a virtual try-on AI assistant. The user has uploaded their photo and wants to see how product ${productId} would look on them. Generate a realistic visualization of the person wearing this product. Focus on accurate fitting, proper sizing, and natural appearance. The product should blend seamlessly with the person's body and posture.`,
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: userImage.split(',')[1], // Remove data:image/jpeg;base64, prefix
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Extract the generated text/image from Gemini response
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    // For now, return a mock result
    // In production, you would process the Gemini response properly
    return NextResponse.json({
      success: true,
      resultImage: userImage, // Mock: return same image
      message: resultText || 'Try-on completed successfully',
    });
  } catch (error) {
    console.error('Try-on API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
