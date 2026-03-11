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
import Testimonials from '@/components/Testimonials';

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
    async function fetchProducts() {
      try {
        const products = await getProducts();
        // Filter out hidden products
        const visibleProducts = products.filter(p => !p.hidden);
        setKimonoProducts(visibleProducts.filter(p => p.category === 'kimono').slice(0, 6));
        setSetProducts(visibleProducts.filter(p => p.category === 'set').slice(0, 6));
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
          <Image
            src="/images/header-hero.jpg"
            alt="Hero background"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/40" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Large Logo */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/images/logo-main.png"
                alt="Mea Culpa"
                width={600}
                height={600}
                className="w-auto h-56 md:h-64 lg:h-72 object-contain drop-shadow-2xl"
                priority
              />
            </div>

            <p className="text-xl md:text-2xl lg:text-3xl text-white mb-12">
              {t('hero.slogan1')}
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
          <ChevronDown className="text-black dark:text-white" size={32} />
        </motion.div>
      </section>

      {/* Models / Collection Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[75vh]">
        {/* Sol: erkek kimono */}
        <Link href="/products?category=kimono" className="relative overflow-hidden group block">
          <Image
            src="/images/homepage/sol-manken.png"
            alt="Kimono Koleksiyonu"
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute bottom-10 left-8">
            <p className="text-sm tracking-widest uppercase mb-2" style={{ color: '#FFF4DE', opacity: 0.8 }}>
              {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
            </p>
            <h3 className="text-4xl font-bold mb-4" style={{ color: '#FFF4DE' }}>
              {t('nav.kimono')}
            </h3>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: '#853710', color: '#FFF4DE' }}>
              {i18n.language === 'tr' ? 'Keşfet' : 'Explore'} <ArrowRight size={16} />
            </span>
          </div>
        </Link>

        {/* Sağ: kadın set */}
        <Link href="/products?category=set" className="relative overflow-hidden group block" style={{ background: '#FFF4DE' }}>
          <Image
            src="/images/homepage/sag-manken.png"
            alt="Set Koleksiyonu"
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 transition-colors duration-300" style={{ background: 'rgba(136,145,119,0.05)' }} />
          <div className="absolute bottom-10 right-8 text-right">
            <p className="text-sm tracking-widest uppercase mb-2" style={{ color: '#853710', opacity: 0.7 }}>
              {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
            </p>
            <h3 className="text-4xl font-bold mb-4" style={{ color: '#853710' }}>
              {t('nav.set')}
            </h3>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: '#853710', color: '#FFF4DE' }}>
              {i18n.language === 'tr' ? 'Keşfet' : 'Explore'} <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </section>

      {/* Kimono Section */}
      <section className="py-20">
        <div>
          <div className="flex items-center justify-between mb-12 px-4 max-w-7xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
                {t('nav.kimono')}
              </h2>
              <p className="text-black dark:text-white text-lg">
                {i18n.language === 'tr'
                  ? 'Özgün tasarımlarımızla tanışın'
                  : 'Discover our unique designs'}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollCarousel(kimonoScrollRef, 'left')}
                className="p-3 glass rounded-full hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={24} className="text-black dark:text-white" />
              </button>
              <button
                onClick={() => scrollCarousel(kimonoScrollRef, 'right')}
                className="p-3 glass rounded-full hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={24} className="text-black dark:text-white" />
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
            <div className="text-center py-20 text-black dark:text-white">
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
            <div className="text-center py-20 text-black dark:text-white">
              {i18n.language === 'tr'
                ? 'Henüz ürün eklenmedi'
                : 'No products added yet'}
            </div>
          )}

          <div className="flex md:hidden items-center gap-2 mt-8 px-4">
            <button
              onClick={() => scrollCarousel(kimonoScrollRef, 'left')}
              className="p-3 glass rounded-full"
              aria-label="Previous"
            >
              <ChevronLeft size={20} className="text-black dark:text-white" />
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
              <ChevronRight size={20} className="text-black dark:text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Polaroid Gallery */}
      <section className="py-16 overflow-hidden" style={{ background: '#FFF4DE' }}>
        <div className="px-6 md:px-12 mb-8">
          <p className="text-sm tracking-widest uppercase mb-1" style={{ color: '#853710', opacity: 0.7 }}>
            {i18n.language === 'tr' ? 'Anlar' : 'Moments'}
          </p>
          <h2 className="text-3xl font-bold" style={{ color: '#853710' }}>
            {i18n.language === 'tr' ? 'Yaşanmış Hikayeler' : 'Lived Stories'}
          </h2>
        </div>
        <div className="flex gap-5 px-6 md:px-12 overflow-x-auto scrollbar-hide pb-4">
          {[
            { src: '2polaroid.png', ext: 'png' },
            { src: '3polaroid.png', ext: 'png' },
            { src: 'polaroid3.png', ext: 'png' },
            { src: 'polaroid4.png', ext: 'png' },
          ].map(({ src }) => (
            <div
              key={src}
              className="flex-shrink-0 shadow-lg rotate-1 odd:rotate-[-1deg] even:rotate-[1deg]"
              style={{ background: '#fff', padding: '10px 10px 36px 10px', width: 220 }}
            >
              <div className="relative w-full" style={{ height: 260 }}>
                <Image
                  src={`/images/homepage/${src}`}
                  alt="Mea Culpa moment"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Set Section */}
      <section className="py-20">
        <div>
          <div className="flex items-center justify-between mb-12 px-4 max-w-7xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
                {t('nav.set')}
              </h2>
              <p className="text-black dark:text-white text-lg">
                {i18n.language === 'tr'
                  ? 'Şık ve rahat set kombinleri'
                  : 'Stylish and comfortable set combinations'}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => scrollCarousel(setScrollRef, 'left')}
                className="p-3 glass rounded-full hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={24} className="text-black dark:text-white" />
              </button>
              <button
                onClick={() => scrollCarousel(setScrollRef, 'right')}
                className="p-3 glass rounded-full hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={24} className="text-black dark:text-white" />
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
            <div className="text-center py-20 text-black dark:text-white">
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
            <div className="text-center py-20 text-black dark:text-white">
              {i18n.language === 'tr'
                ? 'Henüz ürün eklenmedi'
                : 'No products added yet'}
            </div>
          )}

          <div className="flex md:hidden items-center gap-2 mt-8 px-4">
            <button
              onClick={() => scrollCarousel(setScrollRef, 'left')}
              className="p-3 glass rounded-full"
              aria-label="Previous"
            >
              <ChevronLeft size={20} className="text-black dark:text-white" />
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
              <ChevronRight size={20} className="text-black dark:text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* Lifestyle Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 h-72 md:h-[480px]">
        {[
          { src: 'forest.jpg',    label: i18n.language === 'tr' ? 'Doğa' : 'Nature' },
          { src: 'labryinto.jpg', label: i18n.language === 'tr' ? 'Festival' : 'Festival' },
          { src: 'BPM.jpg',       label: i18n.language === 'tr' ? 'Kaçış' : 'Escape' },
        ].map(({ src, label }) => (
          <div key={src} className="relative overflow-hidden group">
            <Image
              src={`/images/homepage/${src}`}
              alt={label}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors duration-300" />
            <span className="absolute bottom-6 left-6 text-lg font-semibold tracking-wide" style={{ color: '#FFF4DE' }}>
              {label}
            </span>
          </div>
        ))}
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
            <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-8">
              {t('home.ourStory')}
            </h2>
            <p className="text-black dark:text-white text-lg leading-relaxed mb-6">
              {t('home.storyText1')}
            </p>
            <p className="text-black dark:text-white text-lg leading-relaxed mb-8">
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
      <Testimonials />
    </div>
  );
}
