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
}

export default function ProductCard({ product, index, viewMode = 'grid' }: ProductCardProps) {
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
    // Navigate to customize page instead of directly adding to cart
    if (e) {
      e.preventDefault();
    }
    window.location.href = `/products/${product.id}/customize`;
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
          <div className="relative w-full md:w-64 aspect-square bg-zinc-800 rounded-xl overflow-hidden group/image">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
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
                <h3 className="text-2xl font-semibold text-black hover:text-gray-700 transition-colors">
                  {name}
                </h3>
              </Link>
              {story && <p className="text-gray-400 mt-2 line-clamp-2">{story}</p>}
            </div>

            <button
              onClick={handleAddToFavorites}
              className={`p-2 rounded-full ${
                isFavorite ? 'text-red-500' : 'text-gray-400'
              } hover:bg-white hover:bg-opacity-10 transition-all`}
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
      <div className="product-card">
        {/* Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden group/image">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover/image:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
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

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToFavorites();
              }}
              className={`absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 backdrop-blur-sm ${
                isFavorite ? 'text-red-500' : 'text-white'
              } hover:bg-opacity-70 transition-all`}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="btn-primary"
              >
                <ShoppingCart size={20} className="mr-2 inline" />
                {t('products.addToCart')}
              </button>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-6 bg-gradient-to-br from-mea-gold to-yellow-600">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-white transition-colors">
              {name}
            </h3>
          </Link>

          {story && (
            <p className="text-gray-800 text-sm mb-4 line-clamp-2">
              {story}
            </p>
          )}

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price, i18n.language)}</span>
            {product.oldPrice && (
              <span className="text-gray-700 line-through text-xs">{formatPrice(product.oldPrice, i18n.language)}</span>
            )}
          </div>

          {/* Story Button */}
          {product.story && (
            <button
              onClick={() => setShowStory(!showStory)}
              className="text-gray-900 text-sm hover:text-white transition-colors mb-2 font-medium"
            >
              {t('products.viewStory')}
            </button>
          )}

          {/* Sizes */}
          <div className="flex flex-wrap gap-2">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size.size}
                className={`px-2 py-1 rounded text-xs ${
                  size.inStock
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {size.size}
              </span>
            ))}
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
            <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
            <p className="text-gray-300 leading-relaxed">
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
