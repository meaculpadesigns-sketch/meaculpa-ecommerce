'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="glass rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Cookie className="text-mea-gold flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-white font-semibold mb-2">
                      {t('footer.cookies')}
                    </h3>
                    <p className="text-gray-300 text-sm max-w-2xl">
                      Web sitemizde en iyi deneyimi sunabilmek için çerezler kullanıyoruz.
                      Çerezleri kullanarak tercihlerinizi hatırlar, site performansını
                      iyileştiririz. Daha fazla bilgi için{' '}
                      <a href="/cookies" className="text-mea-gold hover:underline">
                        çerez politikamızı
                      </a>{' '}
                      okuyabilirsiniz.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={handleReject}
                    className="px-6 py-2 rounded-full border border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-10 transition-all"
                  >
                    {t('footer.rejectCookies')}
                  </button>
                  <button
                    onClick={handleAccept}
                    className="px-6 py-2 rounded-full bg-mea-gold text-black font-semibold hover:bg-opacity-90 transition-all"
                  >
                    {t('footer.acceptCookies')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
