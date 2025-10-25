'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Gizlilik Politikası
          </h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Toplanan Bilgiler</h2>
              <p className="mb-4">
                Mea Culpa olarak, sizlere daha iyi hizmet verebilmek için belirli kişisel bilgilerinizi topluyoruz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>İsim, soyisim</li>
                <li>E-posta adresi</li>
                <li>Telefon numarası</li>
                <li>Teslimat ve faturalama adresleri</li>
                <li>Ödeme bilgileri (güvenli ödeme sağlayıcıları aracılığıyla)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Bilgilerin Kullanımı</h2>
              <p className="mb-4">Topladığımız bilgileri aşağıdaki amaçlar için kullanıyoruz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Sipariş işlemlerini gerçekleştirmek</li>
                <li>Müşteri hizmetleri desteği sağlamak</li>
                <li>Ürün ve kampanyalar hakkında bilgilendirme yapmak</li>
                <li>Web sitesini iyileştirmek ve kişiselleştirmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Bilgi Güvenliği</h2>
              <p>
                Kişisel bilgilerinizin güvenliği bizim için önceliklidir. Tüm verileriniz SSL şifreleme ile korunmaktadır.
                Ödeme bilgileriniz güvenli ödeme sağlayıcıları tarafından işlenmekte ve sunucularımızda saklanmamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Çerezler (Cookies)</h2>
              <p className="mb-4">
                Web sitemiz, deneyiminizi iyileştirmek için çerezler kullanmaktadır. Çerezler şu amaçlarla kullanılır:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Oturum bilgilerini saklamak</li>
                <li>Alışveriş sepetinizi hatırlamak</li>
                <li>Tercihlerinizi kaydetmek</li>
                <li>Site trafiğini analiz etmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Üçüncü Taraflarla Paylaşım</h2>
              <p>
                Kişisel bilgilerinizi üçüncü taraflarla satmıyoruz. Sadece sipariş teslimatı ve ödeme işlemleri için
                gerekli olan güvenilir iş ortaklarımızla paylaşıyoruz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Haklarınız</h2>
              <p className="mb-4">KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında şu haklara sahipsiniz:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                <li>Düzeltme veya güncelleme talep etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. İletişim</h2>
              <p>
                Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:
              </p>
              <p className="mt-4">
                <strong className="text-white">E-posta:</strong> meaculpadesigns@gmail.com<br />
                <strong className="text-white">Instagram:</strong> @meaculpadesigns
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-400 mt-8">
                Son güncellenme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}