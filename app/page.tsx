'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { getProducts } from '@/lib/firebase-helpers';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  const { t, i18n } = useTranslation();

  const [kimonoProducts, setKimonoProducts] = useState<Product[]>([]);
  const [setProducts, setSetProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const kimonoScrollRef = useRef<HTMLDivElement>(null);
  const setScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const products = await getProducts();
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

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const cardWidth = 280 + 16;
      ref.current.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* ── 1. HERO – Split layout ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100vh', background: '#FFF4DE' }}>
        <div className="flex flex-col lg:flex-row" style={{ minHeight: '100vh' }}>

          {/* Left: Logo + Slogan + CTA */}
          <div className="lg:w-5/12 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-24 lg:py-0">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            >
              {/* Large brand logo */}
              <div className="mb-8 md:mb-10">
                <Image
                  src="/images/logo-horizontal.png"
                  alt="Mea Culpa"
                  width={440}
                  height={200}
                  className="w-full max-w-xs md:max-w-sm object-contain"
                  priority
                />
              </div>

              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4"
                style={{ color: '#853710' }}
              >
                {t('hero.slogan1')}
              </h1>

              <p
                className="text-base md:text-lg leading-relaxed mb-8"
                style={{ color: '#9E906C', fontStyle: 'italic', fontFamily: "'Bellota Text'" }}
              >
                {i18n.language === 'tr'
                  ? 'Doğunun ilhamıyla, modern yaşamın içinde.'
                  : 'Inspired by the East, within modern life.'}
              </p>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 btn-primary self-start"
              >
                {i18n.language === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

          {/* Right: Fashion photo + floating polaroids */}
          <div className="lg:w-7/12 relative overflow-hidden" style={{ minHeight: '60vh' }}>
            <Image
              src="/images/header-hero.jpg"
              alt="Mea Culpa koleksiyon"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.18)' }} />

            {/* Floating polaroids */}
            <div className="absolute inset-0 pointer-events-none hidden md:block">
              <div
                className="absolute shadow-2xl"
                style={{ top: '10%', left: '6%', transform: 'rotate(-4deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 148 }}
              >
                <div className="relative" style={{ height: 185 }}>
                  <Image src="/images/homepage/2polaroid.png" alt="" fill className="object-cover" />
                </div>
              </div>
              <div
                className="absolute shadow-2xl"
                style={{ top: '6%', right: '10%', transform: 'rotate(3deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 140 }}
              >
                <div className="relative" style={{ height: 175 }}>
                  <Image src="/images/homepage/3polaroid.png" alt="" fill className="object-cover" />
                </div>
              </div>
              <div
                className="absolute shadow-2xl"
                style={{ bottom: '18%', left: '14%', transform: 'rotate(2deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 145 }}
              >
                <div className="relative" style={{ height: 180 }}>
                  <Image src="/images/homepage/polaroid3.png" alt="" fill className="object-cover" />
                </div>
              </div>
              <div
                className="absolute shadow-2xl"
                style={{ bottom: '8%', right: '6%', transform: 'rotate(-2deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 138 }}
              >
                <div className="relative" style={{ height: 172 }}>
                  <Image src="/images/homepage/polaroid4.png" alt="" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. KİMONO – Sage green, featured image left ── */}
      <section className="overflow-hidden" style={{ background: '#889177' }}>
        <div className="flex flex-col lg:flex-row">

          {/* Left: Featured kimono image */}
          <div className="lg:w-2/5 relative" style={{ minHeight: 520 }}>
            <Image
              src="/images/homepage/4kimono.png"
              alt="Kimono koleksiyonu"
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Right: Title + cards */}
          <div className="lg:w-3/5 flex flex-col justify-center px-8 md:px-12 py-14">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#FFF4DE', opacity: 0.65 }}>
                {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
              </p>
              <h2 className="text-5xl md:text-6xl font-bold mb-1" style={{ color: '#FFF4DE' }}>
                KİMONO
              </h2>
              <p className="text-lg mb-6" style={{ color: '#FFF4DE', opacity: 0.8, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
                {i18n.language === 'tr' ? 'hikayesi olan özel tasarımlar' : 'unique designs with a story'}
              </p>
              <Link
                href="/products?category=kimono"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium mb-10 self-start"
                style={{ background: '#FFF4DE', color: '#853710' }}
              >
                {i18n.language === 'tr' ? 'Koleksiyonu Gör' : 'View Collection'}
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Product carousel */}
            {loading ? (
              <p className="text-sm" style={{ color: '#FFF4DE', opacity: 0.7 }}>{t('common.loading')}</p>
            ) : kimonoProducts.length > 0 ? (
              <div className="relative">
                <div
                  ref={kimonoScrollRef}
                  className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
                >
                  {kimonoProducts.map((product, index) => (
                    <div key={product.id} className="w-64 flex-shrink-0">
                      <ProductCard product={product} index={index} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => scrollCarousel(kimonoScrollRef, 'left')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => scrollCarousel(kimonoScrollRef, 'right')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: '#FFF4DE', opacity: 0.6 }}>
                {i18n.language === 'tr' ? 'Henüz ürün eklenmedi' : 'No products yet'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. SETLER – Cream bg, featured image right ── */}
      <section className="overflow-hidden" style={{ background: '#FFF4DE' }}>
        <div className="flex flex-col lg:flex-row-reverse">

          {/* Right: Featured set image */}
          <div className="lg:w-2/5 relative" style={{ minHeight: 520 }}>
            <Image
              src="/images/homepage/sag-manken.png"
              alt="Set koleksiyonu"
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Left: Title + cards */}
          <div className="lg:w-3/5 flex flex-col justify-center px-8 md:px-12 py-14">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#853710', opacity: 0.65 }}>
                {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
              </p>
              <h2 className="text-5xl md:text-6xl font-bold mb-1" style={{ color: '#853710' }}>
                SETLER
              </h2>
              <p className="text-lg mb-6" style={{ color: '#9E906C', fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
                {i18n.language === 'tr' ? 'şık ve özgün kombinler' : 'stylish and original combinations'}
              </p>
              <Link
                href="/products?category=set"
                className="btn-primary inline-flex items-center gap-2 self-start mb-10"
              >
                {i18n.language === 'tr' ? 'Koleksiyonu Gör' : 'View Collection'}
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Product carousel */}
            {loading ? (
              <p className="text-sm" style={{ color: '#9E906C' }}>{t('common.loading')}</p>
            ) : setProducts.length > 0 ? (
              <div className="relative">
                <div
                  ref={setScrollRef}
                  className="flex gap-4 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
                >
                  {setProducts.map((product, index) => (
                    <div key={product.id} className="w-64 flex-shrink-0">
                      <ProductCard product={product} index={index} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => scrollCarousel(setScrollRef, 'left')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#853710', color: '#853710' }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => scrollCarousel(setScrollRef, 'right')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#853710', color: '#853710' }}
                    aria-label="Next"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: '#9E906C' }}>
                {i18n.language === 'tr' ? 'Henüz ürün eklenmedi' : 'No products yet'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. BİZ KİMİZ? – Dark sage background ── */}
      <section className="py-24 px-6 md:px-12" style={{ background: '#5d6b54' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative symbol */}
            <div className="flex justify-center mb-6">
              <Image
                src="/images/logo-symbol.png"
                alt=""
                width={52}
                height={52}
                className="h-12 w-auto opacity-60"
              />
            </div>

            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#F5D482', opacity: 0.8 }}>
              {i18n.language === 'tr' ? 'Hikayemiz' : 'Our Story'}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#FFF4DE' }}>
              {i18n.language === 'tr' ? 'Biz Kimiz?' : 'Who Are We?'}
            </h2>
            <p className="text-lg leading-relaxed mb-4" style={{ color: '#FFF4DE', opacity: 0.85 }}>
              {t('home.storyText1')}
            </p>
            <p className="text-lg leading-relaxed mb-10" style={{ color: '#FFF4DE', opacity: 0.85 }}>
              {t('home.storyText2')}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border font-medium transition-all"
              style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
            >
              {i18n.language === 'tr' ? 'Hakkımızda' : 'About Us'}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 5. FESTİVALLER & BLOG – Dark forest background ── */}
      <section className="relative overflow-hidden py-20 px-6 md:px-12" style={{ minHeight: 600 }}>
        <Image
          src="/images/homepage/forest.jpg"
          alt="Festival arka plan"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10, 20, 10, 0.65)' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#F5D482', opacity: 0.8 }}>
                {i18n.language === 'tr' ? 'Deneyimler' : 'Experiences'}
              </p>
              <h2 className="text-4xl font-bold" style={{ color: '#FFF4DE' }}>
                {t('nav.festivalsAndBlog')}
              </h2>
            </div>
            <Link
              href="/festivals-and-blog"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: '#FFF4DE', opacity: 0.85 }}
            >
              {i18n.language === 'tr' ? 'Tümünü Gör' : 'View All'}
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                src: 'labryinto.jpg',
                title: 'LABRYINTO FESTIVAL 2025',
                location: 'Guanacaste / Costa Rica',
                desc: i18n.language === 'tr'
                  ? 'Labryinto artık Mea Culpa\'nın yıllık ritüellerinden biri hâline geldi. Festival atmosferi, markamızın tasarım diliyle güçlü bir uyum içinde ilerliyor.'
                  : 'Labryinto has become one of Mea Culpa\'s annual rituals, evolving in strong harmony with our design language.',
              },
              {
                src: 'BPM.jpg',
                title: 'THE BPM FESTIVAL 2024',
                location: 'Tamarindo, Guanacaste, Costa Rica',
                desc: i18n.language === 'tr'
                  ? 'Mea Culpa artık BPM sahnesine yabancı değil. Markamız festival içinde çok daha görünür, çok daha bütünsel bir konuma ulaştı.'
                  : 'Mea Culpa is no longer a stranger to the BPM stage, reaching a much more visible position within the festival.',
              },
            ].map(({ src, title, location, desc }) => (
              <Link
                key={src}
                href="/festivals-and-blog"
                className="group overflow-hidden rounded-2xl block"
                style={{ background: 'rgba(255,244,222,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,244,222,0.15)' }}
              >
                <div className="relative overflow-hidden rounded-t-2xl" style={{ height: 220 }}>
                  <Image
                    src={`/images/homepage/${src}`}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#F5D482', opacity: 0.75 }}>
                    {location}
                  </p>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#FFF4DE' }}>{title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#FFF4DE', opacity: 0.75 }}>{desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium" style={{ color: '#F5D482' }}>
                    {i18n.language === 'tr' ? 'Detaylı İncele' : 'Read More'}
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex md:hidden justify-center mt-8">
            <Link href="/festivals-and-blog" className="btn-primary">
              {i18n.language === 'tr' ? 'Tümünü Gör' : 'View All'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. MÜŞTERİ YORUMLARI ── */}
      <Testimonials />
    </div>
  );
}
