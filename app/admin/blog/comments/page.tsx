'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Trash2, MessageSquare } from 'lucide-react';
import {
  getAllBlogComments,
  getPendingComments,
  approveBlogComment,
  rejectBlogComment,
  deleteBlogComment,
} from '@/lib/blog-helpers';
import { BlogComment } from '@/types';
import AdminBackButton from '@/components/AdminBackButton';

export default function BlogCommentsPage() {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = filter === 'pending' ? await getPendingComments() : await getAllBlogComments();
      const filtered =
        filter === 'all' ? data : data.filter((c) => c.status === filter);
      setComments(filtered);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveBlogComment(id);
      await fetchComments();
      alert('Yorum onaylandı!');
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Onaylama işlemi başarısız');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectBlogComment(id);
      await fetchComments();
      alert('Yorum reddedildi!');
    } catch (error) {
      console.error('Error rejecting comment:', error);
      alert('Reddetme işlemi başarısız');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteBlogComment(id);
      await fetchComments();
      alert('Yorum silindi!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminBackButton />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Yorum Moderasyonu</h1>
            <p className="text-black dark:text-white">Blog yorumlarını onaylayın veya reddedin</p>
          </div>
        </div>

        {/* Filter */}
        <div className="glass rounded-2xl p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'pending'
                  ? 'bg-mea-gold text-black'
                  : 'bg-white bg-opacity-10 text-black dark:text-white hover:bg-opacity-20'
              }`}
            >
              Bekleyenler
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'approved'
                  ? 'bg-mea-gold text-black'
                  : 'bg-white bg-opacity-10 text-black dark:text-white hover:bg-opacity-20'
              }`}
            >
              Onaylananlar
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'rejected'
                  ? 'bg-mea-gold text-black'
                  : 'bg-white bg-opacity-10 text-black dark:text-white hover:bg-opacity-20'
              }`}
            >
              Reddedilenler
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-mea-gold text-black'
                  : 'bg-white bg-opacity-10 text-black dark:text-white hover:bg-opacity-20'
              }`}
            >
              Tümü
            </button>
          </div>
        </div>

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mea-gold mx-auto"></div>
            <p className="text-black dark:text-white mt-4">Yükleniyor...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="mx-auto mb-6 text-black dark:text-white" size={80} />
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Yorum Bulunamadı</h2>
            <p className="text-black dark:text-white">Bu filtreyeuygun yorum bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold text-black dark:text-white">{comment.userName}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          comment.status === 'approved'
                            ? 'bg-green-500 bg-opacity-20 text-green-500'
                            : comment.status === 'rejected'
                            ? 'bg-red-500 bg-opacity-20 text-red-500'
                            : 'bg-yellow-500 bg-opacity-20 text-yellow-500'
                        }`}
                      >
                        {comment.status === 'approved'
                          ? 'Onaylandı'
                          : comment.status === 'rejected'
                          ? 'Reddedildi'
                          : 'Bekliyor'}
                      </span>
                    </div>
                    <p className="text-black dark:text-white text-sm">{comment.userEmail}</p>
                    <p className="text-black dark:text-white text-sm">
                      {comment.postTitle} • {formatDate(comment.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {comment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(comment.id)}
                          className="p-2 bg-green-500 bg-opacity-20 text-green-500 rounded-lg hover:bg-opacity-30"
                          title="Onayla"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(comment.id)}
                          className="p-2 bg-yellow-500 bg-opacity-20 text-yellow-500 rounded-lg hover:bg-opacity-30"
                          title="Reddet"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30"
                      title="Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-black dark:text-white">{comment.content}</p>

                {comment.parentCommentId && (
                  <div className="mt-3 pl-4 border-l-2 border-mea-gold border-opacity-30">
                    <p className="text-black dark:text-white text-sm">↳ Bir yoruma yanıt</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
