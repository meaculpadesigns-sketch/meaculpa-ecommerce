'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Creation } from '@/types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface CreationSectionProps {
  creation: Creation;
  index: number;
}

export default function CreationSection({ creation, index }: CreationSectionProps) {
  const { i18n, t } = useTranslation();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100]);

  const title = i18n.language === 'tr' ? creation.title : creation.titleEn;
  const description = i18n.language === 'tr' ? creation.description : creation.descriptionEn;
  const story = i18n.language === 'tr' ? creation.story : creation.storyEn;

  // Sample products for demonstration
  const sampleProducts = [
    { id: '1', name: t('home.product') + ' 1', price: 999, image: '/images/product-1.jpg' },
    { id: '2', name: t('home.product') + ' 2', price: 1299, image: '/images/product-2.jpg' },
    { id: '3', name: t('home.product') + ' 3', price: 899, image: '/images/product-3.jpg' },
    { id: '4', name: t('home.product') + ' 4', price: 1499, image: '/images/product-4.jpg' },
  ];

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById(`products-${creation.id}`);
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center py-20 px-4"
    >
      <motion.div
        style={{ opacity, scale, y }}
        className="w-full max-w-7xl mx-auto"
      >
        {/* Title and Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            {description}
          </p>

          {/* Story Label */}
          <div className="inline-block mt-6">
            <button className="glass px-6 py-3 rounded-full text-white hover:bg-white hover:bg-opacity-10 transition-all group">
              <span className="mr-2">{t('home.story')}</span>
              <ArrowRight className="inline group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>

        {/* Story Text */}
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-gray-400 text-lg leading-relaxed text-center">
            {story}
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scrollContainer('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button
            onClick={() => scrollContainer('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass p-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="text-white" size={24} />
          </button>

          {/* Products Container */}
          <div
            id={`products-${creation.id}`}
            className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
          >
            {sampleProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex-shrink-0 w-80 snap-center"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="group relative">
                    {/* Product on Model */}
                    <div className="relative aspect-[3/4] bg-zinc-800 rounded-2xl overflow-hidden mb-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Fabric Sample - Small circle in corner */}
                      <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-white overflow-hidden">
                        <div className="w-full h-full bg-zinc-700" />
                      </div>

                      {/* Product placeholder */}
                      <div className="w-full h-full flex items-center justify-center text-white text-lg">
                        {t('home.productView')}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                    </div>

                    {/* Product Info */}
                    <div className="text-center">
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {product.name}
                      </h3>
                      <p className="text-mea-gold text-lg font-medium">
                        ₺{product.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href={`/creations/${creation.id}`}
            className="inline-flex items-center btn-primary"
          >
            {t('home.viewAll')}
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white via-opacity-20 to-transparent" />
    </section>
  );
}
