'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Sipariş bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 relative">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 200}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block mb-6"
          >
            <CheckCircle className="text-green-500" size={100} />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Siparişiniz Alındı!
          </h1>
          <p className="text-xl text-gray-400">
            Teşekkür ederiz, siparişiniz başarıyla oluşturuldu
          </p>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sipariş Detayları</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-white border-opacity-10">
              <span className="text-gray-400">Sipariş Numarası</span>
              <span className="text-white font-mono font-semibold">{orderNumber}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white border-opacity-10">
              <span className="text-gray-400">Sipariş Tarihi</span>
              <span className="text-white">{new Date().toLocaleDateString('tr-TR')}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-gray-400">Durum</span>
              <span className="px-4 py-1 rounded-full bg-yellow-500 bg-opacity-20 text-yellow-500 text-sm font-medium">
                Hazırlanıyor
              </span>
            </div>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sırada Ne Var?</h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold">
                  1
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Sipariş Onayı</p>
                <p className="text-gray-400 text-sm">
                  Size bir onay e-postası gönderdik. Lütfen gelen kutunuzu kontrol edin.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold">
                  2
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Hazırlık</p>
                <p className="text-gray-400 text-sm">
                  Siparişiniz özenle hazırlanacak ve paketlenecek.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold">
                  3
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Kargo</p>
                <p className="text-gray-400 text-sm">
                  Siparişiniz kargoya verildiğinde takip numarası ile bilgilendirileceksiniz.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold">
                  4
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Teslimat</p>
                <p className="text-gray-400 text-sm">
                  Siparişiniz belirttiğiniz adrese teslim edilecek.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">İletişim</h2>
          <p className="text-gray-300 mb-6">
            Siparişiniz hakkında sorularınız varsa bizimle iletişime geçmekten çekinmeyin:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="mailto:meaculpadesigns@gmail.com"
              className="flex items-center gap-3 p-4 glass rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <Mail className="text-mea-gold" size={24} />
              <div>
                <p className="text-white font-medium">E-posta</p>
                <p className="text-gray-400 text-sm">meaculpadesigns@gmail.com</p>
              </div>
            </a>

            <a
              href="tel:+905075620802"
              className="flex items-center gap-3 p-4 glass rounded-xl hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <Phone className="text-mea-gold" size={24} />
              <div>
                <p className="text-white font-medium">Telefon</p>
                <p className="text-gray-400 text-sm">+90 507 562 08 02</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href={`/order-tracking?orderNumber=${orderNumber}`}
            className="btn-primary flex-1 text-center flex items-center justify-center gap-2"
          >
            <Package size={20} />
            Siparişi Takip Et
          </Link>

          <Link
            href="/products"
            className="btn-secondary flex-1 text-center"
          >
            Alışverişe Devam Et
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-pulse mb-4">Yükleniyor...</div>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
