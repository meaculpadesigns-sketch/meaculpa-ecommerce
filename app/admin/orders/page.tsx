'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, Filter, Eye, Check, X, Truck } from 'lucide-react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/types';
import Link from 'next/link';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusColors = {
  pending: 'bg-yellow-500 bg-opacity-20 text-yellow-500',
  processing: 'bg-blue-500 bg-opacity-20 text-blue-500',
  shipped: 'bg-purple-500 bg-opacity-20 text-purple-500',
  delivered: 'bg-green-500 bg-opacity-20 text-green-500',
  cancelled: 'bg-red-500 bg-opacity-20 text-red-500',
};

const statusLabels = {
  pending: 'Beklemede',
  processing: 'İşleniyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        order =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.guestEmail && order.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!confirm(`Sipariş durumunu "${statusLabels[newStatus]}" olarak değiştirmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });
      await fetchOrders();
      alert('Sipariş durumu güncellendi!');
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Güncelleme başarısız');
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sipariş Yönetimi</h1>
          <p className="text-gray-400">Tüm siparişleri görüntüleyin ve yönetin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Toplam</p>
            <p className="text-white text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-yellow-500 text-sm mb-1">Beklemede</p>
            <p className="text-white text-2xl font-bold">{stats.pending}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-blue-500 text-sm mb-1">İşleniyor</p>
            <p className="text-white text-2xl font-bold">{stats.processing}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-purple-500 text-sm mb-1">Kargoda</p>
            <p className="text-white text-2xl font-bold">{stats.shipped}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-green-500 text-sm mb-1">Teslim Edildi</p>
            <p className="text-white text-2xl font-bold">{stats.delivered}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-red-500 text-sm mb-1">İptal</p>
            <p className="text-white text-2xl font-bold">{stats.cancelled}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-mea-gold text-sm mb-1">Gelir</p>
            <p className="text-white text-xl font-bold">
              ₺{stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Sipariş numarası, müşteri adı veya e-posta ile ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                className="input-field pl-10"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="processing">İşleniyor</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white border-opacity-10">
                  <th className="text-left text-white font-semibold p-4">Sipariş No</th>
                  <th className="text-left text-white font-semibold p-4">Müşteri</th>
                  <th className="text-left text-white font-semibold p-4">Tarih</th>
                  <th className="text-left text-white font-semibold p-4">Toplam</th>
                  <th className="text-left text-white font-semibold p-4">Durum</th>
                  <th className="text-left text-white font-semibold p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition-colors"
                  >
                    <td className="p-4">
                      <Link
                        href={`/order-tracking?orderNumber=${order.orderNumber}`}
                        className="text-mea-gold hover:underline font-medium"
                      >
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-medium">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-gray-400 text-sm">{order.guestEmail || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-white">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-white font-semibold">₺{order.total.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">{order.items.length} ürün</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="p-2 bg-blue-500 bg-opacity-20 text-blue-500 rounded-lg hover:bg-opacity-30 transition-colors"
                            title="İşleme Al"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            className="p-2 bg-purple-500 bg-opacity-20 text-purple-500 rounded-lg hover:bg-opacity-30 transition-colors"
                            title="Kargoya Ver"
                          >
                            <Truck size={16} />
                          </button>
                        )}
                        {order.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="p-2 bg-green-500 bg-opacity-20 text-green-500 rounded-lg hover:bg-opacity-30 transition-colors"
                            title="Teslim Edildi"
                          >
                            <Package size={16} />
                          </button>
                        )}
                        {['pending', 'processing'].includes(order.status) && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="p-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
                            title="İptal Et"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <Link
                          href={`/order-tracking?orderNumber=${order.orderNumber}`}
                          className="p-2 bg-mea-gold bg-opacity-20 text-mea-gold rounded-lg hover:bg-opacity-30 transition-colors"
                          title="Detayları Gör"
                        >
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-20">
              <Package className="mx-auto mb-6 text-gray-400" size={80} />
              <h2 className="text-2xl font-bold text-white mb-4">
                Sipariş Bulunamadı
              </h2>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all'
                  ? 'Arama kriterlerinize uygun sipariş bulunamadı'
                  : 'Henüz hiç sipariş alınmadı'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
