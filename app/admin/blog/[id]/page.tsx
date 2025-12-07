'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, X, Upload, Tag } from 'lucide-react';
import {
  getBlogPostById,
  updateBlogPost,
  getAllBlogCategories,
  generateSlug,
  calculateReadTime,
} from '@/lib/blog-helpers';
import { uploadFile } from '@/lib/firebase-helpers';
import { BlogPost, BlogCategory } from '@/types';
import AdminBackButton from '@/components/AdminBackButton';
import RichTextEditor from '@/components/blog/RichTextEditor';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    slug: '',
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
    fetchData();
  }, [postId]);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const [post, cats] = await Promise.all([getBlogPostById(postId), getAllBlogCategories()]);

      if (post) {
        setFormData({
          title: post.title,
          titleEn: post.titleEn,
          slug: post.slug,
          content: post.content,
          contentEn: post.contentEn,
          excerpt: post.excerpt,
          excerptEn: post.excerptEn,
          categoryId: post.categoryId,
          categoryName: post.categoryName,
          categoryNameEn: post.categoryNameEn,
          tags: post.tags,
          featuredImage: post.featuredImage,
          images: post.images,
          status: post.status,
          scheduledFor: post.scheduledFor
            ? new Date(post.scheduledFor).toISOString().slice(0, 16)
            : '',
          author: post.author,
          authorId: post.authorId,
          featured: post.featured,
          allowComments: post.allowComments,
          seoTitle: post.seoTitle || '',
          seoTitleEn: post.seoTitleEn || '',
          seoDescription: post.seoDescription || '',
          seoDescriptionEn: post.seoDescriptionEn || '',
          seoKeywords: post.seoKeywords || [],
        });
      }

      setCategories(cats);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Veri yüklenirken hata oluştu');
    } finally {
      setInitialLoading(false);
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

      const postData: Partial<BlogPost> = {
        ...formData,
        status,
        readTime,
        scheduledFor,
        updatedAt: new Date(),
      };

      // If changing from draft to published, set publishedAt
      if (status === 'published' && formData.status !== 'published') {
        postData.publishedAt = new Date();
      }

      await updateBlogPost(postId, postData);
      alert(`Blog yazısı güncellendi!`);
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Güncelleme işlemi başarısız');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mea-gold mx-auto mb-4"></div>
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <AdminBackButton />

        <h1 className="text-4xl font-bold text-white mb-8">Blog Yazısını Düzenle</h1>

        <form className="space-y-6">
          {/* Turkish Title & Content */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Temel Bilgiler (Türkçe)</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Başlık (TR) *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="admin-input"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Özet (TR) *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="admin-input"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">İçerik (TR) *</label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
          </div>

          {/* English */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">İngilizce Çeviri</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Başlık (EN)</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Özet (EN)</label>
                <textarea
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  className="admin-input"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">İçerik (EN)</label>
                <RichTextEditor
                  content={formData.contentEn}
                  onChange={(content) => setFormData({ ...formData, contentEn: content })}
                />
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Kategori ve Etiketler</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Kategori *</label>
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
                <label className="block text-white font-medium mb-2">Etiketler</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="admin-input flex-1"
                  />
                  <button type="button" onClick={handleAddTag} className="btn-secondary flex items-center gap-2">
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
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">
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
            <h2 className="text-xl font-bold text-white mb-4">Öne Çıkan Görsel</h2>

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
            <h2 className="text-xl font-bold text-white mb-4">Yayın Ayarları</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5"
                  />
                  Öne Çıkan Yazı
                </label>

                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={formData.allowComments}
                    onChange={(e) => setFormData({ ...formData, allowComments: e.target.checked })}
                    className="w-5 h-5"
                  />
                  Yorumlara İzin Ver
                </label>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Planlı Yayın Tarihi</label>
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
              className="flex-1 btn-secondary"
            >
              {loading ? 'Kaydediliyor...' : 'Taslak Olarak Kaydet'}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading || uploading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Kaydediliyor...' : 'Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
