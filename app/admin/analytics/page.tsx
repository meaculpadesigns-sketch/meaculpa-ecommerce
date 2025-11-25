'use client';

import { useState, useEffect } from 'react';
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
import { getAllOrders, getAllUsers, getProducts } from '@/lib/firebase-helpers';
import { Order, Product } from '@/types';

export default function AdminAnalyticsPage() {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language === 'tr';
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [ordersData, usersData, productsData] = await Promise.all([
          getAllOrders(),
          getAllUsers(),
          getProducts()
        ]);

        setOrders(ordersData);
        setUsers(usersData);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter orders by time range
  const getFilteredOrders = () => {
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return orders.filter(order => {
      const orderDate = order.createdAt instanceof Date
        ? order.createdAt
        : new Date((order.createdAt as any).seconds * 1000);
      return orderDate >= cutoffDate;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Calculate analytics
  const stats = {
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
    revenueChange: 0, // Would need historical data to calculate
    totalOrders: filteredOrders.length,
    ordersChange: 0, // Would need historical data to calculate
    totalCustomers: users.length,
    customersChange: 0, // Would need historical data to calculate
    avgOrderValue: filteredOrders.length > 0
      ? filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length
      : 0,
    avgOrderValueChange: 0, // Would need historical data to calculate
  };

  // Calculate top products
  const productSales: Record<string, { name: string, sales: number, revenue: number }> = {};

  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const productId = item.productId;
      const product = products.find(p => p.id === productId);
      const productName = product ? (isTurkish ? product.name : product.nameEn) : 'Unknown';

      if (!productSales[productId]) {
        productSales[productId] = { name: productName, sales: 0, revenue: 0 };
      }

      productSales[productId].sales += item.quantity;
      productSales[productId].revenue += item.product.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Sales by category
  const categorySales: Record<string, number> = {
    kimono: 0,
    set: 0,
  };

  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product && categorySales[product.category] !== undefined) {
        categorySales[product.category] += item.quantity;
      }
    });
  });

  const totalCategorySales = Object.values(categorySales).reduce((a, b) => a + b, 0);

  const salesByCategory = [
    {
      category: 'Kimono',
      sales: categorySales.kimono,
      percentage: totalCategorySales > 0 ? Math.round((categorySales.kimono / totalCategorySales) * 100) : 0
    },
    {
      category: isTurkish ? 'Setler' : 'Sets',
      sales: categorySales.set,
      percentage: totalCategorySales > 0 ? Math.round((categorySales.set / totalCategorySales) * 100) : 0
    },
  ].filter(item => item.sales > 0);

  // Mock traffic sources (would need analytics integration for real data)
  const trafficSources = [
    { source: 'Direct', visits: 0, percentage: 0 },
    { source: 'Instagram', visits: 0, percentage: 0 },
    { source: 'Google Search', visits: 0, percentage: 0 },
    { source: 'Facebook', visits: 0, percentage: 0 },
    { source: 'Others', visits: 0, percentage: 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-white text-xl">
          {isTurkish ? 'Yükleniyor...' : 'Loading...'}
        </div>
      </div>
    );
  }

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
              className="admin-input"
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
            <p className="text-3xl font-bold text-white">₺{Math.round(stats.totalRevenue).toLocaleString()}</p>
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
            <p className="text-3xl font-bold text-white">₺{Math.round(stats.avgOrderValue)}</p>
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
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium mb-1">{product.name}</p>
                      <p className="text-sm text-gray-400">
                        {product.sales} {isTurkish ? 'satış' : 'sales'}
                      </p>
                    </div>
                    <p className="text-mea-gold font-semibold">₺{Math.round(product.revenue).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                {isTurkish ? 'Henüz satış yok' : 'No sales yet'}
              </p>
            )}
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
            <div className="text-center py-8 text-gray-400">
              <p className="mb-2">
                {isTurkish
                  ? 'Trafik verilerini görmek için Google Analytics entegrasyonu gereklidir.'
                  : 'Google Analytics integration required to view traffic data.'}
              </p>
              <p className="text-sm">
                {isTurkish
                  ? 'Lütfen ayarlar sayfasından Google Analytics ID\'nizi ekleyin.'
                  : 'Please add your Google Analytics ID from the settings page.'}
              </p>
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
          {totalCategorySales > 0 ? (
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
          ) : (
            <p className="text-gray-400 text-center py-8">
              {isTurkish ? 'Henüz satış yok' : 'No sales yet'}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
