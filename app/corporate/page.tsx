'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Users, Gift, Award, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CorporatePage() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.body.className = 'bg-light text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            {t('corporate.title')}
          </h1>
          <p className="text-xl text-black dark:text-white">
            {t('corporate.subtitle')}
          </p>
        </motion.div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Gift className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white">{t('corporate.giftsTitle')}</h2>
            </div>
            <p className="text-black dark:text-white leading-relaxed">
              {t('corporate.giftsDesc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Users className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {i18n.language === 'tr' ? 'Toplu Tasarım' : 'Bulk Design'}
              </h2>
            </div>
            <p className="text-black dark:text-white leading-relaxed">
              {t('corporate.bulkDesc')}
            </p>
          </motion.div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            {t('corporate.ctaTitle')}
          </h2>
          <p className="text-black dark:text-white mb-8 max-w-2xl mx-auto">
            {t('corporate.ctaDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:meaculpadesigns@gmail.com"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Mail size={20} />
              meaculpadesigns@gmail.com
            </a>
            <a
              href="tel:+905075620802"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Phone size={20} />
              +90 507 562 08 02
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
