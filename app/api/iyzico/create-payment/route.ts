import { NextRequest, NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('🔴 İYZİCO SDK VERSION - DEPLOYMENT TIMESTAMP:', new Date().toISOString());
    console.log('🔴 Request body received:', JSON.stringify(body, null, 2));

    // Validate card fields
    if (!body.cardHolderName || !body.cardNumber || !body.expireMonth || !body.expireYear || !body.cvc) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Kart bilgileri eksik' },
        { status: 400 }
      );
    }

    // Validate payment amount
    if (!body.total || typeof body.total !== 'number' || body.total <= 0) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Geçersiz ödeme tutarı' },
        { status: 400 }
      );
    }

    // Validate buyer information
    if (!body.buyer) {
      console.error('Buyer object is missing');
      return NextResponse.json(
        { status: 'error', errorMessage: 'Alıcı bilgileri tamamen eksik' },
        { status: 400 }
      );
    }

    const missingBuyerFields = [];
    if (!body.buyer.name) missingBuyerFields.push('name');
    if (!body.buyer.surname) missingBuyerFields.push('surname');
    if (!body.buyer.email) missingBuyerFields.push('email');
    if (!body.buyer.phone) missingBuyerFields.push('phone');
    if (!body.buyer.address) missingBuyerFields.push('address');
    if (!body.buyer.city) missingBuyerFields.push('city');
    if (!body.buyer.zipCode) missingBuyerFields.push('zipCode');

    if (missingBuyerFields.length > 0) {
      console.error('Missing buyer fields:', missingBuyerFields);
      console.error('Buyer data received:', body.buyer);
      return NextResponse.json(
        {
          status: 'error',
          errorMessage: `Alıcı bilgileri eksik: ${missingBuyerFields.join(', ')}`,
          missingFields: missingBuyerFields
        },
        { status: 400 }
      );
    }

    // Validate shipping address
    if (!body.shippingAddress || !body.shippingAddress.firstName || !body.shippingAddress.lastName || !body.shippingAddress.address || !body.shippingAddress.city || !body.shippingAddress.zipCode) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Teslimat adresi eksik' },
        { status: 400 }
      );
    }

    // Validate billing address
    if (!body.billingAddress || !body.billingAddress.firstName || !body.billingAddress.lastName || !body.billingAddress.address || !body.billingAddress.city || !body.billingAddress.zipCode) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Fatura adresi eksik' },
        { status: 400 }
      );
    }

    // Validate basket items
    if (!body.basketItems || !Array.isArray(body.basketItems) || body.basketItems.length === 0) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'Sepet bilgileri eksik' },
        { status: 400 }
      );
    }

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

    // Initialize İyzico SDK
    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: baseUrl
    });

    // Prepare payment request
    const conversationId = `conv_${Date.now()}`;

    // Calculate basket total (sum of all items including shipping)
    const basketTotal = body.basketItems.reduce((sum: number, item: any) => sum + item.price, 0);

    // price = sum of basketItems, paidPrice = price - discount
    const price = basketTotal.toFixed(2);
    const discount = body.discount || 0;
    const paidPrice = (basketTotal - discount).toFixed(2);

    console.log('Basket items total:', basketTotal);
    console.log('Discount:', discount);
    console.log('Price (before discount):', price);
    console.log('Paid Price (after discount):', paidPrice);
    console.log('Total from body:', body.total);

    const paymentRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: conversationId,
      price: price,
      paidPrice: paidPrice,
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: `basket_${Date.now()}`,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://meaculpa.vercel.app'}/api/iyzico/3d-callback`,
      paymentCard: {
        cardHolderName: body.cardHolderName,
        cardNumber: body.cardNumber.replace(/\s/g, ''),
        expireMonth: body.expireMonth,
        expireYear: body.expireYear.toString().length === 4
          ? body.expireYear.toString().slice(-2)  // 2030 -> 30
          : body.expireYear.toString(),            // 30 -> 30
        cvc: body.cvc,
        registerCard: '0',
      },
      buyer: {
        id: body.buyer.id || 'guest',
        name: body.buyer.name.substring(0, 50),
        surname: body.buyer.surname.substring(0, 50),
        gsmNumber: '+90' + body.buyer.phone.replace(/\D/g, '').replace(/^0/, ''), // 0'ı kaldır ve +90 ekle
        email: body.buyer.email,
        identityNumber: process.env.IYZICO_IDENTITY_NUMBER || '11111111111',
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
        registrationAddress: body.buyer.address.substring(0, 150),
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '85.34.78.112',
        city: body.buyer.city.substring(0, 50),
        country: 'Turkey',
        zipCode: body.buyer.zipCode,
      },
      shippingAddress: {
        contactName: `${body.shippingAddress.firstName} ${body.shippingAddress.lastName}`.substring(0, 50),
        city: body.shippingAddress.city.substring(0, 50),
        country: 'Turkey',
        address: body.shippingAddress.address.substring(0, 150),
        zipCode: body.shippingAddress.zipCode,
      },
      billingAddress: {
        contactName: `${body.billingAddress.firstName} ${body.billingAddress.lastName}`.substring(0, 50),
        city: body.billingAddress.city.substring(0, 50),
        country: 'Turkey',
        address: body.billingAddress.address.substring(0, 150),
        zipCode: body.billingAddress.zipCode,
      },
      basketItems: body.basketItems.map((item: any, index: number) => ({
        id: item.id || `item_${index}`,
        name: item.name.substring(0, 50),
        category1: item.category1 || 'Fashion',
        category2: item.category2 || 'Clothing',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: item.price.toFixed(2),
      })),
    };

    console.log('=== İyzico SDK 3D Secure Payment Request ===');
    console.log('Request:', JSON.stringify(paymentRequest, null, 2));

    // Call iyzico 3D Secure Initialize API using SDK
    return new Promise((resolve) => {
      iyzipay.threedsInitialize.create(paymentRequest, (err: any, result: any) => {
        if (err) {
          console.error('İyzico SDK Error:', err);
          resolve(NextResponse.json(
            {
              status: 'error',
              errorMessage: 'Ödeme başlatılamadı: ' + (err.errorMessage || err.message || 'Bilinmeyen hata'),
              errorCode: err.errorCode,
            },
            { status: 400 }
          ));
          return;
        }

        console.log('=== İyzico SDK 3D Secure Response ===');
        console.log('Response:', JSON.stringify(result, null, 2));

        if (result.status === 'success') {
          resolve(NextResponse.json({
            status: 'success',
            threeDSHtmlContent: result.threeDSHtmlContent,
            paymentId: result.paymentId,
            conversationId: result.conversationId,
          }));
        } else {
          console.error('iyzico 3D Secure initialization failed:', result);
          resolve(NextResponse.json(
            {
              status: 'error',
              errorMessage: result.errorMessage || 'Ödeme başlatılamadı',
              errorCode: result.errorCode,
            },
            { status: 400 }
          ));
        }
      });
    });
  } catch (error: any) {
    console.error('Payment API error:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    return NextResponse.json(
      {
        status: 'error',
        errorMessage: 'Sunucu hatası: ' + (error?.message || 'Bilinmeyen hata'),
        errorDetails: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}
