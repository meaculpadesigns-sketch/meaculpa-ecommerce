'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/currency';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="mx-auto mb-6 text-gray-700 dark:text-gray-400" size={80} />
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
            {t('cart.empty')}
          </h2>
          <p className="text-gray-700 dark:text-gray-400 mb-8">
            Sepetinize ürün ekleyerek alışverişe başlayın
          </p>
          <Link href="/products" className="btn-primary">
            {t('cart.continueShopping')}
          </Link>
        </motion.div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  // Yurt içi kargo hesaplama (4500 TL üzeri ücretsiz, altı 175 TL)
  const shipping = subtotal >= 4500 ? 0 : 175;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-2">
            {t('cart.title')}
          </h1>
          <p className="text-gray-700 dark:text-gray-400">
            {cart.length} ürün sepetinizde
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const name = i18n.language === 'tr' ? item.product.name : item.product.nameEn;

              return (
                <motion.div
                  key={`${item.productId}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-32 h-32 bg-zinc-800 rounded-xl flex-shrink-0 overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-700 dark:text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="text-xl font-semibold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                              {name}
                            </h3>
                          </Link>
                          <p className="text-gray-700 dark:text-gray-400 text-sm mt-1">
                            Beden: {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                        >
                          <Trash2 size={20} className="text-red-400" />
                        </button>
                      </div>

                      {/* Special Requests */}
                      {item.specialRequests && (
                        <div className="mb-3 p-3 bg-zinc-800 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-400 text-sm mb-1">Özel İstekler:</p>
                          <p className="text-black dark:text-white text-sm">{item.specialRequests}</p>
                        </div>
                      )}

                      {/* Gift Wrapping */}
                      {item.giftWrapping && (
                        <div className="mb-3 p-3 bg-mea-gold bg-opacity-20 rounded-lg">
                          <p className="text-mea-gold text-sm mb-1">🎁 Hediye Paketi</p>
                          {item.giftMessage && (
                            <p className="text-black dark:text-white text-sm">{item.giftMessage}</p>
                          )}
                        </div>
                      )}

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                          >
                            <Minus size={16} className="text-black dark:text-white" />
                          </button>
                          <span className="text-black dark:text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                          >
                            <Plus size={16} className="text-black dark:text-white" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-black dark:text-white">
                            {formatPrice(item.product.price * item.quantity, i18n.language)}
                          </p>
                          <p className="text-gray-700 dark:text-gray-400 text-sm">
                            {formatPrice(item.product.price, i18n.language)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-400">{t('cart.subtotal')}</span>
                  <span className="text-black dark:text-white font-medium">{formatPrice(subtotal, i18n.language)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-400">{t('cart.shipping')}</span>
                  <span className="text-black dark:text-white font-medium">
                    {shipping === 0 ? (i18n.language === 'tr' ? 'Ücretsiz' : 'Free') : formatPrice(shipping, i18n.language)}
                  </span>
                </div>

                {/* Free Shipping Info */}
                {shipping === 0 ? (
                  <div className="p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                    <p className="text-green-500 text-sm">
                      {i18n.language === 'tr' ? '✓ Ücretsiz kargo kazandınız!' : '✓ You earned free shipping!'}
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-mea-gold bg-opacity-20 border border-mea-gold rounded-lg space-y-2">
                    <p className="text-black dark:text-white text-sm">
                      {i18n.language === 'tr'
                        ? `${formatPrice(4500 - subtotal, i18n.language)} daha alışveriş yapın, kargo ücretsiz olsun!`
                        : `Add ${formatPrice(4500 - subtotal, i18n.language)} more for free shipping!`}
                    </p>
                    <p className="text-gray-700 dark:text-gray-400 text-xs">
                      {i18n.language === 'tr'
                        ? 'Türkiye içi: 4500 TL üzeri ücretsiz kargo | Yurt dışı: 200 Euro üzeri ücretsiz kargo'
                        : 'Turkey: Free shipping over 4500 TL | International: Free shipping over 200 Euro'}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-white border-opacity-10">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-semibold text-lg">
                      {t('cart.total')}
                    </span>
                    <span className="text-2xl font-bold text-black">
                      {formatPrice(total, i18n.language)}
                    </span>
                  </div>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
                {t('cart.checkout')}
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/products"
                className="btn-secondary w-full mt-3 text-center block"
              >
                {t('cart.continueShopping')}
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-white border-opacity-10">
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Ücretsiz İade</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Hızlı Kargo</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
