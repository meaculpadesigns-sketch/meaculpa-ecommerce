'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  const collectedInfoItems = [
    'İsim, soyisim',
    'E-posta adresi',
    'Telefon numarası',
    'Teslimat ve faturalama adresleri',
    'Ödeme bilgileri (güvenli ödeme sağlayıcıları aracılığıyla)',
  ];

  const usageItems = [
    'Sipariş işlemlerini gerçekleştirmek',
    'Müşteri hizmetleri desteği sağlamak',
    'Ürün ve kampanyalar hakkında bilgilendirme yapmak',
    'Web sitesini iyileştirmek ve kişiselleştirmek',
  ];

  const cookiesItems = [
    'Oturum bilgilerini saklamak',
    'Alışveriş sepetinizi hatırlamak',
    'Tercihlerinizi kaydetmek',
    'Site trafiğini analiz etmek',
  ];

  const rightsItems = [
    'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
    'Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme',
    'Kişisel verilerinizin silinmesini veya yok edilmesini isteme',
    'Düzeltme veya güncelleme talep etme',
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            {t('privacy.title')}
          </h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. {t('privacy.section1Title')}</h2>
              <p className="mb-4">
                {t('privacy.section1Intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {collectedInfoItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. {t('privacy.section2Title')}</h2>
              <p className="mb-4">{t('privacy.section2Intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {usageItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. {t('privacy.section3Title')}</h2>
              <p>
                {t('privacy.section3Text')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. {t('privacy.section4Title')}</h2>
              <p className="mb-4">
                {t('privacy.section4Intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {cookiesItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. {t('privacy.section5Title')}</h2>
              <p>
                {t('privacy.section5Text')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. {t('privacy.section6Title')}</h2>
              <p className="mb-4">{t('privacy.section6Intro')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {rightsItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. {t('privacy.section7Title')}</h2>
              <p>
                {t('privacy.section7Text')}
              </p>
              <p className="mt-4">
                <strong className="text-white">E-posta:</strong> meaculpadesigns@gmail.com<br />
                <strong className="text-white">Instagram:</strong> @meaculpadesigns
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-400 mt-8">
                {t('privacy.lastUpdated')} {new Date().toLocaleDateString('tr-TR')}
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}