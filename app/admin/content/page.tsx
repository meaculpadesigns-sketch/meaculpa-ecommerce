'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Image,
  Search,
  Globe,
  Save,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ContentPage {
  id: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  language: 'tr' | 'en';
  status: 'published' | 'draft';
  lastUpdated: string;
}

export default function AdminContentPage() {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language === 'tr';
  const [activeTab, setActiveTab] = useState<'pages' | 'seo' | 'media'>('pages');
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);

  // Sample content pages
  const [pages, setPages] = useState<ContentPage[]>([
    {
      id: '1',
      title: 'Anasayfa',
      slug: '/',
      metaTitle: 'Mea Culpa - Zamana Dokunan Hikayeler',
      metaDescription: 'Doğu\'nun ilhamıyla, modern yaşamın içinde. Her karar bir yolculuktur.',
      language: 'tr',
      status: 'published',
      lastUpdated: '2024-01-15',
    },
    {
      id: '2',
      title: 'Home Page',
      slug: '/',
      metaTitle: 'Mea Culpa - Stories That Touch Time',
      metaDescription: 'Inspired by the East, within modern life. Every decision is a journey.',
      language: 'en',
      status: 'published',
      lastUpdated: '2024-01-15',
    },
    {
      id: '3',
      title: 'Hakkımızda',
      slug: '/about',
      metaTitle: 'Hakkımızda - Mea Culpa',
      metaDescription: 'Mea Culpa hikayemizi keşfedin. Geleneksel el işçiliği ile modern tasarımı buluşturuyoruz.',
      language: 'tr',
      status: 'published',
      lastUpdated: '2024-01-14',
    },
  ]);

  const handleSavePage = (page: ContentPage) => {
    setPages(pages.map(p => p.id === page.id ? page : p));
    setEditingPage(null);
  };

  const handleDeletePage = (id: string) => {
    if (confirm(t('common.delete') + '?')) {
      setPages(pages.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isTurkish ? 'İçerik Yönetimi & SEO' : 'Content Management & SEO'}
          </h1>
          <p className="text-gray-400">
            {isTurkish
              ? 'Sayfa içerikleri ve SEO ayarlarını yönetin'
              : 'Manage page content and SEO settings'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pages'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <FileText className="inline mr-2" size={20} />
            {isTurkish ? 'Sayfalar' : 'Pages'}
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'seo'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <Search className="inline mr-2" size={20} />
            {isTurkish ? 'SEO Ayarları' : 'SEO Settings'}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'media'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <Image className="inline mr-2" size={20} />
            {isTurkish ? 'Medya' : 'Media'}
          </button>
        </div>

        {/* Pages Tab */}
        {activeTab === 'pages' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">
                {isTurkish ? 'Sayfa İçerikleri' : 'Page Contents'}
              </h2>
              <button className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                {isTurkish ? 'Yeni Sayfa' : 'New Page'}
              </button>
            </div>

            {pages.map((page) => (
              <div key={page.id} className="glass rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{page.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        page.language === 'tr' ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'
                      }`}>
                        {page.language.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        page.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {page.status === 'published'
                          ? (isTurkish ? 'Yayında' : 'Published')
                          : (isTurkish ? 'Taslak' : 'Draft')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{page.slug}</p>
                    <div className="space-y-1">
                      <p className="text-sm text-white"><strong>Meta Title:</strong> {page.metaTitle}</p>
                      <p className="text-sm text-gray-400"><strong>Meta Description:</strong> {page.metaDescription}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {isTurkish ? 'Son güncelleme: ' : 'Last updated: '}
                      {new Date(page.lastUpdated).toLocaleDateString(isTurkish ? 'tr-TR' : 'en-US')}
                    </p>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <button className="btn-secondary flex items-center justify-center gap-2 px-4 py-2 text-sm">
                      <Eye size={16} />
                      {isTurkish ? 'Önizle' : 'Preview'}
                    </button>
                    <button
                      onClick={() => setEditingPage(page)}
                      className="btn-primary flex items-center justify-center gap-2 px-4 py-2 text-sm"
                    >
                      <Edit size={16} />
                      {isTurkish ? 'Düzenle' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 px-4 py-2 text-sm transition-colors"
                    >
                      <Trash2 size={16} />
                      {isTurkish ? 'Sil' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {isTurkish ? 'SEO Genel Ayarları' : 'General SEO Settings'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Site Başlığı' : 'Site Title'}
                </label>
                <input type="text" defaultValue="Mea Culpa" className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Site Açıklaması' : 'Site Description'}
                </label>
                <textarea
                  defaultValue="Doğu'nun ilhamıyla, modern yaşamın içinde. Her karar bir yolculuktur."
                  className="admin-input w-full"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Anahtar Kelimeler' : 'Keywords'}
                </label>
                <input
                  type="text"
                  defaultValue="kimono, set, tasarım, el işi, moda, organik kumaş, el boyaması"
                  className="admin-input w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Google Analytics ID</label>
                <input type="text" placeholder="G-XXXXXXXXXX" className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-white mb-2">Google Search Console</label>
                <input
                  type="text"
                  placeholder="meta content..."
                  className="admin-input w-full"
                />
              </div>
              <button className="btn-primary flex items-center gap-2">
                <Save size={20} />
                {isTurkish ? 'Kaydet' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {isTurkish ? 'Medya Kütüphanesi' : 'Media Library'}
              </h2>
              <button className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                {isTurkish ? 'Yeni Medya Yükle' : 'Upload New Media'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-zinc-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors"
                >
                  <Image className="text-gray-600" size={48} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Edit Modal */}
        {editingPage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                {isTurkish ? 'Sayfayı Düzenle' : 'Edit Page'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">
                    {isTurkish ? 'Başlık' : 'Title'}
                  </label>
                  <input
                    type="text"
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={editingPage.metaTitle}
                    onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                    className="admin-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Meta Description</label>
                  <textarea
                    value={editingPage.metaDescription}
                    onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                    className="admin-input w-full"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSavePage(editingPage)}
                    className="btn-primary flex-1"
                  >
                    {isTurkish ? 'Kaydet' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingPage(null)}
                    className="btn-secondary flex-1"
                  >
                    {isTurkish ? 'İptal' : 'Cancel'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}