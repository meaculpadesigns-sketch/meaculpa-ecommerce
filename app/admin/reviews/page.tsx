'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Eye, EyeOff, Trash2, Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Review {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  isVisible: boolean;
  helpful: number;
}

export default function AdminReviewsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Sample reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      customerName: 'Ayşe Yılmaz',
      productName: 'Geleneksel Kimono - Bej',
      rating: 5,
      comment: 'Harika bir ürün! Kalitesi ve işçiliği gerçekten çok iyi. Kesinlikle tavsiye ederim.',
      date: '2024-01-15',
      status: 'approved',
      isVisible: true,
      helpful: 12,
    },
    {
      id: '2',
      customerName: 'Mehmet Demir',
      productName: 'Modern Gömlek - Lacivert',
      rating: 4,
      comment: 'Ürün güzel ancak beden biraz büyük geldi. Kalitesi iyi.',
      date: '2024-01-14',
      status: 'approved',
      isVisible: true,
      helpful: 8,
    },
    {
      id: '3',
      customerName: 'Zeynep Kaya',
      productName: 'Özel Tasarım Set',
      rating: 5,
      comment: 'Muhteşem bir deneyim! Özel tasarım hizmeti için ekibe çok teşekkürler.',
      date: '2024-01-13',
      status: 'pending',
      isVisible: false,
      helpful: 0,
    },
  ]);

  const handleApprove = (id: string) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, status: 'approved' as const, isVisible: true } : review
    ));
  };

  const handleReject = (id: string) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, status: 'rejected' as const, isVisible: false } : review
    ));
  };

  const handleToggleVisibility = (id: string) => {
    setReviews(reviews.map(review =>
      review.id === id ? { ...review, isVisible: !review.isVisible } : review
    ));
  };

  const handleDelete = (id: string) => {
    if (confirm(t('common.delete') + '?')) {
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('common.language') === 'tr' ? 'Yorumlar & Değerlendirmeler' : 'Reviews & Ratings'}
          </h1>
          <p className="text-gray-400">
            {t('common.language') === 'tr'
              ? 'Müşteri yorumlarını yönetin ve değerlendirin'
              : 'Manage and evaluate customer reviews'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {t('common.language') === 'tr' ? 'Toplam' : 'Total'}
            </p>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {t('common.language') === 'tr' ? 'Bekleyen' : 'Pending'}
            </p>
            <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {t('common.language') === 'tr' ? 'Onaylanan' : 'Approved'}
            </p>
            <p className="text-3xl font-bold text-green-500">{stats.approved}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {t('common.language') === 'tr' ? 'Reddedilen' : 'Rejected'}
            </p>
            <p className="text-3xl font-bold text-red-500">{stats.rejected}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">
              {t('common.language') === 'tr' ? 'Ort. Puan' : 'Avg. Rating'}
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
                placeholder={t('common.language') === 'tr' ? 'Ara...' : 'Search...'}
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
                <option value="all">{t('common.language') === 'tr' ? 'Tüm Durumlar' : 'All Statuses'}</option>
                <option value="pending">{t('common.language') === 'tr' ? 'Bekleyen' : 'Pending'}</option>
                <option value="approved">{t('common.language') === 'tr' ? 'Onaylanan' : 'Approved'}</option>
                <option value="rejected">{t('common.language') === 'tr' ? 'Reddedilen' : 'Rejected'}</option>
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
                    <h3 className="text-xl font-semibold text-white">{review.customerName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      review.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                      review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {review.status === 'approved' ? (t('common.language') === 'tr' ? 'Onaylı' : 'Approved') :
                       review.status === 'pending' ? (t('common.language') === 'tr' ? 'Beklemede' : 'Pending') :
                       (t('common.language') === 'tr' ? 'Reddedildi' : 'Rejected')}
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
                    <span>{new Date(review.date).toLocaleDateString(t('common.language') === 'tr' ? 'tr-TR' : 'en-US')}</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={14} />
                      {review.helpful} {t('common.language') === 'tr' ? 'faydalı' : 'helpful'}
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
                        {t('common.language') === 'tr' ? 'Onayla' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(review.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors"
                      >
                        <ThumbsDown size={16} />
                        {t('common.language') === 'tr' ? 'Reddet' : 'Reject'}
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
                        ? (t('common.language') === 'tr' ? 'Gizle' : 'Hide')
                        : (t('common.language') === 'tr' ? 'Göster' : 'Show')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    {t('common.language') === 'tr' ? 'Sil' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <p className="text-gray-400">
              {t('common.language') === 'tr' ? 'Yorum bulunamadı' : 'No reviews found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}