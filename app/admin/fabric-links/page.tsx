'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadFile } from '@/lib/firebase-helpers';
import AdminBackButton from '@/components/AdminBackButton';

interface FabricLink {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string;
  supplier: string;
  color: string;
  material: string;
  price?: number;
  createdAt: Date;
}

export default function AdminFabricLinksPage() {
  const [fabrics, setFabrics] = useState<FabricLink[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<FabricLink | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    image: '',
    supplier: '',
    color: '',
    material: '',
    price: 0,
  });

  useEffect(() => {
    fetchFabrics();
  }, []);

  const fetchFabrics = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'fabric-links'));
      const fabricsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FabricLink[];
      setFabrics(fabricsData);
    } catch (error) {
      console.error('Error fetching fabrics:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const path = `fabrics/${Date.now()}_${file.name}`;
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
      if (editingFabric) {
        await updateDoc(doc(db, 'fabric-links', editingFabric.id), formData);
      } else {
        await addDoc(collection(db, 'fabric-links'), {
          ...formData,
          createdAt: new Date(),
        });
      }

      await fetchFabrics();
      closeModal();
      alert(editingFabric ? 'Kumaş linki güncellendi!' : 'Kumaş linki eklendi!');
    } catch (error) {
      console.error('Error saving fabric:', error);
      alert('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kumaş linkini silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'fabric-links', id));
      await fetchFabrics();
      alert('Kumaş linki silindi!');
    } catch (error) {
      console.error('Error deleting fabric:', error);
      alert('Silme işlemi başarısız');
    }
  };

  const openModal = (fabric?: FabricLink) => {
    if (fabric) {
      setEditingFabric(fabric);
      setFormData({
        name: fabric.name,
        description: fabric.description,
        url: fabric.url,
        image: fabric.image,
        supplier: fabric.supplier,
        color: fabric.color,
        material: fabric.material,
        price: fabric.price || 0,
      });
    } else {
      setEditingFabric(null);
      setFormData({
        name: '',
        description: '',
        url: '',
        image: '',
        supplier: '',
        color: '',
        material: '',
        price: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFabric(null);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminBackButton />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              Kumaş Linkleri Yönetimi
            </h1>
            <p className="text-black dark:text-white">
              Sipariş edilen kumaşların linklerini ekleyin ve yönetin
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Kumaş Linki Ekle
          </button>
        </div>

        {/* Fabrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fabrics.map((fabric, index) => (
            <motion.div
              key={fabric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="aspect-video bg-zinc-800 flex items-center justify-center relative">
                {fabric.image ? (
                  <img
                    src={fabric.image}
                    alt={fabric.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="text-gray-600" size={60} />
                )}
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {fabric.name}
                </h3>

                <div className="space-y-1 mb-3 text-sm">
                  <p className="text-black dark:text-white">
                    <span className="text-mea-gold">Tedarikçi:</span> {fabric.supplier}
                  </p>
                  <p className="text-black dark:text-white">
                    <span className="text-mea-gold">Renk:</span> {fabric.color}
                  </p>
                  <p className="text-black dark:text-white">
                    <span className="text-mea-gold">Malzeme:</span> {fabric.material}
                  </p>
                  {fabric.price && fabric.price > 0 && (
                    <p className="text-black dark:text-white">
                      <span className="text-mea-gold">Fiyat:</span> ₺{fabric.price}
                    </p>
                  )}
                </div>

                <p className="text-black dark:text-white text-sm mb-4 line-clamp-2">
                  {fabric.description}
                </p>

                <a
                  href={fabric.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-mea-gold hover:underline text-sm mb-4"
                >
                  <LinkIcon size={16} />
                  Linki Görüntüle
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(fabric)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-mea-gold bg-opacity-20 text-mea-gold rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Edit size={16} />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(fabric.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {fabrics.length === 0 && (
          <div className="text-center py-20">
            <LinkIcon className="mx-auto mb-6 text-black dark:text-white" size={80} />
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              Henüz Kumaş Linki Yok
            </h2>
            <p className="text-black dark:text-white mb-8">
              Yeni kumaş linki eklemek için yukarıdaki butona tıklayın
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
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {editingFabric ? 'Kumaş Linki Düzenle' : 'Yeni Kumaş Linki Ekle'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-black dark:text-white hover:text-black dark:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">
                    Kumaş Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="admin-input"
                    placeholder="Örn: İpek Saten Kumaş"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">
                      Tedarikçi
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      className="admin-input"
                      placeholder="Tedarikçi adı"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">
                      Renk
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="admin-input"
                      placeholder="Renk"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">
                      Malzeme
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) =>
                        setFormData({ ...formData, material: e.target.value })
                      }
                      className="admin-input"
                      placeholder="Örn: %100 İpek"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">
                      Fiyat (₺) - Opsiyonel
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                      className="admin-input"
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="admin-input"
                    rows={3}
                    placeholder="Kumaş hakkında notlar..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">
                    Link (URL)
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="admin-input"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">
                    Kumaş Görseli
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
