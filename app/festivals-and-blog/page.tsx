'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { getPublishedBlogPosts } from '@/lib/blog-helpers';
import { BlogPost, Carnival } from '@/types';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function FestivalsAndBlogPage() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'festivals' | 'blog'>('festivals');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [carnivals, setCarnivals] = useState<Carnival[]>([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [loadingCarnivals, setLoadingCarnivals] = useState(false);

  useEffect(() => {
    document.body.className = 'bg-light text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'blog' && blogPosts.length === 0) {
      fetchBlogPosts();
    } else if (activeTab === 'festivals' && carnivals.length === 0) {
      fetchCarnivals();
    }
  }, [activeTab]);

  const fetchBlogPosts = async () => {
    try {
      setLoadingBlog(true);
      const posts = await getPublishedBlogPosts();
      setBlogPosts(posts.slice(0, 6)); // İlk 6 yazı
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoadingBlog(false);
    }
  };

  const fetchCarnivals = async () => {
    try {
      setLoadingCarnivals(true);
      const carnivalsRef = collection(db, 'carnivals');
      const q = query(carnivalsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Carnival[];
      setCarnivals(data);
    } catch (error) {
      console.error('Error fetching carnivals:', error);
    } finally {
      setLoadingCarnivals(false);
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

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {i18n.language === 'tr' ? 'Festivaller ve Blog' : 'Festivals & Blog'}
          </h1>
          <p className="text-xl text-gray-400">
            {i18n.language === 'tr'
              ? 'Etkinliklerimizi keşfedin ve blog yazılarımızı okuyun'
              : 'Discover our events and read our blog posts'}
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-xl p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab('festivals')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'festivals'
                  ? 'bg-mea-gold text-black'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Calendar className="inline-block mr-2" size={20} />
              {i18n.language === 'tr' ? 'Festivaller' : 'Festivals'}
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'blog'
                  ? 'bg-mea-gold text-black'
                  : 'text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FileText className="inline-block mr-2" size={20} />
              {i18n.language === 'tr' ? 'Blog' : 'Blog'}
            </button>
          </div>
        </div>

        {/* Festivals Tab */}
        {activeTab === 'festivals' && (
          <>
            {loadingCarnivals ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mea-gold mx-auto"></div>
                <p className="text-gray-400 mt-4">
                  {i18n.language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {carnivals.map((carnival, index) => (
                <motion.div
                  key={carnival.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  {carnival.image ? (
                    <div className="aspect-video bg-zinc-800">
                      <img
                        src={carnival.image}
                        alt={i18n.language === 'tr' ? carnival.name : carnival.nameEn}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-800 flex items-center justify-center">
                      <p className="text-white">{t('carnivals.eventImage')}</p>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {i18n.language === 'tr' ? carnival.name : carnival.nameEn}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={18} />
                        <span>{i18n.language === 'tr' ? carnival.date : carnival.dateEn}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin size={18} />
                        <span>{i18n.language === 'tr' ? carnival.location : carnival.locationEn}</span>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-6">
                      {i18n.language === 'tr' ? carnival.description : carnival.descriptionEn}
                    </p>
                  </div>
                </motion.div>
                ))}
              </div>
            )}

            {!loadingCarnivals && carnivals.length === 0 && (
              <div className="text-center py-20">
                <Users className="mx-auto mb-6 text-gray-400" size={80} />
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t('carnivals.noEvents')}
                </h2>
                <p className="text-gray-400">
                  {t('carnivals.noEventsDesc')}
                </p>
              </div>
            )}

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 glass rounded-2xl p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('carnivals.stayUpdatedTitle')}
              </h3>
              <p className="text-gray-300 mb-6">
                {t('carnivals.stayUpdatedDesc')}
              </p>
              <a
                href="https://www.instagram.com/meaculpadesigns"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block"
              >
                {t('carnivals.followInstagram')}
              </a>
            </motion.div>
          </>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div>
            {loadingBlog ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mea-gold mx-auto"></div>
                <p className="text-gray-400 mt-4">
                  {i18n.language === 'tr' ? 'Yükleniyor...' : 'Loading...'}
                </p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="mx-auto mb-6 text-gray-400" size={80} />
                <h2 className="text-2xl font-bold text-white mb-4">
                  {i18n.language === 'tr' ? 'Henüz Blog Yazısı Yok' : 'No Blog Posts Yet'}
                </h2>
                <p className="text-gray-400">
                  {i18n.language === 'tr'
                    ? 'Yakında ilk blog yazılarımız yayınlanacak!'
                    : 'Our first blog posts will be published soon!'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogPosts.map((post, index) => (
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
                        <h3 className="text-xl font-bold text-white mb-3">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="hover:text-mea-gold transition-colors"
                          >
                            {i18n.language === 'tr' ? post.title : post.titleEn}
                          </Link>
                        </h3>

                        <p className="text-gray-300 mb-4 line-clamp-2">
                          {i18n.language === 'tr' ? post.excerpt : post.excerptEn}
                        </p>

                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                          <Calendar size={14} />
                          <span>{formatDate(post.publishedAt)}</span>
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

                <div className="mt-8 text-center">
                  <Link href="/blog" className="btn-primary inline-block">
                    {i18n.language === 'tr' ? 'Tüm Blog Yazıları →' : 'All Blog Posts →'}
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
