'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Plus, Trash2, Edit, Copy, Check, X, Users, User, Truck } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Coupon } from '@/types';
import AdminBackButton from '@/components/AdminBackButton';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    expiresAt: '',
    usageLimit: 0,
    userSpecific: '',
    freeShipping: false,
    active: true,
  });

  useEffect(() => {
    fetchCoupons();
    fetchUsers();
  }, []);

  const fetchCoupons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'coupons'));
      const couponsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate(),
      })) as Coupon[];
      setCoupons(couponsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const couponData: any = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: Number(formData.value),
        active: formData.active,
        usedCount: editingCoupon?.usedCount || 0,
        createdAt: editingCoupon?.createdAt || new Date(),
      };

      // Only add optional fields if they have values
      if (formData.minPurchase > 0) {
        couponData.minPurchase = Number(formData.minPurchase);
      }
      if (formData.maxDiscount > 0) {
        couponData.maxDiscount = Number(formData.maxDiscount);
      }
      if (formData.expiresAt) {
        couponData.expiresAt = new Date(formData.expiresAt);
      }
      if (formData.userSpecific) {
        couponData.userSpecific = formData.userSpecific;
      } else if (formData.usageLimit > 0) {
        // Only add usageLimit if it's not user-specific
        couponData.usageLimit = Number(formData.usageLimit);
      }
      if (formData.freeShipping) {
        couponData.freeShipping = true;
      }

      if (editingCoupon) {
        await updateDoc(doc(db, 'coupons', editingCoupon.id), couponData);
        alert('Kupon güncellendi!');
      } else {
        await addDoc(collection(db, 'coupons'), couponData);
        alert('Kupon oluşturuldu!');
      }

      await fetchCoupons();
      closeModal();
    } catch (error) {
      console.error('Error saving coupon:', error);
      alert('Kupon kaydedilirken hata oluştu');
    }
  };

  const deleteCoupon = async (id: string) => {
    if (!confirm('Bu kuponu silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'coupons', id));
      await fetchCoupons();
      alert('Kupon silindi!');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Kupon silinirken hata oluştu');
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      await updateDoc(doc(db, 'coupons', coupon.id), {
        active: !coupon.active,
      });
      await fetchCoupons();
    } catch (error) {
      console.error('Error toggling coupon:', error);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minPurchase: coupon.minPurchase || 0,
        maxDiscount: coupon.maxDiscount || 0,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
        usageLimit: coupon.usageLimit || 0,
        userSpecific: coupon.userSpecific || '',
        freeShipping: coupon.freeShipping || false,
        active: coupon.active,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        minPurchase: 0,
        maxDiscount: 0,
        expiresAt: '',
        usageLimit: 0,
        userSpecific: '',
        freeShipping: false,
        active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-black dark:text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const stats = {
    total: coupons.length,
    active: coupons.filter(c => c.active).length,
    singleUser: coupons.filter(c => c.userSpecific).length,
    multiUser: coupons.filter(c => !c.userSpecific && c.usageLimit).length,
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminBackButton />

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Kupon Kodları Yönetimi</h1>
            <p className="text-black dark:text-white">Kişiye özel ve genel kullanım kuponları oluşturun</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Kupon
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <p className="text-black dark:text-white text-sm mb-1">Toplam Kupon</p>
            <p className="text-black dark:text-white text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-black dark:text-white text-sm mb-1">Aktif Kupon</p>
            <p className="text-black dark:text-white text-3xl font-bold">{stats.active}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-black dark:text-white text-sm mb-1">Kişiye Özel</p>
            <p className="text-black dark:text-white text-3xl font-bold">{stats.singleUser}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-black dark:text-white text-sm mb-1">Çok Kullanımlı</p>
            <p className="text-black dark:text-white text-3xl font-bold">{stats.multiUser}</p>
          </div>
        </div>

        {/* Coupons List */}
        <div className="space-y-4">
          {coupons.map((coupon, index) => {
            const user = users.find(u => u.id === coupon.userSpecific);
            const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            const isLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

            return (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass rounded-2xl p-6 ${!coupon.active || isExpired || isLimitReached ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Ticket className="text-mea-gold" size={24} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-black dark:text-white">{coupon.code}</h3>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-black dark:text-white hover:text-black dark:text-white transition-colors"
                            title="Kodu Kopyala"
                          >
                            {copiedCode === coupon.code ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                          {coupon.userSpecific && (
                            <span className="px-2 py-1 bg-purple-500 bg-opacity-20 text-purple-400 text-xs rounded-full flex items-center gap-1">
                              <User size={12} />
                              Kişiye Özel
                            </span>
                          )}
                          {!coupon.userSpecific && coupon.usageLimit && (
                            <span className="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded-full flex items-center gap-1">
                              <Users size={12} />
                              Çok Kullanımlı
                            </span>
                          )}
                          {coupon.freeShipping && (
                            <span className="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded-full flex items-center gap-1">
                              <Truck size={12} />
                              Ücretsiz Kargo
                            </span>
                          )}
                        </div>
                        {user && (
                          <p className="text-sm text-black dark:text-white mt-1">
                            {user.firstName} {user.lastName} ({user.email})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-black dark:text-white">İndirim</p>
                        <p className="text-black dark:text-white font-semibold">
                          {coupon.type === 'percentage' ? `%${coupon.value}` : `₺${coupon.value}`}
                        </p>
                      </div>
                      {coupon.minPurchase && (
                        <div>
                          <p className="text-black dark:text-white">Min. Tutar</p>
                          <p className="text-black dark:text-white font-semibold">₺{coupon.minPurchase}</p>
                        </div>
                      )}
                      {coupon.maxDiscount && (
                        <div>
                          <p className="text-black dark:text-white">Max. İndirim</p>
                          <p className="text-black dark:text-white font-semibold">₺{coupon.maxDiscount}</p>
                        </div>
                      )}
                      {coupon.expiresAt && (
                        <div>
                          <p className="text-black dark:text-white">Son Kullanma</p>
                          <p className={`font-semibold ${isExpired ? 'text-red-500' : 'text-black dark:text-white'}`}>
                            {new Date(coupon.expiresAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      )}
                      {coupon.usageLimit && (
                        <div>
                          <p className="text-black dark:text-white">Kullanım</p>
                          <p className={`font-semibold ${isLimitReached ? 'text-red-500' : 'text-black dark:text-white'}`}>
                            {coupon.usedCount} / {coupon.usageLimit}
                          </p>
                        </div>
                      )}
                    </div>

                    {(isExpired || isLimitReached || !coupon.active) && (
                      <div className="mt-3 flex gap-2">
                        {isExpired && (
                          <span className="px-3 py-1 bg-red-500 bg-opacity-20 text-red-400 text-xs rounded-full">
                            Süresi Dolmuş
                          </span>
                        )}
                        {isLimitReached && (
                          <span className="px-3 py-1 bg-orange-500 bg-opacity-20 text-orange-400 text-xs rounded-full">
                            Kullanım Limiti Doldu
                          </span>
                        )}
                        {!coupon.active && (
                          <span className="px-3 py-1 bg-gray-500 bg-opacity-20 text-black dark:text-white text-xs rounded-full">
                            Pasif
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(coupon)}
                      className={`p-2 rounded-lg transition-colors ${
                        coupon.active
                          ? 'bg-green-500 bg-opacity-20 text-green-400 hover:bg-opacity-30'
                          : 'bg-gray-500 bg-opacity-20 text-black dark:text-white hover:bg-opacity-30'
                      }`}
                      title={coupon.active ? 'Pasif Yap' : 'Aktif Yap'}
                    >
                      {coupon.active ? <Check size={20} /> : <X size={20} />}
                    </button>
                    <button
                      onClick={() => openModal(coupon)}
                      className="p-2 bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg hover:bg-opacity-30 transition-colors"
                      title="Düzenle"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="p-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {coupons.length === 0 && (
          <div className="text-center py-20">
            <Ticket className="mx-auto mb-6 text-black dark:text-white" size={80} />
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Henüz Kupon Yok</h2>
            <p className="text-black dark:text-white mb-6">
              İlk kuponunuzu oluşturarak başlayın
            </p>
            <button
              onClick={() => openModal()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Yeni Kupon Oluştur
            </button>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingCoupon ? 'Kuponu Düzenle' : 'Yeni Kupon Oluştur'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">Kupon Kodu</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                      placeholder="ÖRNEK2024"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateRandomCode}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Rastgele
                    </button>
                  </div>
                </div>

                {/* Discount Type and Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">İndirim Tipi</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                    >
                      <option value="percentage">Yüzde (%)</option>
                      <option value="fixed">Sabit Tutar (₺)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      {formData.type === 'percentage' ? 'İndirim Yüzdesi' : 'İndirim Tutarı'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                      placeholder={formData.type === 'percentage' ? '20' : '100'}
                      min="0"
                      max={formData.type === 'percentage' ? 100 : undefined}
                      required
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Min. Sipariş Tutarı (₺) <span className="text-gray-500 font-normal">(opsiyonel)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Max. İndirim Tutarı (₺) <span className="text-gray-500 font-normal">(opsiyonel)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Son Kullanma Tarihi <span className="text-gray-500 font-normal">(opsiyonel)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                  />
                </div>

                {/* Usage Limit */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Kullanım Limiti <span className="text-gray-500 font-normal">(0 = sınırsız)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* User Specific */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Kullanıcı Seçimi
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    Kuponu belirli bir kullanıcıya özel yapmak isterseniz aşağıdan seçim yapın. Boş bırakırsanız tüm müşteriler kullanabilir.
                  </p>
                  <select
                    value={formData.userSpecific}
                    onChange={(e) => setFormData({ ...formData, userSpecific: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                  >
                    <option value="">Herkese Açık (Tüm Müşteriler Kullanabilir)</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        Kişiye Özel: {user.firstName} {user.lastName} - {user.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Free Shipping Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="freeShipping"
                    checked={formData.freeShipping}
                    onChange={(e) => setFormData({ ...formData, freeShipping: e.target.checked })}
                    className="w-5 h-5 text-mea-gold focus:ring-mea-gold rounded"
                  />
                  <label htmlFor="freeShipping" className="text-gray-900">
                    <span className="font-medium">Ücretsiz Kargo</span>
                    <p className="text-sm text-gray-600">Bu kupon kargo ücretini sıfırlar</p>
                  </label>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-5 h-5 text-mea-gold focus:ring-mea-gold rounded"
                  />
                  <label htmlFor="active" className="text-gray-900 font-medium">
                    Kupon Aktif
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-mea-gold text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    {editingCoupon ? 'Güncelle' : 'Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
