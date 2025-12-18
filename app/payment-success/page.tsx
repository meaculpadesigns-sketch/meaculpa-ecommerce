'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createOrder, useCoupon } from '@/lib/firebase-helpers';
import { Address } from '@/types';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOrder = async () => {
      try {
        // Get pending order data from sessionStorage
        const pendingOrderData = sessionStorage.getItem('pendingOrder');
        if (!pendingOrderData) {
          setError('Sipariş bilgileri bulunamadı');
          setProcessing(false);
          return;
        }

        const orderData = JSON.parse(pendingOrderData);
        const paymentId = searchParams.get('paymentId');
        const conversationId = searchParams.get('conversationId');

        // Create order
        const orderNumber = `MEA${Date.now()}`;
        await createOrder({
          userId: orderData.userId,
          orderNumber,
          items: orderData.items,
          subtotal: orderData.subtotal,
          discount: orderData.discount,
          shipping: orderData.shipping,
          total: orderData.total,
          status: 'processing',
          paymentMethod: orderData.paymentMethod,
          paymentStatus: 'paid',
          shippingAddress: orderData.shippingAddress as Address,
          billingAddress: orderData.billingAddress as Address,
          guestEmail: orderData.guestEmail,
          guestPhone: orderData.guestPhone,
          iyzicoPaymentId: paymentId || orderData.paymentId,
          iyzicoConversationId: conversationId || orderData.conversationId,
          iyzicoPaymentStatus: 'SUCCESS',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // If coupon was used, increment usage count
        if (orderData.appliedCoupon) {
          await useCoupon(orderData.appliedCoupon.id);
        }

        // Clear sessionStorage
        sessionStorage.removeItem('pendingOrder');

        // Redirect to order success
        router.push(`/order-success?orderNumber=${orderNumber}`);
      } catch (err: any) {
        console.error('Error creating order:', err);
        setError('Sipariş oluşturulurken bir hata oluştu: ' + err.message);
        setProcessing(false);
      }
    };

    processOrder();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Hata</h1>
          <p className="text-gray-700 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary w-full"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        <div className="animate-spin h-16 w-16 border-4 border-mea-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
          Ödeme Başarılı
        </h1>
        <p className="text-gray-700 dark:text-gray-400">
          Siparişiniz oluşturuluyor...
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin h-16 w-16 border-4 border-mea-gold border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
            Yükleniyor...
          </h1>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
