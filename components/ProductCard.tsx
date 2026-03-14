'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/currency';

interface ProductCardProps {
  product: Product;
  index: number;
  viewMode?: 'grid' | 'list';
  showPrice?: boolean;
  cardBg?: string;
  lightText?: boolean;
}

export default function ProductCard({ product, index, viewMode = 'grid', showPrice = false, cardBg = '#ffffff', lightText = false }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showStory, setShowStory] = useState(false);

  const name = i18n.language === 'tr' ? product.name : product.nameEn;
  const story = i18n.language === 'tr' ? product.story : product.storyEn;

  const handleAddToFavorites = () => {
    // In production, save to Firebase
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    // Navigate to product detail page
    if (e) {
      e.preventDefault();
    }
    window.location.href = `/products/${product.id}`;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:bg-white hover:bg-opacity-5 transition-all"
      >
        <Link href={`/products/${product.id}`} className="flex-shrink-0">
          <div className="relative w-full md:w-64 aspect-square rounded-xl overflow-hidden group/image">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={name}
                className="w-full h-full object-contain transition-transform duration-300 group-hover/image:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black dark:text-white">
                {t('home.productView')}
              </div>
            )}

            {/* Sold Out Badge */}
            {!product.inStock && (
              <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {i18n.language === 'tr' ? 'Tükendi' : 'Sold Out'}
              </div>
            )}

            {/* Discount Badge */}
            {product.inStock && product.oldPrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {t('products.discount')}
              </div>
            )}
          </div>
        </Link>

        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link href={`/products/${product.id}`}>
                <h3 className="text-2xl font-semibold text-black dark:text-black hover:text-gray-700 dark:hover:text-gray-700 transition-colors">
                  {name}
                </h3>
              </Link>
              {story && <p className="text-black dark:text-white mt-2 line-clamp-2">{story}</p>}
            </div>

            <button
              onClick={handleAddToFavorites}
              className={`p-2 rounded-full ${
                isFavorite ? 'text-red-500' : 'text-black dark:text-white'
              } hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 transition-all`}
            >
              <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Price section hidden per user request - only show on customize page */}
          {!product.inStock && (
            <div className="mb-4">
              <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {i18n.language === 'tr' ? 'Tükendi' : 'Sold Out'}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {product.sizes.map((size) => (
              <span
                key={size.size}
                className={`px-3 py-1 rounded-lg text-sm ${
                  size.inStock
                    ? 'bg-zinc-700 text-white'
                    : 'bg-zinc-800 text-gray-500'
                }`}
              >
                {size.size}
                {!size.inStock && size.preOrder && ` (${t('products.preOrder')})`}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex items-center gap-2"
            >
              <ShoppingCart size={20} />
              {t('products.addToCart')}
            </button>
            <Link href={`/products/${product.id}`} className="btn-secondary flex items-center gap-2">
              <Eye size={20} />
              {t('products.viewDetails')}
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="product-card flex flex-col">
        {/* Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-[3/4] overflow-hidden group/image">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                {i18n.language === 'tr' ? 'Görsel yok' : 'No image'}
              </div>
            )}

            {/* Sold Out Badge */}
            {!product.inStock && (
              <div className="absolute top-3 left-3 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold shadow">
                {i18n.language === 'tr' ? 'Tükendi' : 'Sold Out'}
              </div>
            )}

            {/* Discount Badge */}
            {product.inStock && product.oldPrice && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4" style={{ background: cardBg }}>
          <Link href={`/products/${product.id}`}>
            <h3
              className="text-sm font-bold mb-1 hover:opacity-70 transition-opacity line-clamp-1"
              style={{ color: lightText ? '#ffffff' : '#000000' }}
            >
              {name}
            </h3>
          </Link>

          {story && (
            <p className="text-xs mb-3 line-clamp-2" style={{ color: lightText ? '#FFF4DE' : '#000000', opacity: lightText ? 0.8 : 0.55 }}>
              {story}
            </p>
          )}

          {showPrice && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-sm font-bold" style={{ color: lightText ? '#ffffff' : '#000000' }}>{formatPrice(product.price, i18n.language)}</span>
              {product.oldPrice && (
                <span className="text-xs line-through" style={{ color: lightText ? '#FFF4DE' : '#000000', opacity: 0.4 }}>{formatPrice(product.oldPrice, i18n.language)}</span>
              )}
            </div>
          )}

          {/* Detaylı İncele butonu - altta sola yaslı */}
          <div className="mt-auto pt-2 flex justify-start">
            <Link
              href={`/products/${product.id}`}
              className="text-xs font-medium px-4 py-2 rounded-lg transition-all"
              style={lightText
                ? { border: '1px solid rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.85)' }
                : { border: '1px solid rgba(0,0,0,0.35)', color: 'rgba(0,0,0,0.45)' }}
            >
              {i18n.language === 'tr' ? 'Detaylı İncele' : 'View Details'}
            </Link>
          </div>
        </div>
      </div>

      {/* Story Modal */}
      {showStory && product.story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
          onClick={() => setShowStory(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass rounded-2xl p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-black dark:text-white mb-4">{name}</h3>
            <p className="text-black dark:text-white leading-relaxed">
              {i18n.language === 'tr' ? product.story : product.storyEn}
            </p>
            <button
              onClick={() => setShowStory(false)}
              className="btn-primary mt-6"
            >
              {t('common.close')}
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
