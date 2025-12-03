'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, MapPin, Save, X } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadFile } from '@/lib/firebase-helpers';
import AdminBackButton from '@/components/AdminBackButton';

interface Carnival {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image: string;
  status: 'upcoming' | 'past';
}

export default function AdminCarnivalsPage() {
  const [carnivals, setCarnivals] = useState<Carnival[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarnival, setEditingCarnival] = useState<Carnival | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    image: '',
    status: 'upcoming' as 'upcoming' | 'past',
  });

  useEffect(() => {
    fetchCarnivals();
  }, []);

  const fetchCarnivals = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'carnivals'));
      const carnivalsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Carnival[];
      setCarnivals(carnivalsData);
    } catch (error) {
      console.error('Error fetching carnivals:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `carnivals/${Date.now()}_${file.name}`;
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
      if (editingCarnival) {
        // Update existing carnival
        await updateDoc(doc(db, 'carnivals', editingCarnival.id), formData);
      } else {
        // Add new carnival
        await addDoc(collection(db, 'carnivals'), {
          ...formData,
          createdAt: new Date(),
        });
      }

      await fetchCarnivals();
      closeModal();
      alert(editingCarnival ? 'Festival güncellendi!' : 'Festival eklendi!');
    } catch (error) {
      console.error('Error saving carnival:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu festivali silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'carnivals', id));
      await fetchCarnivals();
      alert('Festival silindi!');
    } catch (error) {
      console.error('Error deleting carnival:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const openModal = (carnival?: Carnival) => {
    if (carnival) {
      setEditingCarnival(carnival);
      setFormData({
        name: carnival.name,
        date: carnival.date,
        location: carnival.location,
        description: carnival.description,
        image: carnival.image,
        status: carnival.status,
      });
    } else {
      setEditingCarnival(null);
      setFormData({
        name: '',
        date: '',
        location: '',
        description: '',
        image: '',
        status: 'upcoming',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCarnival(null);
    setFormData({
      name: '',
      date: '',
      location: '',
      description: '',
      image: '',
      status: 'upcoming',
    });
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminBackButton />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Festival Yönetimi
            </h1>
            <p className="text-gray-400">
              Etkinlikleri ekleyin, düzenleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Festival Ekle
          </button>
        </div>

        {/* Carnivals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carnivals.map((carnival, index) => (
            <motion.div
              key={carnival.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-zinc-800 flex items-center justify-center relative">
                {carnival.image ? (
                  <img
                    src={carnival.image}
                    alt={carnival.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-white">Görsel Yok</p>
                )}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                    carnival.status === 'upcoming'
                      ? 'bg-green-500 bg-opacity-20 text-green-500'
                      : 'bg-gray-500 bg-opacity-20 text-gray-400'
                  }`}
                >
                  {carnival.status === 'upcoming' ? 'Yakında' : 'Geçmiş'}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  {carnival.name}
                </h3>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={16} />
                    <span>{carnival.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <MapPin size={16} />
                    <span>{carnival.location}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {carnival.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(carnival)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-mea-gold bg-opacity-20 text-mea-gold rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Edit size={16} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(carnival.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {carnivals.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">
              Henüz Festival Yok
            </h2>
            <p className="text-gray-400 mb-8">
              Yeni festival eklemek için yukarıdaki butona tıklayın
            </p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingCarnival ? 'Festival Düzenle' : 'Yeni Festival Ekle'}
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
                    Festival Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="admin-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Tarih
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      placeholder="15-20 Haziran 2024"
                      className="admin-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Konum
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="İstanbul, Türkiye"
                      className="admin-input"
                      required
                    />
                  </div>
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
                    className="admin-input"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'upcoming' | 'past',
                      })
                    }
                    className="admin-input"
                    required
                  >
                    <option value="upcoming">Yakında</option>
                    <option value="past">Geçmiş</option>
                  </select>
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
