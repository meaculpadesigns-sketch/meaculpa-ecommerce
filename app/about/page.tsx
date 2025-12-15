'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Shield, Leaf, Sparkles, Palette, Eye, Heart, ChevronDown } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

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
          <p className="text-xl text-black dark:text-white leading-relaxed">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Story - 6 paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-6">{t('about.ourStory')}</h2>
          <div className="space-y-4 text-black dark:text-white leading-relaxed">
            <p>{t('about.storyPara1')}</p>
            <p>{t('about.storyPara2')}</p>
            <p>{t('about.storyPara3')}</p>
            <p>{t('about.storyPara4')}</p>
            <p>{t('about.storyPara5')}</p>
            <p className="text-black font-semibold text-lg">{t('about.storyPara6')}</p>
          </div>
        </motion.div>

        {/* Values - 6 cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {/* Dürüstlük */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Shield className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueHonesty')}</h3>
            </div>
            <p className="text-black dark:text-white">
              {t('about.valueHonestyDesc')}
            </p>
          </div>

          {/* Sürdürülebilirlik */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Leaf className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueSustainability')}</h3>
            </div>
            <p className="text-black dark:text-white">
              {t('about.valueSustainabilityDesc')}
            </p>
          </div>

          {/* Özgünlük */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Sparkles className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueUniqueness')}</h3>
            </div>
            <p className="text-black dark:text-white">
              {t('about.valueUniquenessDesc')}
            </p>
          </div>

          {/* Sanat */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Palette className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueArt')}</h3>
            </div>
            <p className="text-black dark:text-white">
              {t('about.valueArtDesc')}
            </p>
          </div>

          {/* Farkındalık */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Eye className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueAwareness')}</h3>
            </div>
            <p className="text-black dark:text-white">
              {t('about.valueAwarenessDesc')}
            </p>
          </div>

          {/* Toplumsal Fayda */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Heart className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-black">{t('about.valueSocialBenefit')}</h3>
            </div>
            <p className="text-black dark:text-white">
              {t('about.valueSocialBenefitDesc')}
            </p>
          </div>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-6">{t('about.vision')}</h2>
          <p className="text-black dark:text-white leading-relaxed mb-4">
            {t('about.visionPara1')}
          </p>
          <p className="text-black dark:text-white leading-relaxed">
            {t('about.visionPara2')}
          </p>
        </motion.div>

        {/* Manifesto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-6">{t('about.manifesto')}</h2>
          <div className="space-y-4 text-black dark:text-white leading-relaxed">
            <p>{t('about.manifestoPara1')}</p>
            <p>{t('about.manifestoPara2')}</p>
            <p>{t('about.manifestoPara3')}</p>
            <p className="text-black font-bold text-xl text-center mt-6">
              {t('about.manifestoQuote')}
            </p>
          </div>
        </motion.div>

        {/* Ek Yazılar - Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-6">{t('about.additionalInfo')}</h2>

          <div className="space-y-4">
            {/* Sürdürülebilirlik */}
            <div className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('sustainability')}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
              >
                <h3 className="text-xl font-bold text-black">{t('about.sustainability')}</h3>
                <ChevronDown
                  className={`text-black transition-transform ${
                    openSection === 'sustainability' ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              {openSection === 'sustainability' && (
                <div className="px-6 pb-6 space-y-3 text-black dark:text-white leading-relaxed">
                  <p>{t('about.sustainabilityPara1')}</p>
                  <p>{t('about.sustainabilityPara2')}</p>
                  <p>{t('about.sustainabilityPara3')}</p>
                  <p>{t('about.sustainabilityPara4')}</p>
                </div>
              )}
            </div>

            {/* Sanatçı İşbirlikleri */}
            <div className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('artist')}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
              >
                <h3 className="text-xl font-bold text-black">{t('about.artistCollaboration')}</h3>
                <ChevronDown
                  className={`text-black transition-transform ${
                    openSection === 'artist' ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              {openSection === 'artist' && (
                <div className="px-6 pb-6 space-y-3 text-black dark:text-white leading-relaxed">
                  <p>{t('about.artistPara1')}</p>
                  <p>{t('about.artistPara2')}</p>
                  <p>{t('about.artistPara3')}</p>
                  <p className="text-black font-semibold mt-4">{t('about.artistName')}</p>
                </div>
              )}
            </div>

            {/* Kumaşlarımız */}
            <div className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('fabrics')}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
              >
                <h3 className="text-xl font-bold text-black">{t('about.fabrics')}</h3>
                <ChevronDown
                  className={`text-black transition-transform ${
                    openSection === 'fabrics' ? 'rotate-180' : ''
                  }`}
                  size={24}
                />
              </button>
              {openSection === 'fabrics' && (
                <div className="px-6 pb-6 space-y-3 text-black dark:text-white leading-relaxed">
                  <p>{t('about.fabricsPara1')}</p>
                  <ul className="space-y-2 my-4">
                    <li className="flex items-start gap-2">
                      <span className="text-mea-gold">•</span>
                      <span>{t('about.fabricLinen')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mea-gold">•</span>
                      <span>{t('about.fabricMuslin')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mea-gold">•</span>
                      <span>{t('about.fabricViscose')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mea-gold">•</span>
                      <span>{t('about.fabricSatin')}</span>
                    </li>
                  </ul>
                  <p>{t('about.fabricsPara2')}</p>
                  <p>{t('about.fabricsPara3')}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Team Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
