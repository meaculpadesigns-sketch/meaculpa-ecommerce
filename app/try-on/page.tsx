'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Sparkles, AlertCircle } from 'lucide-react';

export default function TryOnPage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Sample products for try-on
  const products = [
    { id: '1', name: 'Geleneksel Kimono', image: '/images/kimono-1.jpg' },
    { id: '2', name: 'Modern Gömlek', image: '/images/shirt-1.jpg' },
    { id: '3', name: 'Özel Set', image: '/images/set-1.jpg' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userImage || !selectedProduct) {
      alert('Lütfen fotoğrafınızı yükleyin ve bir ürün seçin');
      return;
    }

    setLoading(true);
    try {
      // Call Gemini API for virtual try-on
      const response = await fetch('/api/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage,
          productId: selectedProduct,
        }),
      });

      const data = await response.json();
      setResult(data.resultImage);
    } catch (error) {
      console.error('Error during try-on:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="text-mea-gold" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Sanal Deneme
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Ürünlerimizi yapay zeka ile üzerinizde görün
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Upload Photo */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                1. Fotoğrafınızı Yükleyin
              </h2>

              {!userImage ? (
                <label className="block cursor-pointer">
                  <div className="aspect-[3/4] border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-mea-gold transition-colors">
                    <Upload className="text-gray-400 mb-4" size={48} />
                    <p className="text-white font-medium mb-2">Fotoğraf Yükle</p>
                    <p className="text-gray-400 text-sm">veya sürükleyip bırakın</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              ) : (
                <div className="relative aspect-[3/4] bg-zinc-800 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white">Yüklenen Fotoğraf</p>
                  </div>
                  <button
                    onClick={() => setUserImage(null)}
                    className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-500 bg-opacity-20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">En iyi sonuç için:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Tam boy fotoğraf kullanın</li>
                      <li>• Düz arka plan tercih edin</li>
                      <li>• İyi aydınlatılmış ortamda çekin</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Select Product */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. Ürün Seçin
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product.id)}
                    className={`aspect-square bg-zinc-800 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedProduct === product.id
                        ? 'border-mea-gold scale-105'
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-white text-xs p-2 text-center">
                      {product.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Try On Button */}
            <button
              onClick={handleTryOn}
              disabled={!userImage || !selectedProduct || loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  İşleniyor...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Dene
                </>
              )}
            </button>
          </motion.div>

          {/* Right Side - Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              3. Sonuç
            </h2>

            {!result ? (
              <div className="aspect-[3/4] border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center">
                <Camera className="text-gray-400 mb-4" size={48} />
                <p className="text-gray-400 text-center px-4">
                  Fotoğrafınızı yükleyin ve bir ürün seçin,<br />
                  sonuç burada görünecek
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-zinc-800 rounded-xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    Deneme Sonucu
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn-primary">
                    Beğendim
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="btn-secondary"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 glass rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Sanal Deneme Nasıl Çalışır?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-3">
                1
              </div>
              <p className="text-white font-medium mb-2">Fotoğraf Yükleyin</p>
              <p className="text-gray-400 text-sm">
                Tam boy bir fotoğrafınızı sisteme yükleyin
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-3">
                2
              </div>
              <p className="text-white font-medium mb-2">Ürün Seçin</p>
              <p className="text-gray-400 text-sm">
                Denemek istediğiniz ürünü katalogdan seçin
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-3">
                3
              </div>
              <p className="text-white font-medium mb-2">Sonucu Görün</p>
              <p className="text-gray-400 text-sm">
                AI teknolojisi ile ürünü üzerinizde görün
              </p>
            </div>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            🔒 Yüklediğiniz fotoğraflar güvenli bir şekilde işlenir ve saklanmaz
          </p>
        </motion.div>
      </div>
    </div>
  );
}
