'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, Clock, Tag, Eye, MessageSquare, Facebook, Twitter, Instagram } from 'lucide-react';
import {
  getBlogPostBySlug,
  getApprovedCommentsByPost,
  addBlogComment,
  incrementBlogPostViews,
} from '@/lib/blog-helpers';
import { BlogPost, BlogComment } from '@/types';
import { useTranslation } from 'react-i18next';

export default function BlogDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  const [commentForm, setCommentForm] = useState({
    userName: '',
    userEmail: '',
    content: '',
    parentCommentId: '',
  });

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
      const postData = await getBlogPostBySlug(slug);

      if (!postData) {
        router.push('/blog');
        return;
      }

      setPost(postData);

      // Increment view count
      await incrementBlogPostViews(postData.id);

      // Fetch comments
      const commentsData = await getApprovedCommentsByPost(postData.id);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentForm.userName || !commentForm.userEmail || !commentForm.content) {
      alert(i18n.language === 'tr' ? 'Lütfen tüm alanları doldurun' : 'Please fill all fields');
      return;
    }

    if (!post) return;

    setCommentLoading(true);

    try {
      await addBlogComment({
        postId: post.id,
        postTitle: post.title,
        userId: 'guest',
        userName: commentForm.userName,
        userEmail: commentForm.userEmail,
        content: commentForm.content,
        parentCommentId: commentForm.parentCommentId || undefined,
        status: 'pending',
        createdAt: new Date(),
      });

      alert(
        i18n.language === 'tr'
          ? 'Yorumunuz gönderildi! Onaylandıktan sonra görünecektir.'
          : 'Comment submitted! It will appear after approval.'
      );

      setCommentForm({
        userName: '',
        userEmail: '',
        content: '',
        parentCommentId: '',
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert(i18n.language === 'tr' ? 'Yorum gönderilirken hata oluştu' : 'Error submitting comment');
    } finally {
      setCommentLoading(false);
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

  const shareOnSocial = (platform: 'facebook' | 'twitter' | 'instagram') => {
    const url = window.location.href;
    const title = i18n.language === 'tr' ? post?.title : post?.titleEn;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        title || ''
      )}`,
      instagram: 'https://www.instagram.com/meaculpadesign/?igsh=MW8ybW9qdGJ6bTAyNw%3D%3D#',
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
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

  if (!post) {
    return null;
  }

  const title = i18n.language === 'tr' ? post.title : post.titleEn;
  const content = i18n.language === 'tr' ? post.content : post.contentEn;
  const excerpt = i18n.language === 'tr' ? post.excerpt : post.excerptEn;

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-video bg-zinc-800 rounded-2xl overflow-hidden mb-8"
          >
            <img src={post.featuredImage} alt={title} className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href={`/blog/category/${post.categoryId}`}
              className="px-3 py-1 bg-mea-gold bg-opacity-20 text-mea-gold rounded-full text-sm font-medium hover:bg-opacity-30 transition-colors"
            >
              {i18n.language === 'tr' ? post.categoryName : post.categoryNameEn}
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">{title}</h1>

          <div className="flex items-center gap-6 text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <User size={18} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>
                {post.readTime} {i18n.language === 'tr' ? 'dk okuma' : 'min read'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={18} />
              <span>{post.views + 1}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-black bg-opacity-10 text-black rounded-full text-sm"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-8"
        >
          <div
            className="prose prose-lg max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </motion.div>

        {/* Social Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-black mb-4">
            {i18n.language === 'tr' ? 'Paylaş' : 'Share'}
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => shareOnSocial('facebook')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Facebook size={18} />
              Facebook
            </button>
            <button
              onClick={() => shareOnSocial('twitter')}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Twitter size={18} />
              Twitter
            </button>
            <button
              onClick={() => shareOnSocial('instagram')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Instagram size={18} />
              Instagram
            </button>
          </div>
        </motion.div>

        {/* Comments */}
        {post.allowComments && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
              <MessageSquare size={24} />
              {i18n.language === 'tr' ? 'Yorumlar' : 'Comments'} ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={commentForm.userName}
                  onChange={(e) => setCommentForm({ ...commentForm, userName: e.target.value })}
                  placeholder={i18n.language === 'tr' ? 'Adınız *' : 'Your name *'}
                  className="px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:border-mea-gold"
                  required
                />
                <input
                  type="email"
                  value={commentForm.userEmail}
                  onChange={(e) => setCommentForm({ ...commentForm, userEmail: e.target.value })}
                  placeholder={i18n.language === 'tr' ? 'E-posta *' : 'Email *'}
                  className="px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:border-mea-gold"
                  required
                />
              </div>
              <textarea
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                placeholder={i18n.language === 'tr' ? 'Yorumunuz *' : 'Your comment *'}
                rows={4}
                className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:border-mea-gold mb-4"
                required
              />
              <button
                type="submit"
                disabled={commentLoading}
                className="btn-primary"
              >
                {commentLoading
                  ? i18n.language === 'tr'
                    ? 'Gönderiliyor...'
                    : 'Submitting...'
                  : i18n.language === 'tr'
                  ? 'Yorum Gönder'
                  : 'Submit Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-300 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-mea-gold bg-opacity-20 flex items-center justify-center text-mea-gold font-bold">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-black">{comment.userName}</h4>
                        <span className="text-sm text-gray-600">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-600">
                  {i18n.language === 'tr'
                    ? 'Henüz yorum yapılmamış. İlk yorumu siz yapın!'
                    : 'No comments yet. Be the first to comment!'}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/blog" className="btn-secondary inline-block">
            ← {i18n.language === 'tr' ? 'Tüm Blog Yazıları' : 'All Blog Posts'}
          </Link>
        </div>
      </div>
    </div>
  );
}
