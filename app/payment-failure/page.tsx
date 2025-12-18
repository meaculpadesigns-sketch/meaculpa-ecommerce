'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Ödeme işlemi başarısız oldu';

  useEffect(() => {
    // Clear pending order data
    sessionStorage.removeItem('pendingOrder');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
          Ödeme Başarısız
        </h1>
        <p className="text-gray-700 dark:text-gray-400 mb-6">
          {error}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/checkout')}
            className="btn-primary w-full"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => router.push('/cart')}
            className="btn-secondary w-full"
          >
            Sepete Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin h-16 w-16 border-4 border-mea-gold border-t-transparent rounded-full mx-auto mb-4"></div>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}
