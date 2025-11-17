'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadFile } from '@/lib/firebase-helpers';
import { Creation } from '@/types';

export default function AdminCreationsPage() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCreation, setEditingCreation] = useState<Creation | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    story: '',
    season: 'all' as 'summer' | 'winter' | 'special' | 'all',
    image: '',
    products: [] as string[],
    featured: false,
  });

  useEffect(() => {
    document.body.className = 'bg-home';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    fetchCreations();
  }, []);

  const fetchCreations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'creations'));
      const creationsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Creation[];
      setCreations(creationsData);
    } catch (error) {
      console.error('Error fetching creations:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `creations/${Date.now()}_${file.name}`;
      const url = await uploadFile(file, path);
      setFormData({ ...formData, image: url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Görsel yüklenirken hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCreation) {
        await updateDoc(doc(db, 'creations', editingCreation.id), formData);
      } else {
        await addDoc(collection(db, 'creations'), {
          ...formData,
          createdAt: new Date(),
        });
      }

      await fetchCreations();
      closeModal();
      alert(editingCreation ? 'Kreasyon güncellendi!' : 'Kreasyon eklendi!');
    } catch (error) {
      console.error('Error saving creation:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kreasyonu silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'creations', id));
      await fetchCreations();
      alert('Kreasyon silindi!');
    } catch (error) {
      console.error('Error deleting creation:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const openModal = (creation?: Creation) => {
    if (creation) {
      setEditingCreation(creation);
      setFormData({
        name: creation.name,
        description: creation.description,
        story: creation.story || '',
        season: creation.season,
        image: creation.image,
        products: creation.products,
        featured: creation.featured || false,
      });
    } else {
      setEditingCreation(null);
      setFormData({
        name: '',
        description: '',
        story: '',
        season: 'all',
        image: '',
        products: [],
        featured: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCreation(null);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Kreasyon Yönetimi
            </h1>
            <p className="text-gray-400">
              Ana sayfada gösterilecek kreasyonları yönetin
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Kreasyon Ekle
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation, index) => (
            <motion.div
              key={creation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-zinc-800 flex items-center justify-center relative">
                {creation.image ? (
                  <img
                    src={creation.image}
                    alt={creation.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-gray-600" size={60} />
                )}
                {creation.featured && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold text-xs font-medium">
                    Öne Çıkan
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {creation.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{creation.season}</p>
                </div>

                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {creation.description}
                </p>

                {creation.story && (
                  <p className="text-gray-400 text-xs mb-4 italic line-clamp-2">
                    "{creation.story}"
                  </p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(creation)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-mea-gold bg-opacity-20 text-mea-gold rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Edit size={16} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(creation.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {creations.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">
              Henüz Kreasyon Yok
            </h2>
            <p className="text-gray-400 mb-8">
              Yeni kreasyon eklemek için yukarıdaki butona tıklayın
            </p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingCreation ? 'Kreasyon Düzenle' : 'Yeni Kreasyon Ekle'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Kreasyon Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field"
                    placeholder="Örn: Yazlık Koleksiyon 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field"
                    rows={3}
                    placeholder="Kısa açıklama..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Hikaye (Opsiyonel)
                  </label>
                  <textarea
                    value={formData.story}
                    onChange={(e) =>
                      setFormData({ ...formData, story: e.target.value })
                    }
                    className="input-field"
                    rows={4}
                    placeholder="Bu koleksiyonun hikayesi..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Sezon
                  </label>
                  <select
                    value={formData.season}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        season: e.target.value as any,
                      })
                    }
                    className="input-field"
                    required
                  >
                    <option value="all">Tüm Sezonlar</option>
                    <option value="summer">Yazlık</option>
                    <option value="winter">Kışlık</option>
                    <option value="special">Özel Tasarım</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-white font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    Öne Çıkan Kreasyon
                  </label>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Görsel
                  </label>
                  {formData.image && (
                    <div className="mb-4 aspect-video bg-zinc-800 rounded-lg overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <label className="btn-secondary cursor-pointer inline-block">
                    {uploading ? 'Yükleniyor...' : 'Görsel Seç'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 btn-secondary"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}