'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import CreationSection from '@/components/CreationSection';

export default function Home() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    document.body.className = 'bg-home';
    return () => {
      document.body.className = '';
    };
  }, []);

  const [creations, setCreations] = useState([
    {
      id: '1',
      name: 'Yazlık Koleksiyonu',
      title: 'Yazlık Koleksiyonu',
      titleEn: 'Summer Collection',
      description: 'Hafif ve nefes alabilen kumaşlarla yazın sıcaklığına meydan okuyun',
      descriptionEn: 'Challenge the summer heat with light and breathable fabrics',
      story: 'İpek Yolu\'nun eski karavan duraklarından ilham alan yazlık koleksiyonumuz, doğal pamuk ve keten kumaşlarla hazırlanmıştır.',
      storyEn: 'Our summer collection, inspired by the ancient caravan stops of the Silk Road, is prepared with natural cotton and linen fabrics.',
      image: '/images/summer-collection.jpg',
      products: [],
      season: 'summer' as const,
      featured: true,
    },
    {
      id: '2',
      name: 'Kışlık Koleksiyonu',
      title: 'Kışlık Koleksiyonu',
      titleEn: 'Winter Collection',
      description: 'Doğu Anadolu\'nun sıcaklığını taşıyan özel tasarımlar',
      descriptionEn: 'Special designs carrying the warmth of Eastern Anatolia',
      story: 'Geleneksel el işlemeli motifler ve kaliteli yün kumaşlarla, kışın soğuğuna karşı hem şık hem sıcak kalın.',
      storyEn: 'Stay both stylish and warm against the winter cold with traditional hand-embroidered motifs and quality wool fabrics.',
      image: '/images/winter-collection.jpg',
      products: [],
      season: 'winter' as const,
      featured: true,
    },
    {
      id: '3',
      name: 'Özel Tasarım',
      title: 'Özel Tasarım',
      titleEn: 'Custom Design',
      description: 'Size özel, benzersiz tasarımlar',
      descriptionEn: 'Unique designs customized for you',
      story: 'Hayalinizdeki kıyafeti birlikte tasarlayalım. Her detayı sizinle konuşarak, tamamen size özel bir parça yaratıyoruz.',
      storyEn: 'Let\'s design the outfit of your dreams together. We create a completely custom piece by discussing every detail with you.',
      image: '/images/custom-design.jpg',
      products: [],
      season: 'special' as const,
      featured: true,
    },
  ]);

  return (
    <div>
      {/* Hero Section - Apple Style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax effect */}
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
          <div className="h-full w-full bg-[url('/images/hero-bg.jpg')] bg-cover bg-center" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
              MEA CULPA
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4">
              {t('hero.slogan1')}
            </p>
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              {t('hero.slogan3')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="btn-primary">
                {t('hero.shopNow')}
                <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link href="/about" className="btn-secondary">
                {t('hero.learnMore')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="text-white" size={32} />
        </motion.div>
      </section>

      {/* Creations - Apple Style Scrolling Sections */}
      {creations.map((creation, index) => (
        <CreationSection
          key={creation.id}
          creation={creation}
          index={index}
        />
      ))}

      {/* Featured Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('home.bestSellers')}
            </h2>
            <p className="text-gray-400 text-lg">
              {t('home.bestSellersDesc')}
            </p>
          </motion.div>

          {/* Product Grid - Will be populated from Firebase */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for products */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="product-card p-6"
              >
                <div className="aspect-square bg-zinc-800 rounded-lg mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  {t('home.productView')} {i}
                </h3>
                <p className="text-gray-400 mb-4">₺999</p>
                <button className="btn-primary w-full">
                  {t('products.addToCart')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              {t('home.ourStory')}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {t('home.storyText1')}
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {t('home.storyText2')}
            </p>
            <Link href="/about" className="btn-primary">
              {t('home.learnMore')}
              <ArrowRight className="inline ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('home.customerReviews')}
            </h2>
            <p className="text-gray-400 text-lg">
              {t('home.customerReviewsDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="text-mea-gold text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  {t('home.reviewText')}
                </p>
                <p className="text-white font-semibold">- {t('home.customer')} {i}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
