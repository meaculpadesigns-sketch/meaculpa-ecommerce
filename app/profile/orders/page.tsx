'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById, getUserOrders } from '@/lib/firebase-helpers';
import { User, Order } from '@/types';
import { motion } from 'framer-motion';
import { Package, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/lib/currency';

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = searchParams?.get('filter');

  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userData = await getUserById(authUser.uid);
        if (userData) {
          setUser(userData);
          const userOrders = await getUserOrders(authUser.uid);
          setOrders(userOrders);
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  // Filter orders based on query parameter
  const filteredOrders = filter === 'delivered'
    ? orders.filter(o => o.status === 'delivered')
    : orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500 bg-opacity-20 text-green-500';
      case 'shipped':
        return 'bg-blue-500 bg-opacity-20 text-blue-500';
      case 'processing':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-500';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return t('profile.delivered');
      case 'shipped':
        return t('profile.shipped');
      case 'processing':
        return t('profile.processing');
      case 'pending':
        return t('profile.pending');
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={20} />
            {t('profile.backToProfile')}
          </Link>
          <div className="flex items-center gap-3">
            <Package className="text-blue-500" size={32} />
            <h1 className="text-4xl font-bold text-white">
              {filter === 'delivered' ? t('profile.pastOrders') : t('profile.activeOrders')}
            </h1>
          </div>
          <p className="text-gray-400 mt-2">
            {filteredOrders.length} {t('profile.orders')}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <Link
            href="/profile/orders"
            className={`px-6 py-3 rounded-lg transition-all ${
              !filter
                ? 'bg-mea-gold text-black font-semibold'
                : 'glass hover:bg-white hover:bg-opacity-10 text-gray-300'
            }`}
          >
            {t('profile.activeOrders')}
          </Link>
          <Link
            href="/profile/orders?filter=delivered"
            className={`px-6 py-3 rounded-lg transition-all ${
              filter === 'delivered'
                ? 'bg-mea-gold text-black font-semibold'
                : 'glass hover:bg-white hover:bg-opacity-10 text-gray-300'
            }`}
          >
            {t('profile.pastOrders')}
          </Link>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Package className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('profile.noOrders')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('profile.noOrdersDesc')}
            </p>
            <Link href="/products" className="btn-primary inline-block">
              {t('profile.startShopping')}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {t('profile.order')} #{order.orderNumber}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">
                      {new Date(order.createdAt).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-300">
                      {order.items.length} {t('profile.products')}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="text-right">
                      <p className="text-gray-400 text-sm mb-1">{t('profile.total')}</p>
                      <p className="text-2xl font-bold text-mea-gold">
                        {formatPrice(order.total, i18n.language)}
                      </p>
                    </div>
                    <Link
                      href={`/order-tracking?orderNumber=${order.orderNumber}`}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Eye size={20} />
                      {t('profile.viewOrder')}
                    </Link>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="aspect-square bg-zinc-800 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
