import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// iyzico REST API helper
function generateAuthorizationHeader(
  apiKey: string,
  secretKey: string,
  randomString: string,
  requestPath: string,
  requestBody: string
): string {
  const authString = randomString + requestPath + requestBody;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(authString, 'utf8')
    .digest('base64');

  return `IYZWSv2 ${apiKey}:${signature}`;
}

// Handle both POST (form data from iyzico) and GET requests
async function handleCallback(request: NextRequest) {
  try {
    // Get form data from iyzico callback
    const formData = await request.formData();
    const body: Record<string, any> = {};

    formData.forEach((value, key) => {
      body[key] = value;
    });

    console.log('=== 3D Secure Callback Received ===');
    console.log('Callback Body:', JSON.stringify(body, null, 2));

    // Validate environment variables
    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;
    const baseUrl = process.env.IYZICO_BASE_URL;

    if (!apiKey || !secretKey || !baseUrl) {
      console.error('iyzico environment variables not configured');
      return NextResponse.json(
        { status: 'error', errorMessage: 'Ödeme sistemi yapılandırma hatası' },
        { status: 500 }
      );
    }

    // Get payment details from callback
    const { paymentId, conversationData, conversationId } = body;

    if (!paymentId) {
      console.error('paymentId missing in callback');
      return NextResponse.json(
        { status: 'error', errorMessage: 'Ödeme ID eksik' },
        { status: 400 }
      );
    }

    // Prepare request to verify 3D Secure payment
    const authRequest = {
      locale: 'tr',
      conversationId: conversationId || conversationData,
      paymentId,
    };

    // Generate authorization
    const randomString = crypto.randomBytes(16).toString('hex');
    const requestBody = JSON.stringify(authRequest);
    const requestPath = '/payment/3dsecure/auth';
    const authHeader = generateAuthorizationHeader(apiKey, secretKey, randomString, requestPath, requestBody);

    console.log('=== Calling 3D Secure Auth ===');
    console.log('Request:', authRequest);

    // Call iyzico 3D Secure Auth API
    const response = await fetch(`${baseUrl}/payment/3dsecure/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'x-iyzi-rnd': randomString,
      },
      body: requestBody,
    });

    const result = await response.json();

    console.log('=== 3D Secure Auth Response ===');
    console.log('Status Code:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));

    if (result.status === 'success') {
      // Payment successful - redirect to success page
      const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://meaculpa.vercel.app'}/payment-success?paymentId=${result.paymentId}&conversationId=${result.conversationId}`;

      // Return HTML to redirect
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ödeme Başarılı</title>
  <script>
    window.top.location.href = '${successUrl}';
  </script>
</head>
<body>
  <p>Ödeme başarılı! Yönlendiriliyorsunuz...</p>
</body>
</html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
    } else {
      console.error('3D Secure auth failed:', result);

      // Payment failed - redirect to failure page
      const failureUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://meaculpa.vercel.app'}/payment-failure?error=${encodeURIComponent(result.errorMessage || 'Ödeme başarısız')}`;

      // Return HTML to redirect
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ödeme Başarısız</title>
  <script>
    window.top.location.href = '${failureUrl}';
  </script>
</head>
<body>
  <p>Ödeme başarısız! Yönlendiriliyorsunuz...</p>
</body>
</html>`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        }
      );
    }
  } catch (error: any) {
    console.error('3D Secure Callback error:', error);
    console.error('Error stack:', error?.stack);

    const errorUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://meaculpa.vercel.app'}/payment-failure?error=${encodeURIComponent('Sunucu hatası')}`;

    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Hata</title>
  <script>
    window.top.location.href = '${errorUrl}';
  </script>
</head>
<body>
  <p>Bir hata oluştu. Yönlendiriliyorsunuz...</p>
</body>
</html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }
}

export const POST = handleCallback;
