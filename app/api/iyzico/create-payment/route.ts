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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.cardHolderName || !body.cardNumber || !body.expireMonth || !body.expireYear || !body.cvc) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Kart bilgileri eksik' },
        { status: 400 }
      );
    }

    const apiKey = process.env.IYZICO_API_KEY!;
    const secretKey = process.env.IYZICO_SECRET_KEY!;
    const baseUrl = process.env.IYZICO_BASE_URL!;

    // Prepare payment request
    const conversationId = `conv_${Date.now()}`;
    const price = body.total.toFixed(2);
    const paidPrice = body.total.toFixed(2);

    const paymentRequest = {
      locale: 'tr',
      conversationId,
      price,
      paidPrice,
      currency: 'TRY',
      installment: 1,
      basketId: `basket_${Date.now()}`,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: body.cardHolderName,
        cardNumber: body.cardNumber.replace(/\s/g, ''),
        expireMonth: body.expireMonth,
        expireYear: body.expireYear,
        cvc: body.cvc,
        registerCard: 0,
      },
      buyer: {
        id: body.buyer.id || 'guest',
        name: body.buyer.name,
        surname: body.buyer.surname,
        gsmNumber: body.buyer.phone,
        email: body.buyer.email,
        identityNumber: '11111111111', // Test için sabit TC
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
        registrationAddress: body.buyer.address,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '85.34.78.112',
        city: body.buyer.city,
        country: 'Turkey',
        zipCode: body.buyer.zipCode,
      },
      shippingAddress: {
        contactName: `${body.shippingAddress.firstName} ${body.shippingAddress.lastName}`,
        city: body.shippingAddress.city,
        country: 'Turkey',
        address: body.shippingAddress.address,
        zipCode: body.shippingAddress.zipCode,
      },
      billingAddress: {
        contactName: `${body.billingAddress.firstName} ${body.billingAddress.lastName}`,
        city: body.billingAddress.city,
        country: 'Turkey',
        address: body.billingAddress.address,
        zipCode: body.billingAddress.zipCode,
      },
      basketItems: body.basketItems.map((item: any, index: number) => ({
        id: item.id || `item_${index}`,
        name: item.name.substring(0, 50), // Max 50 karakter
        category1: item.category1 || 'Fashion',
        category2: item.category2 || 'Clothing',
        itemType: 'PHYSICAL',
        price: item.price.toFixed(2),
      })),
    };

    // Generate authorization
    const randomString = crypto.randomBytes(16).toString('hex');
    const requestBody = JSON.stringify(paymentRequest);
    const requestPath = '/payment/auth';
    const authHeader = generateAuthorizationHeader(apiKey, secretKey, randomString, requestPath, requestBody);

    // Call iyzico API
    const response = await fetch(`${baseUrl}/payment/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'x-iyzi-rnd': randomString,
      },
      body: requestBody,
    });

    const result = await response.json();

    if (result.status === 'success') {
      return NextResponse.json({
        status: 'success',
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        paymentStatus: result.paymentStatus,
      });
    } else {
      console.error('iyzico payment failed:', result);
      return NextResponse.json(
        {
          status: 'error',
          errorMessage: result.errorMessage || 'Ödeme reddedildi',
          errorCode: result.errorCode,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { status: 'error', errorMessage: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
