'use client';

import { motion } from 'framer-motion';
import { Building, Users, Gift, Award, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CorporatePage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('corporate.title')}
          </h1>
          <p className="text-xl text-gray-400">
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
                <Building className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('corporate.uniformsTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('corporate.uniformsDesc')}
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
                <Gift className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('corporate.giftsTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('corporate.giftsDesc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Users className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('corporate.bulkTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('corporate.bulkDesc')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Award className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('corporate.vipTitle')}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('corporate.vipDesc')}
            </p>
          </motion.div>
        </div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            {t('corporate.howItWorksTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-white font-semibold mb-2">{t('corporate.step1Title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('corporate.step1Desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-white font-semibold mb-2">{t('corporate.step2Title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('corporate.step2Desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-white font-semibold mb-2">{t('corporate.step3Title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('corporate.step3Desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-white font-semibold mb-2">{t('corporate.step4Title')}</h3>
              <p className="text-gray-400 text-sm">
                {t('corporate.step4Desc')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('corporate.whyTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              t('corporate.benefit1'),
              t('corporate.benefit2'),
              t('corporate.benefit3'),
              t('corporate.benefit4'),
              t('corporate.benefit5'),
              t('corporate.benefit6'),
              t('corporate.benefit7'),
              t('corporate.benefit8'),
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-mea-gold rounded-full" />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('corporate.ctaTitle')}
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('corporate.ctaDesc')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:corporate@meaculpa.com"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Mail size={20} />
              corporate@meaculpa.com
            </a>
            <a
              href="tel:+905551234567"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Phone size={20} />
              +90 555 123 45 67
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
