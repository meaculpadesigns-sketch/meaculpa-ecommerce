'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById, getProducts, addProduct, updateProduct, deleteProduct, uploadFile, deleteFile } from '@/lib/firebase-helpers';
import { Product, Size } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  EyeOff,
  Eye,
  Upload,
  X,
  Save,
} from 'lucide-react';

export default function AdminProducts() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    price: 0,
    oldPrice: 0,
    category: 'kimono' as 'kimono' | 'shirt' | 'set',
    images: [] as string[],
    fabricImage: '',
    description: '',
    descriptionEn: '',
    story: '',
    storyEn: '',
    sizes: [] as Size[],
    inStock: true,
    featured: false,
    estimatedDelivery: '',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserById(user.uid);
        if (userData && userData.role === 'admin') {
          loadProducts();
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleImageUpload = async (files: FileList | null, type: 'product' | 'fabric') => {
    if (!files) return;

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const path = `products/${Date.now()}_${file.name}`;
        const url = await uploadFile(file, path);
        return url;
      });

      const urls = await Promise.all(uploadPromises);

      if (type === 'product') {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...urls],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          fabricImage: urls[0],
        }));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Görsel yüklenirken hata oluştu');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      await loadProducts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ürün kaydedilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn,
      price: product.price,
      oldPrice: product.oldPrice || 0,
      category: product.category,
      images: product.images,
      fabricImage: product.fabricImage || '',
      description: product.description,
      descriptionEn: product.descriptionEn,
      story: product.story || '',
      storyEn: product.storyEn || '',
      sizes: product.sizes,
      inStock: product.inStock,
      featured: product.featured,
      estimatedDelivery: product.estimatedDelivery || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken hata oluştu');
    }
  };

  const toggleVisibility = async (product: Product) => {
    try {
      await updateProduct(product.id, { inStock: !product.inStock });
      await loadProducts();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      nameEn: '',
      price: 0,
      oldPrice: 0,
      category: 'kimono',
      images: [],
      fabricImage: '',
      description: '',
      descriptionEn: '',
      story: '',
      storyEn: '',
      sizes: [],
      inStock: true,
      featured: false,
      estimatedDelivery: '',
    });
  };

  const addSize = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', inStock: true, preOrder: false }],
    }));
  };

  const updateSize = (index: number, field: keyof Size, value: any) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.map((size, i) =>
        i === index ? { ...size, [field]: value } : size
      ),
    }));
  };

  const removeSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Ürün Yönetimi</h1>
            <p className="text-gray-400">{products.length} ürün bulundu</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Ürün Ekle
          </button>
        </div>

        {/* Products Table */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white bg-opacity-5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Görsel
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Ürün Adı
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Fiyat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white divide-opacity-10">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white hover:bg-opacity-5">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg" />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-gray-400 text-sm">{product.nameEn}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">₺{product.price}</p>
                      {product.oldPrice && (
                        <p className="text-gray-500 text-sm line-through">
                          ₺{product.oldPrice}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          product.inStock
                            ? 'bg-green-500 bg-opacity-20 text-green-500'
                            : 'bg-red-500 bg-opacity-20 text-red-500'
                        }`}
                      >
                        {product.inStock ? 'Aktif' : 'Gizli'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(product)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                          title={product.inStock ? 'Gizle' : 'Göster'}
                        >
                          {product.inStock ? (
                            <EyeOff size={18} className="text-gray-400" />
                          ) : (
                            <Eye size={18} className="text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={18} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <Trash2 size={18} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="glass rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-white" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Images */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Ürün Görselleri
                    </label>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative w-32 h-32">
                          <div className="w-full h-full bg-zinc-800 rounded-lg" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== index),
                              }));
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                          >
                            <X size={16} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <label className="btn-secondary cursor-pointer inline-block">
                      <Upload size={20} className="inline mr-2" />
                      {uploadingImages ? 'Yükleniyor...' : 'Görsel Yükle'}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files, 'product')}
                        disabled={uploadingImages}
                      />
                    </label>
                  </div>

                  {/* Fabric Image */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Kumaş Görseli
                    </label>
                    {formData.fabricImage && (
                      <div className="relative w-32 h-32 mb-4">
                        <div className="w-full h-full bg-zinc-800 rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, fabricImage: '' }))}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full"
                        >
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    )}
                    <label className="btn-secondary cursor-pointer inline-block">
                      <Upload size={20} className="inline mr-2" />
                      {uploadingImages ? 'Yükleniyor...' : 'Kumaş Görseli Yükle'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files, 'fabric')}
                        disabled={uploadingImages}
                      />
                    </label>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Ürün Adı (Türkçe)
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Ürün Adı (İngilizce)
                      </label>
                      <input
                        type="text"
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  {/* Category, Price, Old Price */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="input-field"
                      >
                        <option value="kimono">Kimono</option>
                        <option value="shirt">Gömlek</option>
                        <option value="set">Set</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Fiyat (₺)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Eski Fiyat (₺) - İndirim için
                      </label>
                      <input
                        type="number"
                        value={formData.oldPrice}
                        onChange={(e) => setFormData({ ...formData, oldPrice: parseFloat(e.target.value) })}
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Açıklama (Türkçe)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input-field"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Açıklama (İngilizce)
                      </label>
                      <textarea
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                        className="input-field"
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  {/* Story */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Hikaye (Türkçe) - Opsiyonel
                      </label>
                      <textarea
                        value={formData.story}
                        onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Hikaye (İngilizce) - Opsiyonel
                      </label>
                      <textarea
                        value={formData.storyEn}
                        onChange={(e) => setFormData({ ...formData, storyEn: e.target.value })}
                        className="input-field"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-white font-medium">Bedenler</label>
                      <button
                        type="button"
                        onClick={addSize}
                        className="btn-secondary text-sm"
                      >
                        <Plus size={16} className="inline mr-1" />
                        Beden Ekle
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.sizes.map((size, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <input
                            type="text"
                            value={size.size}
                            onChange={(e) => updateSize(index, 'size', e.target.value)}
                            placeholder="Beden (S, M, L, vb.)"
                            className="input-field flex-1"
                          />
                          <label className="flex items-center gap-2 text-white">
                            <input
                              type="checkbox"
                              checked={size.inStock}
                              onChange={(e) => updateSize(index, 'inStock', e.target.checked)}
                            />
                            Stokta
                          </label>
                          <label className="flex items-center gap-2 text-white">
                            <input
                              type="checkbox"
                              checked={size.preOrder}
                              onChange={(e) => updateSize(index, 'preOrder', e.target.checked)}
                            />
                            Ön Sipariş
                          </label>
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-lg"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      Öne Çıkan Ürün
                    </label>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Tahmini Teslimat Süresi
                      </label>
                      <input
                        type="text"
                        value={formData.estimatedDelivery}
                        onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                        placeholder="Örn: 3-5 gün"
                        className="input-field"
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end gap-4 pt-4 border-t border-white border-opacity-10">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn-secondary"
                    >
                      İptal
                    </button>
                    <button type="submit" className="btn-primary flex items-center gap-2">
                      <Save size={20} />
                      {editingProduct ? 'Güncelle' : 'Kaydet'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
