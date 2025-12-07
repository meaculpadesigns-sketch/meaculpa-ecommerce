'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { getBlogCategoryBySlug, getBlogPostsByCategory } from '@/lib/blog-helpers';
import { BlogPost, BlogCategory } from '@/types';
import { useTranslation } from 'react-i18next';

export default function BlogCategoryPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [category, setCategory] = useState<BlogCategory | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-products';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryData = await getBlogCategoryBySlug(slug);

      if (!categoryData) {
        router.push('/blog');
        return;
      }

      setCategory(categoryData);

      const postsData = await getBlogPostsByCategory(categoryData.id);
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mea-gold mx-auto mb-4"></div>
          <p className="text-gray-700">
            {i18n.language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  const categoryName = i18n.language === 'tr' ? category.name : category.nameEn;
  const categoryDescription = i18n.language === 'tr' ? category.description : category.descriptionEn;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">{categoryName}</h1>
          {categoryDescription && (
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">{categoryDescription}</p>
          )}
          <p className="text-gray-600 mt-4">
            {posts.length} {i18n.language === 'tr' ? 'yazı' : 'posts'}
          </p>
        </motion.div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-black mb-4">
              {i18n.language === 'tr' ? 'Bu kategoride henüz yazı yok' : 'No posts in this category yet'}
            </h2>
            <Link href="/blog" className="btn-secondary inline-block">
              ← {i18n.language === 'tr' ? 'Tüm Blog Yazıları' : 'All Blog Posts'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
              >
                {post.featuredImage && (
                  <Link href={`/blog/${post.slug}`}>
                    <div className="aspect-video bg-zinc-800">
                      <img
                        src={post.featuredImage}
                        alt={i18n.language === 'tr' ? post.title : post.titleEn}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-mea-gold transition-colors"
                    >
                      {i18n.language === 'tr' ? post.title : post.titleEn}
                    </Link>
                  </h3>

                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {i18n.language === 'tr' ? post.excerpt : post.excerptEn}
                  </p>

                  <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>
                        {post.readTime} {i18n.language === 'tr' ? 'dk' : 'min'}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-mea-gold font-medium hover:underline"
                  >
                    {i18n.language === 'tr' ? 'Devamını Oku →' : 'Read More →'}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link href="/blog" className="btn-secondary inline-block">
            ← {i18n.language === 'tr' ? 'Tüm Kategoriler' : 'All Categories'}
          </Link>
        </div>
      </div>
    </div>
  );
}
