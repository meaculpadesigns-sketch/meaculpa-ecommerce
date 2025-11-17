'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/firebase-helpers';
import { User, UserCoupon } from '@/types';
import { motion } from 'framer-motion';
import { Gift, ArrowLeft, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function CouponsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
          setCoupons(userData.coupons || []);
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const formatDiscount = (coupon: UserCoupon) => {
    if (coupon.discountType === 'percentage') {
      return `%${coupon.discount}`;
    } else {
      return i18n.language === 'tr' ? `₺${coupon.discount}` : `$${coupon.discount}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  const activeCoupons = coupons.filter(c => !c.isUsed && !isExpired(c.expiryDate));
  const usedCoupons = coupons.filter(c => c.isUsed || isExpired(c.expiryDate));

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
            <Gift className="text-pink-500" size={32} />
            <h1 className="text-4xl font-bold text-white">{t('profile.coupons')}</h1>
          </div>
          <p className="text-gray-400 mt-2">
            {activeCoupons.length} {t('profile.activeCoupons')}
          </p>
        </div>

        {/* Active Coupons */}
        {activeCoupons.length === 0 && usedCoupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Gift className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('profile.noCoupons')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('profile.noCouponsDesc')}
            </p>
            <Link href="/products" className="btn-primary inline-block">
              {t('profile.startShopping')}
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Active Coupons Section */}
            {activeCoupons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">{t('profile.activeCoupons')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 p-6 shadow-2xl"
                    >
                      {/* Decorative circles */}
                      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white bg-opacity-10 rounded-full" />
                      <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white bg-opacity-10 rounded-full" />

                      <div className="relative">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="text-4xl font-bold text-white mb-2">
                              {formatDiscount(coupon)}
                            </div>
                            <p className="text-white text-opacity-90 text-sm">
                              {coupon.description}
                            </p>
                          </div>
                          <Gift className="text-white" size={32} />
                        </div>

                        {coupon.minAmount && (
                          <p className="text-white text-opacity-80 text-sm mb-4">
                            {t('profile.minAmount')}: {i18n.language === 'tr' ? `₺${coupon.minAmount}` : `$${coupon.minAmount}`}
                          </p>
                        )}

                        <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3 flex items-center justify-between">
                          <code className="text-white font-mono font-bold text-lg">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="text-white" size={20} />
                            ) : (
                              <Copy className="text-white" size={20} />
                            )}
                          </button>
                        </div>

                        <p className="text-white text-opacity-80 text-xs">
                          {t('profile.validUntil')}: {new Date(coupon.expiryDate).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Used/Expired Coupons Section */}
            {usedCoupons.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">{t('profile.usedExpiredCoupons')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {usedCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass rounded-2xl p-6 opacity-60"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-3xl font-bold text-gray-400 mb-2">
                            {formatDiscount(coupon)}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {coupon.description}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-gray-500 bg-opacity-20 text-gray-400 text-xs">
                          {coupon.isUsed ? t('profile.used') : t('profile.expired')}
                        </span>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-3 mb-3">
                        <code className="text-gray-400 font-mono font-bold">
                          {coupon.code}
                        </code>
                      </div>

                      <p className="text-gray-400 text-xs">
                        {t('profile.expiredOn')}: {new Date(coupon.expiryDate).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
