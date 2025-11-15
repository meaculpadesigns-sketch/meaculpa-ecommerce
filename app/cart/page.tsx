'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  useEffect(() => {
    document.body.className = 'bg-home';
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
          <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('cart.empty')}
          </h2>
          <p className="text-gray-400 mb-8">
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
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {t('cart.title')}
          </h1>
          <p className="text-gray-400">
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
                    <div className="w-full md:w-32 h-32 bg-zinc-800 rounded-xl flex-shrink-0" />

                    {/* Product Info */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/products/${item.productId}`}>
                            <h3 className="text-xl font-semibold text-white hover:text-mea-gold transition-colors">
                              {name}
                            </h3>
                          </Link>
                          <p className="text-gray-400 text-sm mt-1">
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
                          <p className="text-gray-400 text-sm mb-1">Özel İstekler:</p>
                          <p className="text-white text-sm">{item.specialRequests}</p>
                        </div>
                      )}

                      {/* Gift Wrapping */}
                      {item.giftWrapping && (
                        <div className="mb-3 p-3 bg-mea-gold bg-opacity-20 rounded-lg">
                          <p className="text-mea-gold text-sm mb-1">🎁 Hediye Paketi</p>
                          {item.giftMessage && (
                            <p className="text-white text-sm">{item.giftMessage}</p>
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
                            <Minus size={16} className="text-white" />
                          </button>
                          <span className="text-white font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                          >
                            <Plus size={16} className="text-white" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">
                            ₺{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            ₺{item.product.price} x {item.quantity}
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
              <h2 className="text-2xl font-bold text-white mb-6">
                Sipariş Özeti
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{t('cart.subtotal')}</span>
                  <span className="text-white font-medium">₺{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">{t('cart.shipping')}</span>
                  <span className="text-white font-medium">
                    {shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}
                  </span>
                </div>

                {subtotal < 500 && (
                  <div className="p-3 bg-mea-gold bg-opacity-20 rounded-lg">
                    <p className="text-mea-gold text-sm">
                      ₺{(500 - subtotal).toFixed(2)} daha alışveriş yapın, kargo bedava!
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-white border-opacity-10">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">
                      {t('cart.total')}
                    </span>
                    <span className="text-2xl font-bold text-mea-gold">
                      ₺{total.toFixed(2)}
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
                <div className="space-y-3 text-sm text-gray-400">
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
