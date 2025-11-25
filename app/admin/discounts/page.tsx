'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Percent, Package, Save, X } from 'lucide-react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

export default function AdminDiscountsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const applyDiscount = async () => {
    if (!editingProduct) return;

    try {
      let newPrice = editingProduct.price;
      const oldPrice = editingProduct.oldPrice || editingProduct.price;

      if (discountType === 'percentage') {
        newPrice = oldPrice * (1 - discountValue / 100);
      } else {
        newPrice = discountValue;
      }

      await updateDoc(doc(db, 'products', editingProduct.id), {
        price: Math.round(newPrice * 100) / 100,
        oldPrice: oldPrice,
        discountPercentage: discountType === 'percentage' ? discountValue : Math.round(((oldPrice - newPrice) / oldPrice) * 100),
      });

      await fetchProducts();
      closeModal();
      alert('İndirim uygulandı!');
    } catch (error) {
      console.error('Error applying discount:', error);
      alert('İndirim uygulanırken hata oluştu');
    }
  };

  const removeDiscount = async (productId: string) => {
    if (!confirm('İndirimi kaldırmak istediğinizden emin misiniz?')) return;

    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      await updateDoc(doc(db, 'products', productId), {
        price: product.oldPrice || product.price,
        oldPrice: null,
        discountPercentage: 0,
      });

      await fetchProducts();
      alert('İndirim kaldırıldı!');
    } catch (error) {
      console.error('Error removing discount:', error);
      alert('İndirim kaldırılırken hata oluştu');
    }
  };

  const applyBulkDiscount = async () => {
    if (!confirm(`${filteredProducts.length} ürüne toplu indirim uygulamak istediğinizden emin misiniz?`)) return;

    try {
      for (const product of filteredProducts) {
        let newPrice = product.price;
        const oldPrice = product.oldPrice || product.price;

        if (discountType === 'percentage') {
          newPrice = oldPrice * (1 - discountValue / 100);
        } else {
          newPrice = discountValue;
        }

        await updateDoc(doc(db, 'products', product.id), {
          price: Math.round(newPrice * 100) / 100,
          oldPrice: oldPrice,
          discountPercentage: discountType === 'percentage' ? discountValue : Math.round(((oldPrice - newPrice) / oldPrice) * 100),
        });
      }

      await fetchProducts();
      alert(`${filteredProducts.length} ürüne indirim uygulandı!`);
    } catch (error) {
      console.error('Error applying bulk discount:', error);
      alert('Toplu indirim uygulanırken hata oluştu');
    }
  };

  const openModal = (product: Product) => {
    setEditingProduct(product);
    setDiscountType('percentage');
    setDiscountValue(0);
  };

  const closeModal = () => {
    setEditingProduct(null);
    setDiscountValue(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const stats = {
    total: products.length,
    onDiscount: products.filter(p => p.oldPrice && p.oldPrice > p.price).length,
    avgDiscount: products.filter(p => p.oldPrice && p.oldPrice > p.price).length > 0
      ? Math.round(products.filter(p => p.oldPrice && p.oldPrice > p.price).reduce((sum, p) => sum + ((p.oldPrice! - p.price) / p.oldPrice! * 100), 0) / products.filter(p => p.oldPrice && p.oldPrice > p.price).length)
      : 0,
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">İndirim Yönetimi</h1>
          <p className="text-gray-400">Ürünlere indirim uygulayın veya kaldırın</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Toplam Ürün</p>
            <p className="text-white text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">İndirimli Ürün</p>
            <p className="text-white text-3xl font-bold">{stats.onDiscount}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Ortalama İndirim</p>
            <p className="text-white text-3xl font-bold">%{stats.avgDiscount}</p>
          </div>
        </div>

        {/* Filters and Bulk Actions */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input"
            />
            <button
              onClick={applyBulkDiscount}
              className="btn-primary flex items-center justify-center gap-2"
              disabled={filteredProducts.length === 0}
            >
              <Percent size={20} />
              Toplu İndirim Uygula ({filteredProducts.length} ürün)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
              className="admin-input"
            >
              <option value="percentage">Yüzdesel İndirim</option>
              <option value="fixed">Sabit Fiyat</option>
            </select>

            <input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              placeholder={discountType === 'percentage' ? 'İndirim % (örn: 20)' : 'Yeni fiyat (örn: 999)'}
              className="admin-input"
              min="0"
              max={discountType === 'percentage' ? 100 : undefined}
            />

            <div className="text-gray-400 text-sm flex items-center">
              {discountType === 'percentage'
                ? `%${discountValue} indirim uygulanacak`
                : `₺${discountValue} olarak ayarlanacak`}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => {
            const hasDiscount = product.oldPrice && product.oldPrice > product.price;
            const discountPercentage = hasDiscount
              ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
              : 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <div className="aspect-square bg-zinc-800 flex items-center justify-center relative">
                  <Package className="text-gray-600" size={60} />
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                      %{discountPercentage}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 truncate">
                    {product.name}
                  </h3>

                  <div className="mb-4">
                    {hasDiscount ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-mea-gold">
                            ₺{product.price}
                          </span>
                          <span className="text-gray-500 line-through">
                            ₺{product.oldPrice}
                          </span>
                        </div>
                        <p className="text-red-500 text-sm mt-1">
                          %{discountPercentage} indirimli
                        </p>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        ₺{product.price}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(product)}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      İndirim Uygula
                    </button>
                    {hasDiscount && (
                      <button
                        onClick={() => removeDiscount(product.id)}
                        className="px-3 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
                        title="İndirimi Kaldır"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">
              Ürün Bulunamadı
            </h2>
            <p className="text-gray-400">
              {searchTerm ? 'Arama kriterlerinize uygun ürün bulunamadı' : 'Henüz ürün eklenmemiş'}
            </p>
          </div>
        )}

        {/* Discount Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingProduct.name} - İndirim Uygula
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Mevcut Fiyat</p>
                  <p className="text-white text-3xl font-bold">
                    ₺{editingProduct.oldPrice || editingProduct.price}
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    İndirim Tipi
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="admin-input"
                  >
                    <option value="percentage">Yüzdesel İndirim</option>
                    <option value="fixed">Sabit Fiyat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    {discountType === 'percentage' ? 'İndirim Yüzdesi (%)' : 'Yeni Fiyat (₺)'}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="admin-input"
                    placeholder={discountType === 'percentage' ? '20' : '999'}
                    min="0"
                    max={discountType === 'percentage' ? 100 : undefined}
                  />
                </div>

                {discountValue > 0 && (
                  <div className="glass rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-2">Yeni Fiyat</p>
                    <p className="text-mea-gold text-2xl font-bold">
                      ₺{discountType === 'percentage'
                        ? Math.round((editingProduct.oldPrice || editingProduct.price) * (1 - discountValue / 100) * 100) / 100
                        : discountValue}
                    </p>
                    {discountType === 'percentage' && (
                      <p className="text-gray-400 text-sm mt-1">
                        %{discountValue} indirim
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={applyDiscount}
                    disabled={discountValue === 0}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Uygula
                  </button>
                  <button
                    onClick={closeModal}
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