'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Eye, EyeOff, Trash2, Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAllReviews, updateReview, deleteReview as deleteReviewFromDb, getProducts } from '@/lib/firebase-helpers';
import { Review, Product } from '@/types';

interface AdminReview extends Review {
  productName: string;
}

export default function AdminReviewsPage() {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language === 'tr';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch reviews and products on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [reviewsData, productsData] = await Promise.all([
          getAllReviews(),
          getProducts()
        ]);

        setProducts(productsData);

        // Map reviews with product names
        const reviewsWithProductNames = reviewsData.map(review => {
          const product = productsData.find(p => p.id === review.productId);
          return {
            ...review,
            productName: product ? (isTurkish ? product.name : product.nameEn) : 'Unknown Product',
            status: review.status || 'pending',
            isVisible: review.isVisible ?? true
          } as AdminReview;
        });

        setReviews(reviewsWithProductNames);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isTurkish]);

  const handleApprove = async (id: string) => {
    try {
      await updateReview(id, { status: 'approved', isVisible: true });
      setReviews(reviews.map(review =>
        review.id === id ? { ...review, status: 'approved' as const, isVisible: true } : review
      ));
    } catch (error) {
      console.error('Error approving review:', error);
      alert(isTurkish ? 'Yorum onaylanırken hata oluştu' : 'Error approving review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateReview(id, { status: 'rejected', isVisible: false });
      setReviews(reviews.map(review =>
        review.id === id ? { ...review, status: 'rejected' as const, isVisible: false } : review
      ));
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert(isTurkish ? 'Yorum reddedilirken hata oluştu' : 'Error rejecting review');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      const review = reviews.find(r => r.id === id);
      if (!review) return;

      const newVisibility = !review.isVisible;
      await updateReview(id, { isVisible: newVisibility });
      setReviews(reviews.map(review =>
        review.id === id ? { ...review, isVisible: newVisibility } : review
      ));
    } catch (error) {
      console.error('Error toggling visibility:', error);
      alert(isTurkish ? 'Görünürlük değiştirilirken hata oluştu' : 'Error toggling visibility');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('common.delete') + '?')) {
      try {
        await deleteReviewFromDb(id);
        setReviews(reviews.filter(review => review.id !== id));
      } catch (error) {
        console.error('Error deleting review:', error);
        alert(isTurkish ? 'Yorum silinirken hata oluştu' : 'Error deleting review');
      }
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || review.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0',
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-white text-xl">
          {isTurkish ? 'Yükleniyor...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isTurkish ? 'Yorumlar & Değerlendirmeler' : 'Reviews & Ratings'}
          </h1>
          <p className="text-gray-400">
            {isTurkish
              ? 'Müşteri yorumlarını yönetin ve değerlendirin'
              : 'Manage and evaluate customer reviews'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Toplam' : 'Total'}
            </p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Bekleyen' : 'Pending'}
            </p>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Onaylanan' : 'Approved'}
            </p>
            <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Reddedilen' : 'Rejected'}
            </p>
            <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {isTurkish ? 'Ort. Puan' : 'Avg. Rating'}
            </p>
            <p className="text-3xl font-bold text-mea-gold flex items-center gap-1">
              {stats.avgRating} <Star size={20} fill="currentColor" />
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={isTurkish ? 'Ara...' : 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="input-field"
              >
                <option value="all">{isTurkish ? 'Tüm Durumlar' : 'All Statuses'}</option>
                <option value="pending">{isTurkish ? 'Bekleyen' : 'Pending'}</option>
                <option value="approved">{isTurkish ? 'Onaylanan' : 'Approved'}</option>
                <option value="rejected">{isTurkish ? 'Reddedilen' : 'Rejected'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{review.userName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      review.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                      review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {review.status === 'approved' ? (isTurkish ? 'Onaylı' : 'Approved') :
                       review.status === 'pending' ? (isTurkish ? 'Beklemede' : 'Pending') :
                       (isTurkish ? 'Reddedildi' : 'Rejected')}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{review.productName}</p>
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={18}
                        className={star <= review.rating ? 'text-mea-gold fill-mea-gold' : 'text-gray-600'}
                      />
                    ))}
                  </div>
                  <p className="text-white mb-2">{review.comment}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{review.createdAt ? new Date(review.createdAt.toString()).toLocaleDateString(isTurkish ? 'tr-TR' : 'en-US') : 'N/A'}</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={14} />
                      {review.helpful} {isTurkish ? 'faydalı' : 'helpful'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2">
                  {review.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="btn-primary flex items-center justify-center gap-2 px-4 py-2 text-sm"
                      >
                        <ThumbsUp size={16} />
                        {isTurkish ? 'Onayla' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors"
                      >
                        <ThumbsDown size={16} />
                        {isTurkish ? 'Reddet' : 'Reject'}
                      </button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <button
                      onClick={() => handleToggleVisibility(review.id)}
                      className={`${review.isVisible ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors`}
                    >
                      {review.isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      {review.isVisible
                        ? (isTurkish ? 'Gizle' : 'Hide')
                        : (isTurkish ? 'Göster' : 'Show')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    {isTurkish ? 'Sil' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-gray-400">
              {isTurkish ? 'Yorum bulunamadı' : 'No reviews found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
