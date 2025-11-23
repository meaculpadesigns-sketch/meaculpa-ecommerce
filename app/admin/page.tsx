'use client';

import { useEffect } from 'react';
import { useAdminAuth } from '@/lib/use-admin-auth';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  FileText,
  Gift,
  Star,
  Calendar,
  Wand2,
  Link as LinkIcon,
  Ticket,
} from 'lucide-react';

export default function AdminDashboard() {
  const { loading, isAdmin } = useAdminAuth();

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const adminSections = [
    {
      title: 'Ürün Yönetimi',
      description: 'Ürün ekle, düzenle, sil',
      icon: Package,
      href: '/admin/products',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Siparişler',
      description: 'Sipariş takibi ve durum güncelleme',
      icon: ShoppingBag,
      href: '/admin/orders',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Festivaller & Etkinlikler',
      description: 'Etkinlik ekle, düzenle, yönet',
      icon: Calendar,
      href: '/admin/carnivals',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Kullanıcılar',
      description: 'Kullanıcı yönetimi ve kuponlar',
      icon: Users,
      href: '/admin/users',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Mesajlar',
      description: 'Canlı destek ve tasarım istekleri',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'İndirimler',
      description: 'Ürün indirimleri',
      icon: Gift,
      href: '/admin/discounts',
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Kupon Kodları',
      description: 'Kişiye özel ve genel kuponlar',
      icon: Ticket,
      href: '/admin/coupons',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Yorumlar & Hikayeler',
      description: 'Kullanıcı yorumları ve hikayeler',
      icon: Star,
      href: '/admin/reviews',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: 'Analitik',
      description: 'Satış ve davranış analizi',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-teal-500 to-green-500',
    },
    {
      title: 'İçerik Yönetimi',
      description: 'Sayfalar ve SEO',
      icon: FileText,
      href: '/admin/content',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'AI Mock-up Oluşturucu',
      description: 'Gemini AI ile mock-up tasarla',
      icon: Wand2,
      href: '/admin/mockup-generator',
      color: 'from-violet-500 to-purple-500',
    },
    {
      title: 'Kumaş Linkleri',
      description: 'Sipariş edilen kumaş linkleri',
      icon: LinkIcon,
      href: '/admin/fabric-links',
      color: 'from-amber-500 to-yellow-500',
    },
    {
      title: 'Ayarlar',
      description: 'Site ayarları ve karşılama mesajı',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-gray-500 to-slate-500',
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Admin Paneli
          </h1>
          <p className="text-gray-400 text-lg">
            Mea Culpa yönetim paneline hoş geldiniz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
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
                      Yönet
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

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Toplam Ürün</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Bekleyen Siparişler</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Toplam Kullanıcı</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-2">Okunmamış Mesaj</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
