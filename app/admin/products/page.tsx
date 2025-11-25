'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadFile, deleteFile } from '@/lib/firebase-helpers';
import { useAdminAuth } from '@/lib/use-admin-auth';
import { Product, Size, Creation } from '@/types';
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
  Search,
} from 'lucide-react';
import { kimonoSubcategories, setSecondLevelCategories, getThirdLevelCategories } from '@/constants/categories';
import { convertCurrency } from '@/lib/currency';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminProducts() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [creations, setCreations] = useState<Creation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    price: 0,
    priceUSD: 0,
    priceEUR: 0,
    oldPrice: 0,
    category: 'kimono' as 'kimono' | 'set',
    subcategory: '' as Product['subcategory'],
    thirdLevelCategory: '' as Product['thirdLevelCategory'],
    collection: '',
    images: [] as string[],
    fabricImages: [] as string[],
    description: '',
    descriptionEn: '',
    story: '',
    storyEn: '',
    sizes: [] as Size[],
    inStock: true,
    featured: false,
    estimatedDelivery: '',
    seoTitle: '',
    seoTitleEn: '',
    seoDescription: '',
    seoDescriptionEn: '',
  });

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      loadProducts();
      loadCreations();
    }
  }, [authLoading, isAdmin]);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setFilteredProducts(data);
  };

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.nameEn.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(query)) ||
        (product.thirdLevelCategory && product.thirdLevelCategory.toLowerCase().includes(query))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const loadCreations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'creations'));
      const creationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Creation[];
      setCreations(creationsData);
    } catch (error) {
      console.error('Error fetching creations:', error);
    }
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
          fabricImages: [...prev.fabricImages, ...urls],
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
    setSaving(true);

    try {
      // Remove undefined and empty string values from formData
      const cleanedFormData: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          cleanedFormData[key] = value;
        }
      });

      if (editingProduct) {
        // When editing, don't include createdAt
        await updateProduct(editingProduct.id, cleanedFormData);
      } else {
        // When creating new, include createdAt and updatedAt
        const productData = {
          ...cleanedFormData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await addProduct(productData);
      }

      await loadProducts();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ürün kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameEn: product.nameEn,
      price: product.price,
      priceUSD: product.priceUSD || 0,
      priceEUR: product.priceEUR || 0,
      oldPrice: product.oldPrice || 0,
      category: product.category,
      subcategory: product.subcategory || undefined,
      thirdLevelCategory: product.thirdLevelCategory || undefined,
      collection: product.collection || '',
      images: product.images,
      fabricImages: product.fabricImages || [],
      description: product.description,
      descriptionEn: product.descriptionEn,
      story: product.story || '',
      storyEn: product.storyEn || '',
      sizes: product.sizes,
      inStock: product.inStock,
      featured: product.featured,
      estimatedDelivery: product.estimatedDelivery || '',
      seoTitle: product.seoTitle || '',
      seoTitleEn: product.seoTitleEn || '',
      seoDescription: product.seoDescription || '',
      seoDescriptionEn: product.seoDescriptionEn || '',
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
      priceUSD: 0,
      priceEUR: 0,
      oldPrice: 0,
      category: 'kimono',
      subcategory: undefined,
      thirdLevelCategory: undefined,
      collection: '',
      images: [],
      fabricImages: [],
      description: '',
      descriptionEn: '',
      story: '',
      storyEn: '',
      sizes: [],
      inStock: true,
      featured: false,
      estimatedDelivery: '',
      seoTitle: '',
      seoTitleEn: '',
      seoDescription: '',
      seoDescriptionEn: '',
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Ürün Yönetimi</h1>
              <p className="text-gray-400">
                {filteredProducts.length} / {products.length} ürün gösteriliyor
              </p>
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Ürün ara (isim, kategori, alt kategori...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mea-gold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
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
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white hover:bg-opacity-5">
                    <td className="px-6 py-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 bg-zinc-800 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-zinc-800 rounded-lg" />
                      )}
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
                        {product.inStock ? 'Stokta' : 'Tükendi'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleVisibility(product)}
                          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                          title={product.inStock ? 'Tükendi İşaretle' : 'Stokta İşaretle'}
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
                className="bg-white rounded-2xl p-4 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} className="text-gray-700" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Product Images */}
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Ürün Görselleri
                    </label>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative w-32 h-32">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-full bg-zinc-800 rounded-lg object-cover"
                          />
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

                  {/* Fabric Images */}
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Kumaş Görselleri
                    </label>
                    <div className="flex flex-wrap gap-4 mb-4">
                      {formData.fabricImages.map((url, index) => (
                        <div key={index} className="relative w-32 h-32">
                          <img
                            src={url}
                            alt={`Fabric ${index + 1}`}
                            className="w-full h-full bg-zinc-800 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                fabricImages: prev.fabricImages.filter((_, i) => i !== index),
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
                      {uploadingImages ? 'Yükleniyor...' : 'Kumaş Görseli Yükle'}
                      <input
                        type="file"
                        multiple
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
                      <label className="block text-gray-900 font-medium mb-2">
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
                      <label className="block text-gray-900 font-medium mb-2">
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

                  {/* Category, Subcategory, and Third Level */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">1. Kategori</label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const newCategory = e.target.value as 'kimono' | 'set';
                          setFormData({ ...formData, category: newCategory, subcategory: undefined, thirdLevelCategory: undefined });
                        }}
                        className="input-field"
                        required
                      >
                        <option value="kimono">Kimono</option>
                        <option value="set">Setler</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">2. Alt Kategori</label>
                      <select
                        value={formData.subcategory || ''}
                        onChange={(e) => {
                          setFormData({ ...formData, subcategory: e.target.value as any, thirdLevelCategory: undefined });
                        }}
                        className="input-field"
                      >
                        <option value="">Seçiniz</option>
                        {(formData.category === 'kimono' ? kimonoSubcategories : setSecondLevelCategories).map((sub) => (
                          <option key={sub.key} value={sub.key}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formData.category === 'set' && (formData.subcategory === 'kreasyonlar' || formData.subcategory === 'setler') && (
                      <div>
                        <label className="block text-gray-900 font-medium mb-2">3. Alt Kategori</label>
                        <select
                          value={formData.thirdLevelCategory || ''}
                          onChange={(e) => setFormData({ ...formData, thirdLevelCategory: e.target.value as any })}
                          className="input-field"
                        >
                          <option value="">Seçiniz</option>
                          {getThirdLevelCategories(formData.subcategory as 'kreasyonlar' | 'setler').map((third) => (
                            <option key={third.key} value={third.key}>
                              {third.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Creation Selection */}
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Kreasyon (Opsiyonel)
                    </label>
                    <select
                      value={formData.collection || ''}
                      onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Seçiniz</option>
                      {creations.map((creation) => (
                        <option key={creation.id} value={creation.id}>
                          {creation.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-400 mt-1">
                      Ürünü bir kreasyona dahil etmek için seçim yapın
                    </p>
                  </div>

                  {/* Prices: TRY, USD, EUR */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">Fiyat (₺)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => {
                          const tryPrice = parseFloat(e.target.value);
                          setFormData({
                            ...formData,
                            price: tryPrice,
                            priceUSD: convertCurrency(tryPrice, 'USD'),
                            priceEUR: convertCurrency(tryPrice, 'EUR'),
                          });
                        }}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">Fiyat ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.priceUSD}
                        onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) })}
                        className="input-field bg-gray-700"
                        placeholder="Otomatik"
                      />
                      <p className="text-xs text-gray-400 mt-1">TL fiyat girilince otomatik hesaplanır</p>
                    </div>
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">Fiyat (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.priceEUR}
                        onChange={(e) => setFormData({ ...formData, priceEUR: parseFloat(e.target.value) })}
                        className="input-field bg-gray-700"
                        placeholder="Otomatik"
                      />
                      <p className="text-xs text-gray-400 mt-1">TL fiyat girilince otomatik hesaplanır</p>
                    </div>
                  </div>

                  {/* Old Price for Discount */}
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Eski Fiyat (₺) - İndirim göstermek için
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: parseFloat(e.target.value) })}
                      className="input-field"
                      placeholder="Opsiyonel"
                    />
                  </div>

                  {/* Description */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">
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
                      <label className="block text-gray-900 font-medium mb-2">
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
                      <label className="block text-gray-900 font-medium mb-2">
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
                      <label className="block text-gray-900 font-medium mb-2">
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
                      <label className="block text-gray-900 font-medium">Bedenler</label>
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
                          <label className="flex items-center gap-2 text-gray-900">
                            <input
                              type="checkbox"
                              checked={size.inStock}
                              onChange={(e) => updateSize(index, 'inStock', e.target.checked)}
                            />
                            Stokta
                          </label>
                          <label className="flex items-center gap-2 text-gray-900">
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
                    <label className="flex items-center gap-2 text-gray-900">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      />
                      Öne Çıkan Ürün
                    </label>
                    <div>
                      <label className="block text-gray-900 font-medium mb-2">
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
