'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getApprovedReviews } from '@/lib/firebase-helpers';
import { Review } from '@/types';

// 3 Static testimonials (as requested)
const staticTestimonials = [
  {
    id: 'static-1',
    name: 'Ayşe K.',
    rating: 5,
    comment: 'Kimono\'nun kalitesi ve işçiliği harika! Çok beğendim ve herkese tavsiye ediyorum.',
    commentEn: 'The quality and craftsmanship of the kimono is amazing! I loved it and recommend it to everyone.',
  },
  {
    id: 'static-2',
    name: 'Mehmet Y.',
    rating: 5,
    comment: 'Aile setimiz çok şık oldu. El yapımı kumaşlar gerçekten fark yaratıyor.',
    commentEn: 'Our family set turned out very stylish. Hand-made fabrics really make a difference.',
  },
  {
    id: 'static-3',
    name: 'Zeynep S.',
    rating: 5,
    comment: 'Özel tasarım hizmetinden çok memnun kaldım. Hayalimdeki ürünü gerçekleştirdiler!',
    commentEn: 'I am very satisfied with the custom design service. They made the product of my dreams come true!',
  },
];

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const [dynamicReviews, setDynamicReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const reviews = await getApprovedReviews();
      setDynamicReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Combine static and dynamic reviews
  const allReviews = [...staticTestimonials, ...dynamicReviews];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            {t('home.customerReviews')}
          </h2>
          <p className="text-gray-700 dark:text-gray-400 text-lg">
            {t('home.customerReviewsDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl p-6 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-mea-gold opacity-20">
                <Quote size={48} />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < review.rating ? 'text-mea-gold fill-mea-gold' : 'text-gray-600'}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 relative z-10 leading-relaxed">
                "{i18n.language === 'tr' ? review.comment : (review.commentEn || review.comment)}"
              </p>

              {/* Author */}
              <div className="border-t border-white border-opacity-10 pt-4">
                <p className="text-black dark:text-white font-semibold">{review.name}</p>
                <p className="text-gray-700 dark:text-gray-400 text-sm">{t('home.customer')}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submission CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            {i18n.language === 'tr'
              ? 'Deneyiminizi bizimle paylaşmak ister misiniz?'
              : 'Would you like to share your experience with us?'}
          </p>
          <a
            href="/submit-review"
            className="btn-primary inline-block"
          >
            {i18n.language === 'tr' ? 'Yorum Yap' : 'Submit Review'}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
