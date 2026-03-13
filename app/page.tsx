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
      ref.current.scrollBy({ left: direction === 'left' ? -240 : 240, behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* ── 1. HERO – Full bleed fotoğraf + overlay içerik ── */}
      <section className="relative h-screen -mt-44">
        {/* Görsel wrapper — overflow-hidden sadece burada */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/homepage/1giristakimlar.png"
            alt="Mea Culpa koleksiyon"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 20%' }}
            priority
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
        </div>

        {/* Overlay içerik */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end px-8 md:px-16 py-10 md:py-14">

          {/* Sol alt: slogan + metin + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="max-w-lg"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              style={{ color: '#FFF4DE' }}
            >
              {t('hero.slogan1')}
            </h1>
            <p
              className="text-base md:text-lg mb-8 leading-relaxed"
              style={{ color: '#FFF4DE', opacity: 0.88, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}
            >
              {i18n.language === 'tr'
                ? 'Doğunun ilhamıyla, modern yaşamın içinde.'
                : 'Inspired by the East, within modern life.'}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-medium transition-all hover:bg-white hover:bg-opacity-10"
              style={{ border: '1.5px solid #FFF4DE', color: '#FFF4DE' }}
            >
              {i18n.language === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>

        {/* Polaroid container — her iki polaroid birbirine yakın, sağda */}
        <div
          className="absolute right-8 md:right-12 top-0 hidden md:block pointer-events-none"
          style={{ zIndex: 12, height: '130vh', width: 340 }}
        >
          {/* 2polaroid */}
          <div
            className="absolute"
            style={{
              top: '44%',
              left: '0%',
              transform: 'rotate(-10deg)',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))',
            }}
          >
            <Image src="/images/homepage/2polaroid.png" alt="" width={270} height={332} />
          </div>

          {/* 3polaroid */}
          <div
            className="absolute"
            style={{
              top: '60%',
              right: '0%',
              transform: 'rotate(8deg)',
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))',
            }}
          >
            <Image src="/images/homepage/3polaroid.png" alt="" width={255} height={314} />
          </div>
        </div>
      </section>

      {/* ── 2. KİMONO – Sage green, featured image sol ── */}
      <section className="overflow-hidden" style={{ background: '#889177' }}>
        <div className="flex flex-col lg:flex-row">

          {/* Sol: Featured kimono fotoğrafı */}
          <div className="lg:w-2/5 relative" style={{ minHeight: 520 }}>
            <Image
              src="/images/homepage/4kimono.png"
              alt="Kimono koleksiyonu"
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Sağ: Başlık + şerit + kartlar */}
          <div className="lg:w-3/5 flex flex-col justify-center px-8 md:px-12 py-14">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#FFF4DE', opacity: 0.6 }}>
                {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
              </p>
              <h2 className="text-5xl md:text-6xl font-bold" style={{ color: '#FFF4DE' }}>
                KİMONO
              </h2>
              {/* Dekoratif şerit */}
              <div className="w-14 h-px my-3" style={{ background: '#FFF4DE' }} />
              <p className="text-lg mb-6" style={{ color: '#FFF4DE', opacity: 0.82, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
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

            {/* Ürün kartları */}
            {loading ? (
              <p className="text-sm" style={{ color: '#FFF4DE', opacity: 0.6 }}>{t('common.loading')}</p>
            ) : kimonoProducts.length > 0 ? (
              <div>
                <div
                  ref={kimonoScrollRef}
                  className="flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
                >
                  {kimonoProducts.map((product, index) => (
                    <div key={product.id} className="w-56 flex-shrink-0">
                      <ProductCard product={product} index={index} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => scrollCarousel(kimonoScrollRef, 'left')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollCarousel(kimonoScrollRef, 'right')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: '#FFF4DE', opacity: 0.5 }}>
                {i18n.language === 'tr' ? 'Henüz ürün eklenmedi' : 'No products yet'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. SETLER – 3 sütun (sol manken | orta içerik | sağ manken) ── */}
      <section className="overflow-hidden" style={{ background: '#FFF4DE' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px]" style={{ minHeight: 560 }}>

          {/* Sol: sol-manken */}
          <div className="hidden lg:block relative">
            <Image
              src="/images/homepage/sol-manken.png"
              alt="Setler koleksiyonu"
              fill
              className="object-cover object-top"
            />
          </div>

          {/* Orta: başlık + kartlar */}
          <div className="flex flex-col justify-center px-8 md:px-12 py-14">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#853710', opacity: 0.6 }}>
                {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
              </p>
              <h2 className="text-5xl md:text-6xl font-bold" style={{ color: '#853710' }}>
                SETLER
              </h2>
              {/* Dekoratif şerit */}
              <div className="w-14 h-px my-3" style={{ background: '#853710' }} />
              <p className="text-lg mb-6" style={{ color: '#9E906C', fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
                {i18n.language === 'tr' ? 'özel kumaşlardan üretilmiş kombinler' : 'combinations crafted from special fabrics'}
              </p>
              <Link
                href="/products?category=set"
                className="btn-primary inline-flex items-center gap-2 self-start mb-10"
              >
                {i18n.language === 'tr' ? 'Koleksiyonu Gör' : 'View Collection'}
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Ürün kartları */}
            {loading ? (
              <p className="text-sm" style={{ color: '#9E906C' }}>{t('common.loading')}</p>
            ) : setProducts.length > 0 ? (
              <div>
                <div
                  ref={setScrollRef}
                  className="flex gap-3 overflow-x-auto pb-2 scroll-smooth scrollbar-hide"
                >
                  {setProducts.map((product, index) => (
                    <div key={product.id} className="w-56 flex-shrink-0">
                      <ProductCard product={product} index={index} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => scrollCarousel(setScrollRef, 'left')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#853710', color: '#853710' }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollCarousel(setScrollRef, 'right')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#853710', color: '#853710' }}
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: '#9E906C' }}>
                {i18n.language === 'tr' ? 'Henüz ürün eklenmedi' : 'No products yet'}
              </p>
            )}
          </div>

          {/* Sağ: sag-manken */}
          <div className="hidden lg:block relative">
            <Image
              src="/images/homepage/sag-manken.png"
              alt="Setler koleksiyonu"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* ── 4. BİZ KİMİZ? – Taupe bg, sol polaroidler, sağ metin ── */}
      <section style={{ background: '#9E906C' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: 380 }}>

          {/* Sol: üst üste tilted polaroidler */}
          <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
            <div
              className="absolute shadow-xl"
              style={{ top: '12%', left: '8%', transform: 'rotate(-5deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 175, zIndex: 2 }}
            >
              <div className="relative" style={{ height: 215 }}>
                <Image src="/images/homepage/2polaroid.png" alt="" fill className="object-cover" />
              </div>
            </div>
            <div
              className="absolute shadow-xl"
              style={{ top: '26%', left: '32%', transform: 'rotate(5deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 162, zIndex: 3 }}
            >
              <div className="relative" style={{ height: 198 }}>
                <Image src="/images/homepage/polaroid3.png" alt="" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Sağ: metin */}
          <div className="flex flex-col justify-center px-10 md:px-16 py-16">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#FFF4DE', opacity: 0.65 }}>
                {i18n.language === 'tr' ? 'Hikayemiz' : 'Our Story'}
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#FFF4DE' }}>
                {i18n.language === 'tr' ? 'Biz Kimiz?' : 'Who Are We?'}
              </h2>
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: '#FFF4DE', opacity: 0.88, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}
              >
                {t('home.storyText1')}
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border font-medium self-start transition-all hover:bg-white hover:bg-opacity-10"
                style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
              >
                {i18n.language === 'tr' ? 'Hakkımızda' : 'About Us'}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 5. FESTİVALLER & BLOG – Forest bg, yatay kartlar alt alta ── */}
      <section className="relative overflow-hidden py-16 px-6 md:px-12" style={{ minHeight: 520 }}>
        <Image
          src="/images/homepage/forest.jpg"
          alt="Festival arka plan"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10, 20, 10, 0.65)' }} />

        <div className="relative z-10 max-w-4xl mx-auto">
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

          {/* Yatay kartlar — alt alta */}
          <div className="flex flex-col gap-5">
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
                className="flex flex-row overflow-hidden rounded-xl group"
                style={{ background: 'rgba(255,244,222,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,244,222,0.15)' }}
              >
                {/* Sol: fotoğraf */}
                <div className="relative flex-shrink-0" style={{ width: 192, minHeight: 180 }}>
                  <Image
                    src={`/images/homepage/${src}`}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Sağ: metin */}
                <div className="p-5 flex flex-col justify-center">
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#F5D482', opacity: 0.75 }}>
                    {location}
                  </p>
                  <h3 className="text-lg font-bold mb-2" style={{ color: '#FFF4DE' }}>{title}</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#FFF4DE', opacity: 0.75 }}>{desc}</p>
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
