'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, X, Upload, Tag } from 'lucide-react';
import { addBlogPost, getAllBlogCategories, generateSlug, calculateReadTime } from '@/lib/blog-helpers';
import { uploadFile } from '@/lib/firebase-helpers';
import { BlogPost, BlogCategory } from '@/types';
import AdminBackButton from '@/components/AdminBackButton';
import RichTextEditor from '@/components/blog/RichTextEditor';

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
    slugEn: '',
    content: '',
    contentEn: '',
    excerpt: '',
    excerptEn: '',
    categoryId: '',
    categoryName: '',
    categoryNameEn: '',
    tags: [] as string[],
    featuredImage: '',
    images: [] as string[],
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    scheduledFor: '',
    author: 'Admin',
    authorId: 'admin',
    featured: false,
    allowComments: true,
    seoTitle: '',
    seoTitleEn: '',
    seoDescription: '',
    seoDescriptionEn: '',
    seoKeywords: [] as string[],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title),
      }));
    }
  }, [formData.title]);

  // Auto-generate slugEn from titleEn
  useEffect(() => {
    if (formData.titleEn && !formData.slugEn) {
      setFormData((prev) => ({
        ...prev,
        slugEn: generateSlug(formData.titleEn),
      }));
    }
  }, [formData.titleEn]);

  const fetchCategories = async () => {
    try {
      const data = await getAllBlogCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setFormData({
        ...formData,
        categoryId: category.id,
        categoryName: category.name,
        categoryNameEn: category.nameEn,
      });
    }
  };

  const handleImageUpload = async (file: File, type: 'featured' | 'additional') => {
    setUploading(true);
    try {
      const path = `blog/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);

      if (type === 'featured') {
        setFormData({ ...formData, featuredImage: url });
      } else {
        setFormData({ ...formData, images: [...formData.images, url] });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Görsel yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();

    if (!formData.title || !formData.categoryId || !formData.content) {
      alert('Lütfen zorunlu alanları doldurun (Başlık, Kategori, İçerik)');
      return;
    }

    setLoading(true);

    try {
      const readTime = calculateReadTime(formData.content);
      const scheduledFor = formData.scheduledFor ? new Date(formData.scheduledFor) : undefined;

      const postData: Omit<BlogPost, 'id'> = {
        ...formData,
        status,
        readTime,
        scheduledFor,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: status === 'published' ? new Date() : undefined,
      };

      await addBlogPost(postData);
      alert(`Blog yazısı ${status === 'published' ? 'yayınlandı' : 'taslak olarak kaydedildi'}!`);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Kaydetme işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <AdminBackButton />

        <h1 className="text-4xl font-bold text-black dark:text-white mb-8">Yeni Blog Yazısı</h1>

        <form className="space-y-6">
          {/* Turkish Title & Slug */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Temel Bilgiler (Türkçe)</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  Başlık (TR) *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  URL Slug (otomatik)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="admin-input"
                  placeholder="mea-culpa-hikayesi"
                />
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  Özet (TR) *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="admin-input"
                  rows={3}
                  placeholder="Kısa bir özet (blog listesinde görünecek)"
                />
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  İçerik (TR) *
                </label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Blog içeriğini buraya yazın..."
                />
              </div>
            </div>
          </div>

          {/* English Title & Content */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">İngilizce Çeviri</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  Başlık (EN)
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  URL Slug (EN)
                </label>
                <input
                  type="text"
                  value={formData.slugEn}
                  onChange={(e) => setFormData({ ...formData, slugEn: e.target.value })}
                  className="admin-input"
                  placeholder="Boş bırakırsanız İngilizce başlıktan otomatik oluşturulur"
                />
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  Özet (EN)
                </label>
                <textarea
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  className="admin-input"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  İçerik (EN)
                </label>
                <RichTextEditor
                  content={formData.contentEn}
                  onChange={(content) => setFormData({ ...formData, contentEn: content })}
                  placeholder="English blog content..."
                />
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Kategori ve Etiketler</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="admin-input"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  Etiketler
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="admin-input flex-1"
                    placeholder="Etiket ekle ve Enter'a bas"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Tag size={18} />
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-mea-gold bg-opacity-20 text-mea-gold rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Öne Çıkan Görsel</h2>

            {formData.featuredImage && (
              <div className="mb-4 aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
              <Upload size={18} />
              {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'featured');
                }}
                disabled={uploading}
              />
            </label>
          </div>

          {/* Publishing Options */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-black dark:text-white mb-4">Yayın Ayarları</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded bg-white bg-opacity-10 border-white border-opacity-20"
                  />
                  Öne Çıkan Yazı
                </label>

                <label className="flex items-center gap-2 text-black dark:text-white">
                  <input
                    type="checkbox"
                    checked={formData.allowComments}
                    onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                    className="w-5 h-5 rounded bg-white bg-opacity-10 border-white border-opacity-20"
                  />
                  Yorumlara İzin Ver
                </label>
              </div>

              <div>
                <label className="block text-black dark:text-white font-medium mb-2">
                  Planlı Yayın Tarihi (Opsiyonel)
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading || uploading}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Kaydediliyor...' : 'Taslak Olarak Kaydet'}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading || uploading}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {loading ? 'Yayınlanıyor...' : 'Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
