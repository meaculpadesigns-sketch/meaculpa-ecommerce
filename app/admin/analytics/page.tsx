'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminAnalyticsPage() {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language === 'tr';
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Sample analytics data
  const stats = {
    totalRevenue: 145680,
    revenueChange: 12.5,
    totalOrders: 342,
    ordersChange: 8.3,
    totalCustomers: 1234,
    customersChange: 15.7,
    avgOrderValue: 426,
    avgOrderValueChange: -2.1,
  };

  const topProducts = [
    { name: 'Geleneksel Kimono - Bej', sales: 45, revenue: 22500 },
    { name: 'Modern Gömlek - Lacivert', sales: 38, revenue: 15200 },
    { name: 'Özel Tasarım Set', sales: 32, revenue: 28800 },
    { name: 'Kimono - Bordo', sales: 28, revenue: 14000 },
    { name: 'Gömlek - Beyaz', sales: 24, revenue: 9600 },
  ];

  const trafficSources = [
    { source: 'Direct', visits: 2543, percentage: 35 },
    { source: 'Instagram', visits: 1876, percentage: 26 },
    { source: 'Google Search', visits: 1432, percentage: 20 },
    { source: 'Facebook', visits: 876, percentage: 12 },
    { source: 'Others', visits: 543, percentage: 7 },
  ];

  const salesByCategory = [
    { category: 'Kimono', sales: 45, percentage: 42 },
    { category: 'Shirt', sales: 35, percentage: 33 },
    { category: 'Set', sales: 20, percentage: 19 },
    { category: 'Others', sales: 7, percentage: 6 },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {isTurkish ? 'Analitik & Raporlar' : 'Analytics & Reports'}
            </h1>
            <p className="text-gray-400">
              {isTurkish
                ? 'Satış ve kullanıcı davranış analizleri'
                : 'Sales and user behavior analytics'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="input-field"
            >
              <option value="7d">{isTurkish ? 'Son 7 Gün' : 'Last 7 Days'}</option>
              <option value="30d">{isTurkish ? 'Son 30 Gün' : 'Last 30 Days'}</option>
              <option value="90d">{isTurkish ? 'Son 90 Gün' : 'Last 90 Days'}</option>
              <option value="1y">{isTurkish ? 'Son 1 Yıl' : 'Last 1 Year'}</option>
            </select>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="text-green-500" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.revenueChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(stats.revenueChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Toplam Gelir' : 'Total Revenue'}
            </p>
            <p className="text-3xl font-bold text-white">₺{stats.totalRevenue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <ShoppingCart className="text-blue-500" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.ordersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.ordersChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(stats.ordersChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Toplam Sipariş' : 'Total Orders'}
            </p>
            <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Users className="text-purple-500" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.customersChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.customersChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(stats.customersChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Toplam Müşteri' : 'Total Customers'}
            </p>
            <p className="text-3xl font-bold text-white">{stats.totalCustomers}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <BarChart3 className="text-yellow-500" size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stats.avgOrderValueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.avgOrderValueChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(stats.avgOrderValueChange)}%
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Ort. Sipariş Değeri' : 'Avg. Order Value'}
            </p>
            <p className="text-3xl font-bold text-white">₺{stats.avgOrderValue}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              {isTurkish ? 'En Çok Satan Ürünler' : 'Top Selling Products'}
            </h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{product.name}</p>
                    <p className="text-sm text-gray-400">
                      {product.sales} {isTurkish ? 'satış' : 'sales'}
                    </p>
                  </div>
                  <p className="text-mea-gold font-semibold">₺{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Traffic Sources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Eye size={24} />
              {isTurkish ? 'Trafik Kaynakları' : 'Traffic Sources'}
            </h3>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{source.source}</p>
                    <p className="text-gray-400">{source.visits.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className="bg-mea-gold rounded-full h-2"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sales by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">
            {isTurkish ? 'Kategoriye Göre Satışlar' : 'Sales by Category'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {salesByCategory.map((category, index) => (
              <div key={index} className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">{category.category}</p>
                <p className="text-2xl font-bold text-white mb-2">{category.sales}</p>
                <div className="w-full bg-zinc-800 rounded-full h-2">
                  <div
                    className="bg-mea-gold rounded-full h-2"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">{category.percentage}%</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}