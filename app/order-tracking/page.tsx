'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getOrderByNumber } from '@/lib/firebase-helpers';
import { Order } from '@/types';

export default function OrderTrackingPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);
  const [orderNumber, setOrderNumber] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const foundOrder = await getOrderByNumber(orderNumber, contact);

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError(t('orderTracking.notFound'));
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError(t('orderTracking.errorSearching'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={32} />;
      case 'processing':
        return <Package className="text-blue-500" size={32} />;
      case 'shipped':
        return <Truck className="text-purple-500" size={32} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={32} />;
      default:
        return <Clock className="text-gray-500" size={32} />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return t('orderTracking.statusPending');
      case 'processing':
        return t('orderTracking.statusProcessing');
      case 'shipped':
        return t('orderTracking.statusShipped');
      case 'delivered':
        return t('orderTracking.statusDelivered');
      case 'cancelled':
        return t('orderTracking.statusCancelled');
      default:
        return status;
    }
  };

  const orderSteps = [
    { status: 'pending', label: t('orderTracking.stepReceived'), icon: Clock },
    { status: 'processing', label: t('orderTracking.stepProcessing'), icon: Package },
    { status: 'shipped', label: t('orderTracking.stepShipped'), icon: Truck },
    { status: 'delivered', label: t('orderTracking.stepDelivered'), icon: CheckCircle },
  ];

  const getCurrentStepIndex = (status: Order['status']) => {
    return orderSteps.findIndex((step) => step.status === status);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('orderTracking.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('orderTracking.subtitle')}
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                {t('orderTracking.orderNumber')}
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder={t('orderTracking.orderNumberPlaceholder')}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                {t('orderTracking.contactLabel')}
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t('orderTracking.contactPlaceholder')}
                className="input-field"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                <p className="text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                t('orderTracking.searching')
              ) : (
                <>
                  <Search size={20} />
                  {t('orderTracking.search')}
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status Timeline */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8">{t('orderTracking.statusTitle')}</h2>

              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-8 left-8 right-8 h-1 bg-zinc-700">
                  <div
                    className="h-full bg-mea-gold transition-all duration-500"
                    style={{
                      width: `${(getCurrentStepIndex(order.status) / (orderSteps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="relative grid grid-cols-4 gap-4">
                  {orderSteps.map((step, index) => {
                    const isComplete = getCurrentStepIndex(order.status) >= index;
                    const isCurrent = getCurrentStepIndex(order.status) === index;

                    return (
                      <div key={step.status} className="flex flex-col items-center">
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                            isComplete
                              ? 'bg-mea-gold text-black'
                              : 'bg-zinc-700 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-mea-gold ring-opacity-50' : ''}`}
                        >
                          <step.icon size={28} />
                        </div>
                        <p
                          className={`text-sm text-center ${
                            isComplete ? 'text-white font-medium' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Status */}
              <div className="mt-8 p-6 bg-mea-gold bg-opacity-10 rounded-xl border border-mea-gold border-opacity-30">
                <div className="flex items-center gap-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {getStatusText(order.status)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {t('orderTracking.updated')} {new Date(order.updatedAt).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tracking Number */}
              {order.trackingNumber && (
                <div className="mt-6 p-4 glass rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">{t('orderTracking.trackingNumber')}</p>
                  <p className="text-white font-mono font-semibold text-lg">
                    {order.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{t('orderTracking.orderContent')}</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-zinc-800 rounded-xl"
                  >
                    <div className="w-20 h-20 bg-zinc-700 rounded-lg flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-white font-medium">{item.product.name}</p>
                      <p className="text-gray-400 text-sm">
                        {t('orderTracking.size')} {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-mea-gold font-semibold">
                      ₺{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t border-white border-opacity-10">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-lg">{t('orderTracking.total')}</span>
                  <span className="text-mea-gold font-bold text-2xl">
                    ₺{order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{t('orderTracking.deliveryAddress')}</h2>
              <div className="text-gray-300">
                <p className="font-medium text-white mb-2">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city} / {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.zipCode}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
