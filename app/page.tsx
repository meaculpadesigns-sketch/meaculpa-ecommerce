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
      const firstChild = ref.current.firstElementChild as HTMLElement;
      const cardWidth = firstChild ? firstChild.offsetWidth + 12 : 240; // 12 = gap-3
      ref.current.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
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
              style={{ color: '#FFF4DE', opacity: 0.88, fontStyle: 'italic', fontFamily: "'Bellota Text'", textAlign: 'justify' }}
            >
              {i18n.language === 'tr'
                ? 'Mea Culpa; festivallerin özgür enerjisinden, müziğin ritminden, çocukların saf neşesinden ve bilinçli yaşamı seçen insanların duruşundan ilham alır.'
                : 'Mea Culpa draws inspiration from the free energy of festivals, the rhythm of music, the pure joy of children, and the stance of those who choose conscious living.'}
            </p>
            <div className="flex justify-end">
              <Link
                href="/products"
                className="inline-flex items-center px-7 py-3 rounded-lg font-medium transition-all hover:bg-white hover:bg-opacity-10"
                style={{ border: '1.5px solid #FFF4DE', color: '#FFF4DE' }}
              >
                {i18n.language === 'tr' ? 'Alışverişe Başla' : 'Start Shopping'}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* 2polaroid — TL erkek modelin omzunda */}
        <div
          className="absolute hidden md:block pointer-events-none"
          style={{
            top: '28%',
            left: '44%',
            width: 'min(30vw, 450px)',
            aspectRatio: '1046 / 1266',
            transform: 'rotate(-10deg)',
            zIndex: 12,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))',
          }}
        >
          <Image src="/images/homepage/2polaroid.png" alt="" fill style={{ objectFit: 'contain' }} />
        </div>

        {/* 3polaroid — sağ kenardan az taşıyor, alt KİMONO çizgisinde */}
        <div
          className="absolute hidden md:block pointer-events-none"
          style={{
            top: '56%',
            right: '-1vw',
            width: 'min(29vw, 430px)',
            aspectRatio: '1046 / 1266',
            transform: 'rotate(8deg)',
            zIndex: 12,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))',
          }}
        >
          <Image src="/images/homepage/3polaroid.png" alt="" fill style={{ objectFit: 'contain' }} />
        </div>
      </section>

      {/* ── 2. KİMONO – Sage green, featured image sol ── */}
      <section className="overflow-hidden" style={{ background: '#9E906C' }}>
        <div className="flex flex-col lg:flex-row">

          {/* Sol: Featured kimono fotoğrafı */}
          <div className="lg:w-2/5 relative overflow-hidden" style={{ minHeight: 520, zIndex: 1 }}>
            <Image
              src="/images/homepage/4kimono.png"
              alt="Kimono koleksiyonu"
              fill
              className="object-cover object-top"
              style={{ transform: 'scale(1.08) translateX(-6%)' }}
            />
          </div>

          {/* Sağ: Başlık + şerit + kartlar */}
          <div className="lg:w-3/5 flex flex-col px-8 md:px-12 pb-0" style={{ paddingTop: '150px' }}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* === DESKTOP (lg+): metinler sağa yaslı, çubuğun bitiminde === */}
              <div className="hidden lg:block">
                <h2 className="text-5xl md:text-6xl font-bold"
                  style={{ color: '#FFF4DE', textAlign: 'right', marginLeft: 'calc(-40vw - 48px)', width: 'calc(40vw + 48px)' }}>
                  KİMONO
                </h2>
                {/* Çubuk + Buton + Scroll butonları aynı satır */}
                <div className="flex items-center mt-2 mb-0"
                  style={{ marginLeft: 'calc(-40vw - 48px)', width: 'max-content' }}>
                  <div style={{ height: '2px', background: '#FFF4DE', opacity: 0.85, width: 'calc(40vw + 48px)', flexShrink: 0 }} />
                  <Link
                    href="/products?category=kimono"
                    className="whitespace-nowrap inline-flex items-center px-7 py-3 rounded-lg font-medium ml-4 transition-all hover:bg-white hover:bg-opacity-10"
                    style={{ border: '1.5px solid #FFF4DE', color: '#FFF4DE' }}
                  >
                    {i18n.language === 'tr' ? 'Koleksiyonu Gör' : 'View Collection'}
                  </Link>
                  <button
                    onClick={() => scrollCarousel(kimonoScrollRef, 'left')}
                    className="ml-3 p-2 rounded-full border"
                    style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollCarousel(kimonoScrollRef, 'right')}
                    className="ml-1 p-2 rounded-full border"
                    style={{ borderColor: '#FFF4DE', color: '#FFF4DE' }}
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <p className="text-lg mb-1"
                  style={{ color: '#FFF4DE', opacity: 0.82, fontStyle: 'italic', fontFamily: "'Bellota Text'", textAlign: 'right', marginLeft: 'calc(-40vw - 48px)', width: 'calc(40vw + 48px)' }}>
                  {i18n.language === 'tr' ? 'hikayesi olan özel tasarımlar' : 'unique designs with a story'}
                </p>
              </div>

              {/* === MOBİLE (< lg): normal düzen === */}
              <div className="lg:hidden">
                <h2 className="text-5xl font-bold" style={{ color: '#FFF4DE' }}>KİMONO</h2>
                <div className="w-14 my-3" style={{ height: '2px', background: '#FFF4DE' }} />
                <p className="text-lg mb-6" style={{ color: '#FFF4DE', opacity: 0.82, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
                  {i18n.language === 'tr' ? 'hikayesi olan özel tasarımlar' : 'unique designs with a story'}
                </p>
                <Link
                  href="/products?category=kimono"
                  className="inline-flex items-center px-7 py-3 rounded-lg font-medium mb-10 self-start transition-all hover:bg-white hover:bg-opacity-10"
                  style={{ border: '1.5px solid #FFF4DE', color: '#FFF4DE' }}
                >
                  {i18n.language === 'tr' ? 'Koleksiyonu Gör' : 'View Collection'}
                </Link>
              </div>
            </motion.div>

            {/* Ürün kartları */}
            {loading ? (
              <p className="text-sm mt-auto" style={{ color: '#FFF4DE', opacity: 0.6 }}>{t('common.loading')}</p>
            ) : kimonoProducts.length > 0 ? (
              <div className="mt-auto">
                <div
                  ref={kimonoScrollRef}
                  className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
                >
                  {kimonoProducts.map((product, index) => (
                    <div key={product.id} className="flex-shrink-0" style={{ width: 'calc(20vw - 40px)' }}>
                      <ProductCard product={product} index={index} cardBg="#FFF4DE" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm mt-auto" style={{ color: '#FFF4DE', opacity: 0.5 }}>
                {i18n.language === 'tr' ? 'Henüz ürün eklenmedi' : 'No products yet'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. SETLER – 3 sütun (sol manken | orta içerik | sağ manken) ── */}
      <section className="relative" style={{ background: '#FFF4DE', zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_220px]" style={{ minHeight: 560 }}>

          {/* Sol: boş spacer — manken absolute */}
          <div className="hidden lg:block" />

          {/* Orta: başlık + kartlar */}
          <div className="flex flex-col px-8 md:px-12 pt-14 pb-0 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Desktop: SETLER başlığı + bar+buton aynı satır + alt yazı */}
              <div className="hidden lg:block">
                <p
                  className="text-xs tracking-widest uppercase mb-1"
                  style={{ color: '#9E906C', opacity: 0.6, marginLeft: 'calc((200vw - 1048px) / 3)' }}
                >
                  {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
                </p>
                <h2
                  className="text-5xl md:text-6xl font-bold"
                  style={{ color: '#9E906C', marginLeft: 'calc((200vw - 1048px) / 3)' }}
                >
                  SETLER
                </h2>

                {/* Bar + Buton — aynı dikey hizada */}
                <div className="relative my-1" style={{ height: 50 }}>
                  {/* Bar: 3. karttan sağ kenara */}
                  <div
                    className="absolute top-1/2"
                    style={{
                      height: '2px',
                      background: '#9E906C',
                      left: 'calc((200vw - 1048px) / 3)',
                      right: 'calc(-220px - 48px)',
                      transform: 'translateY(-50%)',
                    }}
                  />
                  {/* Buton: ortada, barın üstünde */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
                    <Link
                      href="/products?category=set"
                      className="inline-flex items-center px-7 py-3 rounded-lg font-medium transition-all hover:bg-[#7a6e55] hover:text-white whitespace-nowrap"
                      style={{ border: '1.5px solid #9E906C', color: '#9E906C', background: '#FFF4DE' }}
                    >
                      {i18n.language === 'tr' ? 'Koleksiyonu Gör' : 'View Collection'}
                    </Link>
                  </div>
                </div>

                <p
                  className="text-lg mb-8"
                  style={{ color: '#9E906C', fontStyle: 'italic', fontFamily: "'Bellota Text'", marginLeft: 'calc((200vw - 1048px) / 3)' }}
                >
                  {i18n.language === 'tr' ? 'özel kumaşlardan üretilmiş kombinler' : 'combinations crafted from special fabrics'}
                </p>
              </div>

              {/* Mobile: normal düzen */}
              <div className="lg:hidden">
                <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#9E906C', opacity: 0.6 }}>
                  {i18n.language === 'tr' ? 'Koleksiyon' : 'Collection'}
                </p>
                <h2 className="text-5xl font-bold mb-1" style={{ color: '#9E906C' }}>SETLER</h2>
                <div className="w-14 h-px my-3" style={{ background: '#9E906C' }} />
                <p className="text-lg mb-6" style={{ color: '#9E906C', fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
                  {i18n.language === 'tr' ? 'özel kumaşlardan üretilmiş kombinler' : 'combinations crafted from special fabrics'}
                </p>
                <Link
                  href="/products?category=set"
                  className="inline-flex items-center px-7 py-3 rounded-lg font-medium mb-8 transition-all hover:bg-[#7a6e55] hover:text-white"
                  style={{ border: '1.5px solid #9E906C', color: '#9E906C' }}
                >
                  {i18n.language === 'tr' ? 'Koleksiyonu Gör' : 'View Collection'}
                </Link>
              </div>
            </motion.div>

            {/* Ürün kartları */}
            {loading ? (
              <p className="text-sm mt-auto" style={{ color: '#9E906C' }}>{t('common.loading')}</p>
            ) : setProducts.length > 0 ? (
              <div className="mt-auto">
                <div className="flex gap-2 mb-3" style={{ position: 'relative', zIndex: 20 }}>
                  <button
                    onClick={() => scrollCarousel(setScrollRef, 'left')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#9E906C', color: '#9E906C' }}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => scrollCarousel(setScrollRef, 'right')}
                    className="p-2 rounded-full border"
                    style={{ borderColor: '#9E906C', color: '#9E906C' }}
                    aria-label="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div
                  ref={setScrollRef}
                  className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide"
                >
                  {setProducts.map((product, index) => (
                    <div key={product.id} className="flex-shrink-0" style={{ width: 'calc((100vw - 560px) / 3)' }}>
                      <ProductCard product={product} index={index} cardBg="#9E906C" lightText />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm mt-auto" style={{ color: '#9E906C' }}>
                {i18n.language === 'tr' ? 'Henüz ürün eklenmedi' : 'No products yet'}
              </p>
            )}
          </div>

          {/* Sağ: boş spacer — manken absolute */}
          <div className="hidden lg:block" />
        </div>

        {/* Sol manken — section'ı aşağı taşıyor */}
        <Image
          src="/images/homepage/sol-manken.png"
          alt="Setler koleksiyonu"
          width={562}
          height={1000}
          className="hidden lg:block absolute"
          style={{ bottom: -120, zIndex: 10, left: -170 }}
        />

        {/* Sağ manken — section'ı aşağı taşıyor */}
        <Image
          src="/images/homepage/sag-manken.png"
          alt="Setler koleksiyonu"
          width={562}
          height={1000}
          className="hidden lg:block absolute"
          style={{ bottom: -120, zIndex: 10, right: -120 }}
        />
      </section>

      {/* ── 4. BİZ KİMİZ? – Taupe bg, sol polaroidler, sağ metin ── */}
      <section className="relative" style={{ background: '#9E906C', overflow: 'visible' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">

          {/* Sol: boş spacer — polaroidler absolute olarak section'dan taşıyor */}
          <div className="hidden lg:block" style={{ minHeight: 220 }} />

          {/* Sağ: başlık + [açıklama | buton] */}
          <div className="flex flex-col justify-center px-10 md:px-14 py-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#FFF4DE' }}>
                {i18n.language === 'tr' ? 'Biz Kimiz?' : 'Who Are We?'}
              </h2>
              <div className="flex items-center gap-8">
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: '#FFF4DE', opacity: 0.88, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}
                >
                  {i18n.language === 'tr'
                    ? 'Mea Culpa, zamana dokunan hikayeler anlatan bir moda markasıdır. Doğu\'nun zengin kültürel mirasından ilham alarak, modern yaşamla buluşturan özgün tasarımlar yaratıyoruz.'
                    : 'Mea Culpa is a fashion brand that tells stories touching time. Drawing inspiration from the rich cultural heritage of the East, we create unique designs that meet modern life.'}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center px-6 py-2.5 font-medium whitespace-nowrap flex-shrink-0 transition-all hover:opacity-80"
                  style={{ border: '1.5px solid #FFF4DE', color: '#9E906C', background: '#FFF4DE' }}
                >
                  {i18n.language === 'tr' ? 'Hakkımızda' : 'About Us'}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Polaroidler — section'dan aşağı taşıyor */}
        <div
          className="hidden lg:block absolute shadow-xl"
          style={{ top: 20, left: -15, transform: 'rotate(-15deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 310, zIndex: 30 }}
        >
          <div className="relative" style={{ height: 375 }}>
            <Image src="/images/homepage/polaroid4.png" alt="" fill className="object-cover" />
          </div>
        </div>
        <div
          className="hidden lg:block absolute shadow-xl"
          style={{ top: '125%', left: '5%', transform: 'rotate(10deg)', background: '#fff', padding: '8px 8px 28px 8px', width: 280, zIndex: 31 }}
        >
          <div className="relative" style={{ height: 340 }}>
            <Image src="/images/homepage/polaroid3.png" alt="" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── 5. FESTİVALLER & BLOG – Forest bg, yatay kartlar alt alta ── */}
      <section className="relative py-12 pr-10 pl-0" style={{ minHeight: 460 }}>
        {/* Arka plan — overflow:hidden içinde clip edildi, logo taşabilsin diye */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/homepage/forest.jpg"
            alt="Festival arka plan"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10, 20, 10, 0.65)' }} />
        </div>

        {/* İçerik — sol %28 polaroidlere bırakıldı */}
        <div className="relative z-10 flex flex-col" style={{ marginLeft: '28%' }}>

          {/* Başlık — kartların sağ kenarıyla hizalı */}
          <h2 className="text-4xl font-bold text-right mb-5" style={{ color: '#ffffff' }}>
            Festivaller & Blog
          </h2>

          {/* LABRYINTO — metin sol, görsel sağ */}
          <div className="flex overflow-hidden rounded-xl mb-4 group" style={{ background: 'rgba(0,0,0,0.78)' }}>
            <div className="flex-1 p-5 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold tracking-widest uppercase" style={{ color: '#ffffff' }}>
                  LABRYINTO FESTIVAL 2025
                </h3>
                <Link href="/festivals-and-blog" className="text-xs ml-4 whitespace-nowrap flex-shrink-0 px-3 py-1" style={{ color: '#FFF4DE', border: '1px solid rgba(255,244,222,0.55)' }}>
                  {i18n.language === 'tr' ? 'Detaylı İncele' : 'Read More'}
                </Link>
              </div>
              <p className="text-xs mb-2" style={{ color: '#c9a96e' }}>Guanacaste / Costa Rica</p>
              <p className="text-sm leading-relaxed" style={{ color: '#FFF4DE', opacity: 0.82, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
                {i18n.language === 'tr'
                  ? '2024\'e geldiğimizde, Labryinto artık Mea Culpa\'nın yıllık ritüellerinden biri hâline gelmiştir. Her geçen yıl daha da zenginleşen festival atmosferi, markamızın dinamik tasarım diliyle güçlü bir uyum içinde ilerledi.'
                  : 'Labryinto has become one of Mea Culpa\'s annual rituals. Each year, the festival atmosphere deepens in strong harmony with our design language.'}
              </p>
            </div>
            <div className="relative flex-shrink-0" style={{ width: 180 }}>
              <Image src="/images/homepage/labryinto.jpg" alt="Labryinto Festival" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* THE BPM — görsel sol, metin sağ */}
          <div className="flex overflow-hidden rounded-xl group" style={{ background: 'rgba(0,0,0,0.78)' }}>
            <div className="relative flex-shrink-0" style={{ width: 180 }}>
              <Image src="/images/homepage/BPM.jpg" alt="BPM Festival" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex-1 p-5 flex flex-col">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold tracking-widest uppercase" style={{ color: '#ffffff' }}>
                  THE BPM FESTIVAL 2024
                </h3>
                <Link href="/festivals-and-blog" className="text-xs ml-4 whitespace-nowrap flex-shrink-0 px-3 py-1" style={{ color: '#FFF4DE', border: '1px solid rgba(255,244,222,0.55)' }}>
                  {i18n.language === 'tr' ? 'Detaylı İncele' : 'Read More'}
                </Link>
              </div>
              <p className="text-xs mb-2" style={{ color: '#c9a96e' }}>Tamarindo, Guanacaste, Costa Rica</p>
              <p className="text-sm leading-relaxed" style={{ color: '#FFF4DE', opacity: 0.82, fontStyle: 'italic', fontFamily: "'Bellota Text'" }}>
                {i18n.language === 'tr'
                  ? '2024\'e geldiğimizde, Mea Culpa artık BPM sahnesine yabancı değildi. İlk yılın deneyimleri üzerine inşa edilen bu edisyonda, markamız festival içinde çok daha görünür. Çok daha tanıdık ve çok daha bütünsel bir konuma ulaştı.'
                  : 'Mea Culpa is no longer a stranger to the BPM stage, reaching a much more visible and integrated position within the festival.'}
              </p>
            </div>
          </div>

          {/* Tümünü Gör — BPM kartının solunda hizalı */}
          <div className="mt-4">
            <Link href="/festivals-and-blog" className="text-base font-bold px-4 py-1.5" style={{ color: '#FFF4DE', border: '1px solid rgba(255,244,222,0.55)' }}>
              {i18n.language === 'tr' ? 'Tümünü Gör' : 'View All'}
            </Link>
          </div>
        </div>

        {/* Mea Culpa sembol logosu — yarısı bu bölümde, yarısı footer'da */}
        <div className="absolute z-20" style={{ bottom: -64, left: '50%', transform: 'translateX(-50%)' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Sayfanın başına dön">
            <Image
              src="/images/MeaCulpaSymbolPNG.png"
              alt="Mea Culpa"
              width={128}
              height={128}
              style={{ cursor: 'pointer' }}
            />
          </a>
        </div>
      </section>

      {/* ── 6. MÜŞTERİ YORUMLARI ── */}
      {/* <Testimonials /> */}
    </div>
  );
}
