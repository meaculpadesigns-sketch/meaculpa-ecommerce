'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Gift, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, UserCoupon } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [couponData, setCouponData] = useState({
    code: '',
    discount: 0,
    expiryDate: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0 || searchTerm) {
      filterUsers();
    }
  }, [users, searchTerm]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        user =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const createCoupon = async () => {
    if (!selectedUser || !couponData.code || !couponData.discount) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const newCoupon: UserCoupon = {
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        code: couponData.code,
        discount: couponData.discount,
        discountType: 'percentage',
        expiryDate: couponData.expiryDate,
        isUsed: false,
        description: `${couponData.discount}% indirim kuponu`,
      };

      const userCoupons = selectedUser.coupons || [];
      userCoupons.push(newCoupon);

      await updateDoc(doc(db, 'users', selectedUser.id), {
        coupons: userCoupons,
      });

      await fetchUsers();
      setShowCouponModal(false);
      setCouponData({ code: '', discount: 0, expiryDate: '' });
      setSelectedUser(null);
      alert('Kupon başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Kupon oluşturulurken hata oluştu');
    }
  };

  const createBulkCoupon = async () => {
    if (!couponData.code || !couponData.discount) {
      alert('Lütfen kupon kodu ve indirim oranı girin');
      return;
    }

    if (!confirm(`Tüm kullanıcılara (${users.length} kişi) kupon oluşturmak istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      for (const user of users) {
        const newCoupon: UserCoupon = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          code: couponData.code,
          discount: couponData.discount,
          discountType: 'percentage',
          expiryDate: couponData.expiryDate,
          isUsed: false,
          description: `${couponData.discount}% indirim kuponu`,
        };

        const userCoupons = user.coupons || [];
        userCoupons.push(newCoupon);
        await updateDoc(doc(db, 'users', user.id), {
          coupons: userCoupons,
        });
      }

      await fetchUsers();
      setShowCouponModal(false);
      setCouponData({ code: '', discount: 0, expiryDate: '' });
      alert(`${users.length} kullanıcıya kupon başarıyla oluşturuldu!`);
    } catch (error) {
      console.error('Error creating bulk coupons:', error);
      alert('Toplu kupon oluşturulurken hata oluştu');
    }
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
          <h1 className="text-4xl font-bold text-white mb-2">Kullanıcı Yönetimi</h1>
          <p className="text-gray-400">Kayıtlı kullanıcıları görüntüleyin ve kupon oluşturun</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Toplam Kullanıcı</p>
            <p className="text-white text-3xl font-bold">{users.length}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Admin Kullanıcı</p>
            <p className="text-white text-3xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Aktif Kuponlar</p>
            <p className="text-white text-3xl font-bold">
              {users.reduce((sum, u) => sum + (u.coupons?.filter(c => !c.isUsed).length || 0), 0)}
            </p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Toplam Favori</p>
            <p className="text-white text-3xl font-bold">
              {users.reduce((sum, u) => sum + (u.favorites?.length || 0), 0)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kullanıcı ara (email, isim)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10"
              />
            </div>

            <button
              onClick={() => {
                setSelectedUser(null);
                setShowCouponModal(true);
              }}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Gift size={20} />
              Toplu Kupon Oluştur
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white border-opacity-10">
                  <th className="text-left text-white font-semibold p-4">Kullanıcı</th>
                  <th className="text-left text-white font-semibold p-4">İletişim</th>
                  <th className="text-left text-white font-semibold p-4">Rol</th>
                  <th className="text-left text-white font-semibold p-4">Kuponlar</th>
                  <th className="text-left text-white font-semibold p-4">Kayıt Tarihi</th>
                  <th className="text-left text-white font-semibold p-4">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-mea-gold bg-opacity-20 flex items-center justify-center">
                          <span className="text-mea-gold font-bold">
                            {(user.firstName && user.firstName[0]) || (user.email && user.email[0]?.toUpperCase()) || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Mail size={14} />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Phone size={14} />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-red-500 bg-opacity-20 text-red-500'
                            : 'bg-blue-500 bg-opacity-20 text-blue-500'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <span className="flex items-center gap-1">
                            <Shield size={12} />
                            Admin
                          </span>
                        ) : (
                          'Kullanıcı'
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-gray-400 text-sm">
                        <p>Aktif: {user.coupons?.filter(c => !c.isUsed).length || 0}</p>
                        <p>Toplam: {user.coupons?.length || 0}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar size={14} />
                        <span>
                          {user.createdAt && new Date(user.createdAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowCouponModal(true);
                        }}
                        className="btn-secondary text-sm"
                      >
                        Kupon Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-20">
              <Users className="mx-auto mb-6 text-gray-400" size={80} />
              <h2 className="text-2xl font-bold text-white mb-4">
                Kullanıcı Bulunamadı
              </h2>
              <p className="text-gray-400">
                {searchTerm ? 'Arama kriterlerinize uygun kullanıcı bulunamadı' : 'Henüz kayıtlı kullanıcı yok'}
              </p>
            </div>
          )}
        </div>

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedUser ? `${selectedUser.firstName} için Kupon Oluştur` : 'Toplu Kupon Oluştur'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Kupon Kodu
                  </label>
                  <input
                    type="text"
                    value={couponData.code}
                    onChange={(e) =>
                      setCouponData({ ...couponData, code: e.target.value.toUpperCase() })
                    }
                    className="admin-input"
                    placeholder="MEAVIP20"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    İndirim Oranı (%)
                  </label>
                  <input
                    type="number"
                    value={couponData.discount}
                    onChange={(e) =>
                      setCouponData({ ...couponData, discount: Number(e.target.value) })
                    }
                    className="admin-input"
                    min="0"
                    max="100"
                    placeholder="20"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Son Kullanma Tarihi
                  </label>
                  <input
                    type="date"
                    value={couponData.expiryDate}
                    onChange={(e) =>
                      setCouponData({ ...couponData, expiryDate: e.target.value })
                    }
                    className="admin-input"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  {selectedUser ? (
                    <button
                      onClick={createCoupon}
                      className="flex-1 btn-primary"
                    >
                      Oluştur
                    </button>
                  ) : (
                    <button
                      onClick={createBulkCoupon}
                      className="flex-1 btn-primary"
                    >
                      Tüm Kullanıcılara Oluştur
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowCouponModal(false);
                      setSelectedUser(null);
                      setCouponData({ code: '', discount: 0, expiryDate: '' });
                    }}
                    className="flex-1 btn-secondary"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}