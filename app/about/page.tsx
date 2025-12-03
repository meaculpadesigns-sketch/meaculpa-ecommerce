'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Award, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.className = 'bg-products';
    return () => {
      document.body.className = '';
    };
  }, []);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-6">{t('about.ourStory')}</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <span className="text-black font-semibold">Mea Culpa</span>, {t('about.storyPara1')}
            </p>
            <p>
              {t('about.storyPara2')}
            </p>
            <p>
              {t('about.storyPara3')}
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Heart className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueHandmade')}</h3>
            </div>
            <p className="text-gray-700">
              {t('about.valueHandmadeDesc')}
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Award className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueQuality')}</h3>
            </div>
            <p className="text-gray-700">
              {t('about.valueQualityDesc')}
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Users className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueCommunity')}</h3>
            </div>
            <p className="text-gray-700">
              {t('about.valueCommunityDesc')}
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Globe className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueSustainability')}</h3>
            </div>
            <p className="text-gray-700">
              {t('about.valueSustainabilityDesc')}
            </p>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-6">{t('about.mission')}</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {t('about.missionPara1')}
          </p>
          <p className="text-gray-700 leading-relaxed">
            {t('about.missionPara2')}
          </p>
        </motion.div>

        {/* Team Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-2xl font-semibold text-black mb-4">
            &quot;{t('about.quote')}&quot;
          </p>
          <p className="text-gray-600">
            {t('about.welcome')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
