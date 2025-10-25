'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Upload, Send } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { uploadFile } from '@/lib/firebase-helpers';

export default function ShareStoryPage() {
  const [formData, setFormData] = useState({
    productName: '',
    story: '',
    name: '',
    email: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';

      if (image) {
        setUploading(true);
        const path = `stories/${Date.now()}_${image.name}`;
        imageUrl = await uploadFile(image, path);
        setUploading(false);
      }

      const user = auth.currentUser;

      await addDoc(collection(db, 'stories'), {
        ...formData,
        imageUrl,
        userId: user?.uid || null,
        createdAt: new Date(),
        approved: false,
      });

      alert('Hikayen başarıyla gönderildi! İncelendikten sonra yayınlanacak.');
      setFormData({ productName: '', story: '', name: '', email: '' });
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error submitting story:', error);
      alert('Hikaye gönderilirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Heart className="mx-auto mb-4 text-mea-gold" size={60} />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Hikayeni Paylaş
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Mea Culpa ürününle yaşadığın özel anları, deneyimlerini ve hikayeni bizimle paylaş
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-white font-medium mb-3">
                Fotoğraf (Opsiyonel)
              </label>
              {imagePreview ? (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview('');
                    }}
                    className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Kaldır
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-600 rounded-xl hover:border-mea-gold transition-colors cursor-pointer">
                  <Upload className="text-gray-600 mb-4" size={48} />
                  <p className="text-white mb-2">Fotoğraf Yükle</p>
                  <p className="text-gray-400 text-sm">Ürününle çekilmiş bir fotoğrafını paylaş</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                Ürün Adı *
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className="input-field"
                placeholder="Hangi Mea Culpa ürününü kullandın?"
                required
              />
            </div>

            {/* Story */}
            <div>
              <label className="block text-white font-medium mb-2">
                Hikayen *
              </label>
              <textarea
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                className="input-field"
                rows={8}
                placeholder="Bu ürünle yaşadığın özel anları, nasıl hissettiğini veya sana ne ifade ettiğini anlat..."
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Minimum 50 karakter
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-white font-medium mb-2">
                Adın *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Tam adın veya takma adın"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                E-posta *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="ornek@email.com"
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Hikayen onaylandığında sana bildirmek için
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading || formData.story.length < 50}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              <Send size={24} />
              {uploading ? 'Fotoğraf Yükleniyor...' : loading ? 'Gönderiliyor...' : 'Hikayeni Gönder'}
            </button>

            <p className="text-gray-400 text-sm text-center">
              Gönderdiğin hikaye incelendikten sonra sitemizde yayınlanacak
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}