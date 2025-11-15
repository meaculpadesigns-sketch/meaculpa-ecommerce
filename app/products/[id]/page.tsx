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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showStory, setShowStory] = useState(false);

  useEffect(() => {
    loadProduct();
    checkFavorite();
  }, [params.id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(params.id as string);
      if (data) {
        setProduct(data);
        if (data.sizes.length > 0 && data.sizes[0].inStock) {
          setSelectedSize(data.sizes[0].size);
        }
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

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      alert('Lütfen bir beden seçin');
      return;
    }

    addToCart(product, selectedSize, quantity, specialRequests, giftWrapping, giftMessage);

    // Success message
    alert('Ürün sepete eklendi!');
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
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
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
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Ürünler</Link>
          <span>/</span>
          <span className="text-white">{name}</span>
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
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                  Ürün Görseli {currentImageIndex + 1}
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                  >
                    <ChevronLeft className="text-white" size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                  >
                    <ChevronRight className="text-white" size={24} />
                  </button>
                </>
              )}

              {/* Fabric Sample */}
              {product.fabricImage && (
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full border-2 border-white overflow-hidden group/fabric cursor-pointer">
                  <img
                    src={product.fabricImage}
                    alt="Kumaş Detayı"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/fabric:scale-150"
                  />
                </div>
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
                <h1 className="text-4xl font-bold text-white">{name}</h1>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-full ${
                    isFavorite ? 'bg-red-500 text-white' : 'glass hover:bg-white hover:bg-opacity-10'
                  } transition-all`}
                >
                  <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-bold text-mea-gold">₺{product.price}</span>
                {product.oldPrice && (
                  <span className="text-2xl text-gray-500 line-through">₺{product.oldPrice}</span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-mea-gold" fill="currentColor" />
                  ))}
                </div>
                <span className="text-gray-400">(0 değerlendirme)</span>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
            </div>

            {/* Story */}
            {story && (
              <button
                onClick={() => setShowStory(!showStory)}
                className="text-mea-gold hover:underline"
              >
                {t('products.viewStory')}
              </button>
            )}

            {/* Size Selection */}
            <div>
              <label className="block text-white font-semibold mb-3">
                {t('products.selectSize')}
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size.size}
                    onClick={() => size.inStock && setSelectedSize(size.size)}
                    disabled={!size.inStock && !size.preOrder}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      selectedSize === size.size
                        ? 'bg-mea-gold text-black'
                        : size.inStock
                        ? 'glass hover:bg-white hover:bg-opacity-10 text-white'
                        : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {size.size}
                    {size.preOrder && ' (Ön Sipariş)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-white font-semibold mb-3">Adet</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  -
                </button>
                <span className="text-white font-medium text-lg w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-white font-semibold mb-3">
                {t('products.specialRequests')}
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
              />
            </div>

            {/* Gift Wrapping */}
            <div className="glass rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={giftWrapping}
                  onChange={(e) => setGiftWrapping(e.target.checked)}
                  className="w-5 h-5"
                />
                <div className="flex items-center gap-2">
                  <Gift className="text-mea-gold" size={20} />
                  <span className="text-white font-medium">
                    {t('products.giftWrapping')} (+₺20)
                  </span>
                </div>
              </label>

              {giftWrapping && (
                <div className="mt-4">
                  <label className="block text-white text-sm mb-2">
                    {t('products.giftMessage')}
                  </label>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="input-field"
                    rows={2}
                    placeholder="Hediye mesajınızı yazın..."
                  />
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={24} />
              {t('products.addToCart')}
            </button>

            {/* Delivery Info */}
            {product.estimatedDelivery && (
              <div className="glass rounded-xl p-4">
                <p className="text-gray-400 text-sm">
                  {t('products.estimatedDelivery')}
                </p>
                <p className="text-white font-medium">{product.estimatedDelivery}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Story Modal */}
        {showStory && story && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
            onClick={() => setShowStory(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">{name} - Hikayesi</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{story}</p>
              <button onClick={() => setShowStory(false)} className="btn-primary mt-6">
                Kapat
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
