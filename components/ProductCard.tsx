'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';

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
  const description = i18n.language === 'tr' ? product.description : product.descriptionEn;

  const handleAddToFavorites = () => {
    // In production, save to Firebase
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // In production, add to cart
    console.log('Added to cart:', product.id);
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
          <div className="w-full md:w-64 aspect-square bg-zinc-800 rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              {t('home.productView')}
            </div>
          </div>
        </Link>

        <div className="flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Link href={`/products/${product.id}`}>
                <h3 className="text-2xl font-semibold text-white hover:text-mea-gold transition-colors">
                  {name}
                </h3>
              </Link>
              <p className="text-gray-400 mt-2">{description}</p>
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

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-mea-gold">₺{product.price}</span>
              {product.oldPrice && (
                <span className="text-gray-500 line-through">₺{product.oldPrice}</span>
              )}
            </div>
            {product.oldPrice && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% {t('products.discount')}
              </span>
            )}
          </div>

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
          <div className="relative aspect-[3/4] bg-zinc-800 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              {t('home.productView')}
            </div>

            {/* Discount Badge */}
            {product.oldPrice && (
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
        <div className="p-6">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xl font-semibold text-white mb-2 hover:text-mea-gold transition-colors">
              {name}
            </h3>
          </Link>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-mea-gold">₺{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-500 line-through text-sm">₺{product.oldPrice}</span>
            )}
          </div>

          {/* Story Button */}
          {product.story && (
            <button
              onClick={() => setShowStory(!showStory)}
              className="text-mea-gold text-sm hover:underline mb-2"
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
                    ? 'bg-zinc-700 text-white'
                    : 'bg-zinc-800 text-gray-500'
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
