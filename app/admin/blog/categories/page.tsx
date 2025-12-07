'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import {
  getAllBlogCategories,
  addBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  generateSlug,
} from '@/lib/blog-helpers';
import { BlogCategory } from '@/types';
import AdminBackButton from '@/components/AdminBackButton';

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    descriptionEn: '',
    icon: '',
    color: '#a37830',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllBlogCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = formData.slug || generateSlug(formData.name);

      if (editingCategory) {
        await updateBlogCategory(editingCategory.id, { ...formData, slug });
      } else {
        await addBlogCategory({ ...formData, slug } as Omit<BlogCategory, 'id'>);
      }

      await fetchCategories();
      closeModal();
      alert(editingCategory ? 'Kategori güncellendi!' : 'Kategori eklendi!');
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) return;

    try {
      await deleteBlogCategory(id);
      await fetchCategories();
      alert('Kategori silindi!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const openModal = (category?: BlogCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        nameEn: category.nameEn,
        slug: category.slug,
        description: category.description,
        descriptionEn: category.descriptionEn,
        icon: category.icon || '',
        color: category.color || '#a37830',
        order: category.order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        nameEn: '',
        slug: '',
        description: '',
        descriptionEn: '',
        icon: '',
        color: '#a37830',
        order: categories.length,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <AdminBackButton />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Blog Kategorileri</h1>
            <p className="text-gray-400">Blog kategorilerini yönetin</p>
          </div>
          <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Yeni Kategori
          </button>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-white border-opacity-10">
              <tr>
                <th className="text-left p-4 text-gray-400 font-medium">Kategori</th>
                <th className="text-left p-4 text-gray-400 font-medium">Slug</th>
                <th className="text-left p-4 text-gray-400 font-medium">Yazı Sayısı</th>
                <th className="text-left p-4 text-gray-400 font-medium">Sıra</th>
                <th className="text-right p-4 text-gray-400 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <motion.tr
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white border-opacity-5"
                >
                  <td className="p-4">
                    <div>
                      <div className="text-white font-medium">{category.name}</div>
                      <div className="text-gray-400 text-sm">{category.nameEn}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{category.slug}</td>
                  <td className="p-4 text-gray-300">{category.postCount}</td>
                  <td className="p-4 text-gray-300">{category.order}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(category)}
                        className="p-2 bg-mea-gold bg-opacity-20 text-mea-gold rounded-lg hover:bg-opacity-30"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="p-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Kategori Adı (TR)</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="admin-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Kategori Adı (EN)</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="admin-input"
                    placeholder="otomatik oluşturulacak"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Sıra</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="admin-input"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Renk</label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="admin-input h-12"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="flex-1 btn-primary">
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button type="button" onClick={closeModal} className="flex-1 btn-secondary">
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
