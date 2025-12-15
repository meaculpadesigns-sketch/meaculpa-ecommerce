'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, Clock, Tag, Search } from 'lucide-react';
import { getPublishedBlogPosts, getAllBlogCategories } from '@/lib/blog-helpers';
import { BlogPost, BlogCategory } from '@/types';
import { useTranslation } from 'react-i18next';

export default function BlogPage() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-products';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, selectedCategory, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsData, categoriesData] = await Promise.all([
        getPublishedBlogPosts(),
        getAllBlogCategories(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = [...posts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((post) => post.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.titleEn.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const featuredPost = filteredPosts.find((p) => p.featured);
  const regularPosts = filteredPosts.filter((p) => !p.featured || p.id !== featuredPost?.id);

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            {t('nav.blog')}
          </h1>
          <p className="text-xl text-black dark:text-white">
            {i18n.language === 'tr'
              ? 'Mea Culpa\'dan hikayeler, fikirler ve ilham'
              : 'Stories, ideas, and inspiration from Mea Culpa'}
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="glass rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600"
                size={20}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={i18n.language === 'tr' ? 'Blog ara...' : 'Search blog...'}
                className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:border-mea-gold"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-xl text-black focus:outline-none focus:border-mea-gold"
              >
                <option value="all">
                  {i18n.language === 'tr' ? 'Tüm Kategoriler' : 'All Categories'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {i18n.language === 'tr' ? cat.name : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mea-gold mx-auto"></div>
            <p className="text-gray-700 mt-4">
              {i18n.language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-black mb-4">
              {i18n.language === 'tr' ? 'Blog Yazısı Bulunamadı' : 'No Blog Posts Found'}
            </h2>
            <p className="text-black dark:text-white">
              {i18n.language === 'tr'
                ? 'Arama kriterlerinize uygun blog yazısı bulunamadı'
                : 'No blog posts match your search criteria'}
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl overflow-hidden mb-12"
              >
                {featuredPost.featuredImage && (
                  <div className="aspect-[21/9] bg-zinc-800">
                    <img
                      src={featuredPost.featuredImage}
                      alt={i18n.language === 'tr' ? featuredPost.title : featuredPost.titleEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-mea-gold bg-opacity-20 text-mea-gold rounded-full text-sm font-medium">
                      {i18n.language === 'tr' ? 'Öne Çıkan' : 'Featured'}
                    </span>
                    <span className="px-3 py-1 bg-black bg-opacity-10 text-black rounded-full text-sm">
                      {i18n.language === 'tr' ? featuredPost.categoryName : featuredPost.categoryNameEn}
                    </span>
                  </div>

                  <h2 className="text-4xl font-bold text-black mb-4">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:text-mea-gold transition-colors">
                      {i18n.language === 'tr' ? featuredPost.title : featuredPost.titleEn}
                    </Link>
                  </h2>

                  <p className="text-black dark:text-white text-lg mb-6">
                    {i18n.language === 'tr' ? featuredPost.excerpt : featuredPost.excerptEn}
                  </p>

                  <div className="flex items-center gap-6 text-gray-600 text-sm mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>
                        {featuredPost.readTime} {i18n.language === 'tr' ? 'dk okuma' : 'min read'}
                      </span>
                    </div>
                  </div>

                  <Link href={`/blog/${featuredPost.slug}`} className="btn-primary inline-block">
                    {i18n.language === 'tr' ? 'Devamını Oku' : 'Read More'}
                  </Link>
                </div>
              </motion.div>
            )}

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
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
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-black bg-opacity-10 text-black rounded-full text-xs">
                        {i18n.language === 'tr' ? post.categoryName : post.categoryNameEn}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-black mb-3">
                      <Link href={`/blog/${post.slug}`} className="hover:text-mea-gold transition-colors">
                        {i18n.language === 'tr' ? post.title : post.titleEn}
                      </Link>
                    </h3>

                    <p className="text-black dark:text-white mb-4 line-clamp-3">
                      {i18n.language === 'tr' ? post.excerpt : post.excerptEn}
                    </p>

                    <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{post.readTime} {i18n.language === 'tr' ? 'dk' : 'min'}</span>
                      </div>
                    </div>

                    <Link href={`/blog/${post.slug}`} className="text-mea-gold font-medium hover:underline">
                      {i18n.language === 'tr' ? 'Devamını Oku →' : 'Read More →'}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
