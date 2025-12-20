import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Order } from '@/types';

export async function POST(request: NextRequest) {
  // Initialize Resend at runtime, not at build time
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json({
      success: false,
      error: 'Email service not configured'
    }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  try {
    const { order }: { order: Order } = await request.json();

    // Parse admin emails (supports comma-separated list)
    const adminEmails = (process.env.ADMIN_EMAIL || 'meaculpadesigns@gmail.com,info@meaculpadesign.com')
      .split(',')
      .map(email => email.trim());

    console.log('=== Sending Order Notification Email ===');
    console.log('Order Number:', order.orderNumber);
    console.log('Admin Emails:', adminEmails);

    // Email içeriği HTML formatında
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #D4AF37; margin-top: 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            🎉 Yeni Sipariş Geldi!
          </h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Sipariş Detayları</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>📦 Sipariş No:</strong></td>
                <td style="padding: 8px 0; color: #333;">${order.orderNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>👤 Müşteri:</strong></td>
                <td style="padding: 8px 0; color: #333;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>📧 Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${order.guestEmail || 'Kayıtlı kullanıcı'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>📱 Telefon:</strong></td>
                <td style="padding: 8px 0; color: #333;">${order.guestPhone || order.shippingAddress.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>💰 Toplam Tutar:</strong></td>
                <td style="padding: 8px 0; color: #D4AF37; font-size: 18px; font-weight: bold;">${order.total.toFixed(2)} TL</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>📅 Sipariş Tarihi:</strong></td>
                <td style="padding: 8px 0; color: #333;">${new Date(order.createdAt).toLocaleString('tr-TR')}</td>
              </tr>
            </table>
          </div>

          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Ürünler</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              ${order.items.map(item => `
                <li style="padding: 15px 0; border-bottom: 1px solid #eee;">
                  <div style="font-weight: bold; color: #333; margin-bottom: 5px;">${item.product.name}</div>
                  <div style="color: #666; font-size: 14px;">
                    <span style="margin-right: 15px;">Beden: <strong>${item.size}</strong></span>
                    <span style="margin-right: 15px;">Adet: <strong>${item.quantity}</strong></span>
                    <span>Fiyat: <strong style="color: #D4AF37;">${(item.product.price * item.quantity).toFixed(2)} TL</strong></span>
                  </div>
                  ${item.specialRequests ? `<div style="color: #888; font-size: 13px; margin-top: 5px;">📝 Özel İstek: ${item.specialRequests}</div>` : ''}
                  ${item.giftWrapping ? '<div style="color: #D4AF37; font-size: 13px; margin-top: 5px;">🎁 Hediye paketi isteniyor</div>' : ''}
                  ${item.giftMessage ? `<div style="color: #888; font-size: 13px; margin-top: 5px;">💌 Mesaj: ${item.giftMessage}</div>` : ''}
                </li>
              `).join('')}
            </ul>
          </div>

          <div style="background: #fff; padding: 15px; border: 1px solid #ddd; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #333;">Teslimat Adresi</h4>
            <p style="margin: 5px 0; color: #666;">
              ${order.shippingAddress.address}<br/>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br/>
              ${order.shippingAddress.country}
            </p>
          </div>

          <div style="margin-top: 30px; text-align: center;">
            <a href="https://www.meaculpadesign.com/admin/orders?orderNumber=${order.orderNumber}"
               style="display: inline-block; padding: 15px 40px; background: #D4AF37; color: white; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 16px;">
              🔗 Admin Panelinde Görüntüle
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <p style="color: #888; font-size: 12px; margin: 5px 0;">
              Bu mail otomatik gönderilmiştir.
            </p>
            <p style="color: #D4AF37; font-size: 14px; margin: 5px 0; font-weight: bold;">
              Mea Culpa Admin Sistemi
            </p>
          </div>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Mea Culpa <onboarding@resend.dev>',
      to: adminEmails,
      subject: `🎉 Yeni Sipariş: ${order.orderNumber}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend email error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.log('=== Email Sent Successfully ===');
    console.log('Email ID:', data?.id);

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error: any) {
    console.error('Email notification error:', error);
    // Email gönderilmese bile sipariş oluşsun diye hata fırlatma
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
