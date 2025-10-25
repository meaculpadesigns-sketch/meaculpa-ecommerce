'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById, getUserOrders } from '@/lib/firebase-helpers';
import { User, Order } from '@/types';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Heart,
  Package,
  MapPin,
  CreditCard,
  Gift,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userData = await getUserById(authUser.uid);
        if (userData) {
          setUser(userData);
          const userOrders = await getUserOrders(authUser.uid);
          setOrders(userOrders);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sections = [
    {
      title: 'Favorilerim',
      description: `${user.favorites?.length || 0} ürün`,
      icon: Heart,
      href: '/profile/favorites',
      color: 'from-red-500 to-pink-500',
    },
    {
      title: 'Aktif Siparişlerim',
      description: `${orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length} sipariş`,
      icon: Package,
      href: '/profile/orders',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Geçmiş Siparişler',
      description: `${orders.filter(o => o.status === 'delivered').length} sipariş`,
      icon: Package,
      href: '/profile/orders?filter=delivered',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Adreslerim',
      description: `${user.addresses?.length || 0} adres`,
      icon: MapPin,
      href: '/profile/addresses',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Kartlarım',
      description: 'Kayıtlı kartlar',
      icon: CreditCard,
      href: '/profile/cards',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Kuponlarım',
      description: `${user.coupons?.length || 0} kupon`,
      icon: Gift,
      href: '/profile/coupons',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 bg-mea-gold rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="text-black" size={40} />
            </div>

            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-400 mb-1">{user.email}</p>
              <p className="text-gray-400">{user.phone}</p>
            </div>

            <div className="flex gap-3">
              <button className="p-3 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
                <Settings className="text-white" size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                <LogOut size={20} />
                Çıkış Yap
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={section.href}>
                <div className="group relative overflow-hidden rounded-2xl p-6 glass hover:bg-white hover:bg-opacity-15 transition-all cursor-pointer h-full">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />

                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${section.color} mb-4`}>
                      <section.icon className="text-white" size={24} />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">
                      {section.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {section.description}
                    </p>

                    <div className="mt-4 flex items-center text-mea-gold text-sm font-medium">
                      Görüntüle
                      <span className="ml-2 transform group-hover:translate-x-2 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Son Siparişler</h2>
              <Link href="/profile/orders" className="text-mea-gold hover:underline">
                Tümünü Gör
              </Link>
            </div>

            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  href={`/order-tracking?orderNumber=${order.orderNumber}`}
                  className="block p-4 glass rounded-xl hover:bg-white hover:bg-opacity-5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium mb-1">
                        Sipariş #{order.orderNumber}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-mea-gold font-semibold mb-1">
                        ₺{order.total.toFixed(2)}
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.status === 'delivered'
                            ? 'bg-green-500 bg-opacity-20 text-green-500'
                            : 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                        }`}
                      >
                        {order.status === 'delivered' ? 'Teslim Edildi' : 'Devam Ediyor'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
