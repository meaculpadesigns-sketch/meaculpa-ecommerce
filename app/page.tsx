'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { getProducts } from '@/lib/firebase-helpers';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  const [kimonoProducts, setKimonoProducts] = useState<Product[]>([]);
  const [setProducts, setSetProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const kimonoScrollRef = useRef<HTMLDivElement>(null);
  const setScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
        setKimonoProducts(products.filter(p => p.category === 'kimono').slice(0, 6));
        setSetProducts(products.filter(p => p.category === 'set').slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Auto-scroll functionality (every 10 seconds)
  useEffect(() => {
    const kimonoInterval = setInterval(() => {
      if (kimonoScrollRef.current) {
        const container = kimonoScrollRef.current;
        const cardWidth = 320 + 24; // Card width (80 * 4) + gap (6 * 4)
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;

        if (currentScroll >= maxScroll - 10) {
          // Reset to beginning
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll to next card
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 10000);

    const setInterval2 = setInterval(() => {
      if (setScrollRef.current) {
        const container = setScrollRef.current;
        const cardWidth = 320 + 24;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;

        if (currentScroll >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 10000);

    return () => {
      clearInterval(kimonoInterval);
      clearInterval(setInterval2);
    };
  }, [kimonoProducts, setProducts]);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const cardWidth = 320 + 24; // Card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  return (
    <div>
      {/* Hero Section - Apple Style */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax effect */}
        <motion.div
          style={{ opacity, scale }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent opacity-30" />
          <div className="h-full w-full bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-20" />
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

      {/* Kimono Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('nav.kimono')}
              </h2>
              <p className="text-gray-400 text-lg">
                {i18n.language === 'tr'
                  ? 'Özgün tasarımlarımızla tanışın'
                  : 'Discover our unique designs'}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollCarousel(kimonoScrollRef, 'left')}
                className="p-3 glass rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={() => scrollCarousel(kimonoScrollRef, 'right')}
                className="p-3 glass rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
              <Link
                href="/products?category=kimono"
                className="btn-primary flex items-center gap-2"
              >
                {t('common.viewAll')}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-white">
              {t('common.loading')}
            </div>
          ) : kimonoProducts.length > 0 ? (
            <div ref={kimonoScrollRef} className="overflow-x-auto pb-4 scroll-smooth">
              <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
                {kimonoProducts.map((product, index) => (
                  <div key={product.id} className="w-80 flex-shrink-0">
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              {i18n.language === 'tr'
                ? 'Henüz ürün eklenmedi'
                : 'No products added yet'}
            </div>
          )}

          <div className="flex md:hidden items-center gap-2 mt-8">
            <button
              onClick={() => scrollCarousel(kimonoScrollRef, 'left')}
              className="p-3 glass rounded-full"
              aria-label="Previous"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <Link
              href="/products?category=kimono"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {t('common.viewAll')}
              <ArrowRight size={20} />
            </Link>
            <button
              onClick={() => scrollCarousel(kimonoScrollRef, 'right')}
              className="p-3 glass rounded-full"
              aria-label="Next"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Set Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('nav.set')}
              </h2>
              <p className="text-gray-400 text-lg">
                {i18n.language === 'tr'
                  ? 'Şık ve rahat set kombinleri'
                  : 'Stylish and comfortable set combinations'}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollCarousel(setScrollRef, 'left')}
                className="p-3 glass rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>
              <button
                onClick={() => scrollCarousel(setScrollRef, 'right')}
                className="p-3 glass rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={24} className="text-white" />
              </button>
              <Link
                href="/products?category=set"
                className="btn-primary flex items-center gap-2"
              >
                {t('common.viewAll')}
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-white">
              {t('common.loading')}
            </div>
          ) : setProducts.length > 0 ? (
            <div ref={setScrollRef} className="overflow-x-auto pb-4 scroll-smooth">
              <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
                {setProducts.map((product, index) => (
                  <div key={product.id} className="w-80 flex-shrink-0">
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              {i18n.language === 'tr'
                ? 'Henüz ürün eklenmedi'
                : 'No products added yet'}
            </div>
          )}

          <div className="flex md:hidden items-center gap-2 mt-8">
            <button
              onClick={() => scrollCarousel(setScrollRef, 'left')}
              className="p-3 glass rounded-full"
              aria-label="Previous"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <Link
              href="/products?category=set"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {t('common.viewAll')}
              <ArrowRight size={20} />
            </Link>
            <button
              onClick={() => scrollCarousel(setScrollRef, 'right')}
              className="p-3 glass rounded-full"
              aria-label="Next"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-4">
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
