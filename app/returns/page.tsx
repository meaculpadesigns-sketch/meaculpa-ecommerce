'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ReturnsPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
            {t('returns.title')}
          </h1>

          <div className="space-y-8 text-black dark:text-white">
            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('returns.conditionsTitle')}</h2>
              <p className="mb-4">
                {t('returns.conditionsIntro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ürünün teslim tarihinden itibaren <strong className="text-black dark:text-white">14 gün</strong> içerisinde iade hakkınız bulunmaktadır</li>
                <li>İade edilecek ürün kullanılmamış ve orijinal ambalajında olmalıdır</li>
                <li>Etiketler sökülmemiş ve ürün üzerinde deformasyon olmamalıdır</li>
                <li>El dokuması ve özel tasarım ürünler için iade süreci farklılık gösterebilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('returns.nonReturnableTitle')}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Özel olarak sizin için üretilen/tasarlanan ürünler</li>
                <li>Hijyen açısından iade edilemeyecek ürünler (kullanılmış iç giyim ürünleri)</li>
                <li>Kişiselleştirilmiş (isim, mesaj vb. eklenmiş) ürünler</li>
                <li>İndirimli/kampanyalı ürünlerde farklı koşullar uygulanabilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('returns.processTitle')}</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold flex items-center justify-center font-bold">
                    1
                  </span>
                  <div>
                    <h3 className="text-black dark:text-white font-semibold mb-2">{t('returns.processStep1Title')}</h3>
                    <p>{t('returns.processStep1Desc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold flex items-center justify-center font-bold">
                    2
                  </span>
                  <div>
                    <h3 className="text-black dark:text-white font-semibold mb-2">{t('returns.processStep2Title')}</h3>
                    <p>{t('returns.processStep2Desc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold flex items-center justify-center font-bold">
                    3
                  </span>
                  <div>
                    <h3 className="text-black dark:text-white font-semibold mb-2">{t('returns.processStep3Title')}</h3>
                    <p>{t('returns.processStep3Desc')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold flex items-center justify-center font-bold">
                    4
                  </span>
                  <div>
                    <h3 className="text-black dark:text-white font-semibold mb-2">{t('returns.processStep4Title')}</h3>
                    <p>{t('returns.processStep4Desc')}</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('returns.exchangeTitle')}</h2>
              <p className="mb-4">
                {t('returns.exchangeIntro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>İade sürecini başlatın</li>
                <li>Yeni ürün için sipariş oluşturun</li>
                <li>İade onaylandıktan sonra ödemeniz iade edilecektir</li>
                <li>Stok durumuna göre hızlı değişim de yapılabilir (bizimle iletişime geçin)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('returns.damagedTitle')}</h2>
              <p className="mb-4">
                {t('returns.damagedIntro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ürünü teslim aldıktan sonra <strong className="text-black dark:text-white">48 saat</strong> içinde bize bildirin</li>
                <li>Hasarın fotoğraflarını çekin ve bize gönderin</li>
                <li>Kargo ücreti tarafımızdan karşılanacaktır</li>
                <li>Yeni ürün gönderimi veya tam iade seçenekleriniz olacaktır</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('returns.shippingTitle')}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cayma hakkı kullanımında kargo ücreti müşteriye aittir</li>
                <li>Hatalı/hasarlı ürün iadelerinde kargo ücreti tarafımıza aittir</li>
                <li>Değişim işlemlerinde ilk kargo ücreti müşteriye, geri gönderim ücreti bize aittir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('returns.contactTitle')}</h2>
              <p>
                {t('returns.contactText')}
              </p>
              <p className="mt-4">
                <strong className="text-black dark:text-white">E-posta:</strong> meaculpadesigns@gmail.com<br />
                <strong className="text-black dark:text-white">Telefon:</strong> +90 507 562 08 02<br />
                <strong className="text-black dark:text-white">Instagram:</strong> @meaculpadesigns<br />
                <strong className="text-black dark:text-white">Çalışma Saatleri:</strong> Hafta içi 09:00 - 18:00
              </p>
            </section>

            <section>
              <p className="text-sm text-black dark:text-white mt-8">
                {t('returns.lastUpdated')} {new Date().toLocaleDateString('tr-TR')}
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
