'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firebase-helpers';
import { User } from '@/types';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/lib/currency';

export default function FavoritesPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
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
        <div className="animate-pulse text-black dark:text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  const favorites = user?.favorites || [];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-black dark:text-white hover:text-black dark:text-white transition-colors mb-4">
            <ArrowLeft size={20} />
            {t('profile.backToProfile')}
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="text-red-500" size={32} />
            <h1 className="text-4xl font-bold text-black dark:text-white">{t('profile.favorites')}</h1>
          </div>
          <p className="text-black dark:text-white mt-2">
            {favorites.length} {t('profile.products')}
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Heart className="mx-auto mb-6 text-black dark:text-white" size={80} />
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              {t('profile.noFavorites')}
            </h2>
            <p className="text-black dark:text-white mb-8">
              {t('profile.noFavoritesDesc')}
            </p>
            <Link href="/products" className="btn-primary inline-block">
              {t('profile.browseProducts')}
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((productId, index) => (
              <motion.div
                key={productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden group"
              >
                <div className="aspect-square bg-zinc-800 relative">
                  {/* Product image would be loaded here from Firebase */}
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    {t('common.loading')}...
                  </div>
                  <button className="absolute top-3 right-3 p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-opacity">
                    <Trash2 className="text-black dark:text-white" size={16} />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                    {t('common.loading')}...
                  </h3>
                  <p className="text-mea-gold font-semibold">
                    {formatPrice(0, i18n.language)}
                  </p>
                  <Link
                    href={`/products/${productId}`}
                    className="mt-4 btn-primary block text-center"
                  >
                    {t('profile.viewProduct')}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
