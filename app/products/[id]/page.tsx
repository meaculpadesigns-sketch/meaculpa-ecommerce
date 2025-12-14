'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/lib/cart-context';
import { getProductById, addToFavorites, removeFromFavorites, getUserById } from '@/lib/firebase-helpers';
import { auth } from '@/lib/firebase';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Gift, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/currency';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    loadProduct();
    checkFavorite();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(params.id as string);
      if (data) {
        setProduct(data);
      } else {
        router.push('/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    const user = auth.currentUser;
    if (user) {
      const userData = await getUserById(user.uid);
      if (userData && userData.favorites.includes(params.id as string)) {
        setIsFavorite(true);
      }
    }
  };

  const handleCustomizeProduct = () => {
    // Navigate to customize page
    router.push(`/products/${params.id}/customize`);
  };

  const handleToggleFavorite = async () => {
    const user = auth.currentUser;
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(user.uid, params.id as string);
        setIsFavorite(false);
      } else {
        await addToFavorites(user.uid, params.id as string);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-black dark:text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const name = i18n.language === 'tr' ? product.name : product.nameEn;
  const description = i18n.language === 'tr' ? product.description : product.descriptionEn;
  const story = i18n.language === 'tr' ? product.story : product.storyEn;

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">Ürünler</Link>
          <span>/</span>
          <span className="text-black dark:text-white">{name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-zinc-800 rounded-2xl overflow-hidden group/zoom">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${name} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/zoom:scale-125"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-black dark:text-white text-lg">
                  Ürün Görseli {currentImageIndex + 1}
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-20 transition-all"
                  >
                    <ChevronLeft className="text-black dark:text-white" size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-20 transition-all"
                  >
                    <ChevronRight className="text-black dark:text-white" size={24} />
                  </button>
                </>
              )}

              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                  %{discountPercentage} İndirim
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square bg-zinc-800 rounded-lg overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-mea-gold' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Fabric Images - Separate Section */}
            {product.fabricImages && product.fabricImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">
                  {i18n.language === 'tr' ? 'Kumaş Detayları' : 'Fabric Details'}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.fabricImages.map((fabricImg, index) => (
                    <div key={index} className="aspect-square bg-zinc-800 rounded-xl overflow-hidden group/fabric">
                      <img
                        src={fabricImg}
                        alt={`${i18n.language === 'tr' ? 'Kumaş Detayı' : 'Fabric Detail'} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/fabric:scale-150 cursor-zoom-in"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Title and Favorite */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-black dark:text-white">{name}</h1>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full ${
                    isFavorite ? 'bg-red-500 text-white' : 'glass hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10'
                  } transition-all`}
                >
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Price hidden per user request - only show on customize page */}

              {/* Story Section */}
              {story && (
                <div className="glass rounded-xl p-6 mt-4">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">{t('products.story')}</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{story}</p>
                </div>
              )}
            </div>

            {/* Next Button - Navigate to customize page */}
            <button
              onClick={handleCustomizeProduct}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2 mt-6"
            >
              <ShoppingCart size={24} />
              {i18n.language === 'tr' ? 'İleri' : 'Next'}
            </button>
          </motion.div>
        </div>

        {/* Product Details Section - Below the 2-column layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-black dark:text-white mb-6">{t('products.details')}</h2>
          <div className="glass rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Days */}
              {product.deliveryDays && (
                <div>
                  <h3 className="text-black dark:text-white font-semibold mb-2">
                    {i18n.language === 'tr' ? 'Teslimat Süresi' : 'Delivery Time'}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400">
                    {product.deliveryDays} {i18n.language === 'tr' ? 'gün' : 'days'}
                  </p>
                </div>
              )}

              {/* Care Instructions */}
              <div>
                <h3 className="text-black dark:text-white font-semibold mb-2">{t('products.careInstructions')}</h3>
                <p className="text-gray-700 dark:text-gray-400">
                  {product.careInstructions?.type === 'custom' && product.careInstructions?.customText
                    ? product.careInstructions.customText
                    : i18n.language === 'tr'
                    ? '30 derecede yıkayınız. Ütü sıcaklığı orta.'
                    : 'Wash at 30 degrees. Iron at medium temperature.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
