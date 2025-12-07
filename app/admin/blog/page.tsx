'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Eye, FileText, Calendar } from 'lucide-react';
import { getAllBlogPosts, deleteBlogPost, updateBlogPost } from '@/lib/blog-helpers';
import { BlogPost } from '@/types';
import AdminBackButton from '@/components/AdminBackButton';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'scheduled'>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchQuery, statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Blog yazıları yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.titleEn.toLowerCase().includes(query) ||
          post.categoryName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" başlıklı blog yazısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await deleteBlogPost(id);
      await fetchPosts();
      alert('Blog yazısı silindi!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published') => {
    try {
      const updateData: Partial<BlogPost> = { status: newStatus };
      if (newStatus === 'published') {
        updateData.publishedAt = new Date();
      }
      await updateBlogPost(id, updateData);
      await fetchPosts();
      alert(`Blog yazısı ${newStatus === 'published' ? 'yayınlandı' : 'taslak olarak kaydedildi'}!`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken hata oluştu');
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminBackButton />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Blog Yönetimi</h1>
            <p className="text-gray-400">
              Blog yazılarını ekleyin, düzenleyin ve yönetin
            </p>
          </div>
          <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Yeni Blog Yazısı
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            href="/admin/blog/categories"
            className="glass rounded-xl p-6 hover:bg-white hover:bg-opacity-5 transition-colors"
          >
            <FileText className="text-mea-gold mb-3" size={32} />
            <h3 className="text-xl font-bold text-white mb-1">Kategoriler</h3>
            <p className="text-gray-400 text-sm">Blog kategorilerini yönetin</p>
          </Link>

          <Link
            href="/admin/blog/comments"
            className="glass rounded-xl p-6 hover:bg-white hover:bg-opacity-5 transition-colors"
          >
            <Eye className="text-mea-gold mb-3" size={32} />
            <h3 className="text-xl font-bold text-white mb-1">Yorumlar</h3>
            <p className="text-gray-400 text-sm">Yorumları onaylayın veya reddedin</p>
          </Link>

          <div className="glass rounded-xl p-6">
            <Calendar className="text-mea-gold mb-3" size={32} />
            <h3 className="text-xl font-bold text-white mb-1">
              {posts.length} Blog Yazısı
            </h3>
            <p className="text-gray-400 text-sm">
              {posts.filter((p) => p.status === 'published').length} yayında,{' '}
              {posts.filter((p) => p.status === 'draft').length} taslak
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Başlık veya kategori ara..."
                className="admin-input pl-12"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'all' | 'draft' | 'published' | 'scheduled')
                }
                className="admin-input"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
                <option value="scheduled">Zamanlanmış</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mea-gold mx-auto"></div>
            <p className="text-gray-400 mt-4">Yükleniyor...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">
              {searchQuery || statusFilter !== 'all' ? 'Sonuç Bulunamadı' : 'Henüz Blog Yazısı Yok'}
            </h2>
            <p className="text-gray-400 mb-8">
              {searchQuery || statusFilter !== 'all'
                ? 'Arama kriterlerinize uygun blog yazısı bulunamadı'
                : 'Yeni blog yazısı eklemek için yukarıdaki butona tıklayın'}
            </p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white border-opacity-10">
                  <tr>
                    <th className="text-left p-4 text-gray-400 font-medium">Başlık</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Kategori</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Durum</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Görüntülenme</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Tarih</th>
                    <th className="text-right p-4 text-gray-400 font-medium">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <div className="text-white font-medium line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-gray-400 text-sm line-clamp-1">
                            {post.titleEn}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">{post.categoryName}</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.status === 'published'
                              ? 'bg-green-500 bg-opacity-20 text-green-500'
                              : post.status === 'scheduled'
                              ? 'bg-blue-500 bg-opacity-20 text-blue-500'
                              : 'bg-gray-500 bg-opacity-20 text-gray-400'
                          }`}
                        >
                          {post.status === 'published'
                            ? 'Yayında'
                            : post.status === 'scheduled'
                            ? 'Zamanlanmış'
                            : 'Taslak'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300">{post.views || 0}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-300 text-sm">
                          {post.status === 'published'
                            ? formatDate(post.publishedAt)
                            : formatDate(post.createdAt)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Publish/Unpublish */}
                          {post.status === 'draft' && (
                            <button
                              onClick={() => handleStatusChange(post.id, 'published')}
                              className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-500 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                            >
                              Yayınla
                            </button>
                          )}
                          {post.status === 'published' && (
                            <button
                              onClick={() => handleStatusChange(post.id, 'draft')}
                              className="px-3 py-1 bg-gray-500 bg-opacity-20 text-gray-400 rounded-lg hover:bg-opacity-30 transition-colors text-sm"
                            >
                              Taslak Yap
                            </button>
                          )}

                          {/* Edit Button */}
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="p-2 bg-mea-gold bg-opacity-20 text-mea-gold rounded-lg hover:bg-opacity-30 transition-colors"
                          >
                            <Edit size={16} />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
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
          </div>
        )}
      </div>
    </div>
  );
}
