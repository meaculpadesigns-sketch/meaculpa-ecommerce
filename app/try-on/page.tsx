'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Sparkles, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getProducts } from '@/lib/firebase-helpers';
import { Product } from '@/types';

export default function TryOnPage() {
  const { t, i18n } = useTranslation();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-light text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    // Load ALL products from kimono and set categories
    const loadProducts = async () => {
      try {
        const allProducts = await getProducts();
        // Filter kimono and set products with images, don't limit to 12
        const productsWithImages = allProducts.filter(p =>
          (p.category === 'kimono' || p.category === 'set') &&
          p.images &&
          p.images.length > 0 &&
          !p.hidden // Exclude hidden products
        );
        setProducts(productsWithImages);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(i18n.language === 'tr' ? 'Görsel çok büyük. Maksimum 2MB olmalı.' : 'Image too large. Maximum 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Compress image if needed
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Resize if too large (max 800px width)
          const maxWidth = 800;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setUserImage(compressedBase64);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userImage || !selectedProduct) {
      alert(t('tryOn.bestResults'));
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
      alert(t('common.error'));
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
              {t('tryOn.title')}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {t('tryOn.subtitle')}
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
                1. {t('tryOn.step1Title')}
              </h2>

              {!userImage ? (
                <label className="block cursor-pointer">
                  <div className="aspect-[3/4] border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-mea-gold transition-colors">
                    <Upload className="text-gray-400 mb-4" size={48} />
                    <p className="text-white font-medium mb-2">{t('tryOn.uploadPhoto')}</p>
                    <p className="text-gray-400 text-sm">{t('tryOn.dragDrop')}</p>
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
                    <p className="text-white">{t('tryOn.uploadedPhoto')}</p>
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
                    <p className="font-medium mb-1">{t('tryOn.bestResults')}</p>
                    <ul className="space-y-1 text-xs">
                      <li>• {t('tryOn.tip1')}</li>
                      <li>• {t('tryOn.tip2')}</li>
                      <li>• {t('tryOn.tip3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Select Product */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                2. {t('tryOn.step2Title')}
              </h2>
              {loadingProducts ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-mea-gold border-t-transparent mx-auto"></div>
                  <p className="text-gray-400 mt-2">{t('common.loading')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <select
                    value={selectedProduct || ''}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-4 py-3 glass rounded-lg text-white bg-zinc-800 border border-gray-600 focus:border-mea-gold focus:outline-none"
                  >
                    <option value="" disabled>
                      {i18n.language === 'tr' ? 'Ürün seçiniz...' : 'Select a product...'}
                    </option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {i18n.language === 'tr' ? product.name : product.nameEn} ({product.category === 'kimono' ? 'Kimono' : 'Set'})
                      </option>
                    ))}
                  </select>

                  {/* Show selected product preview */}
                  {selectedProduct && (
                    <div className="mt-4">
                      {(() => {
                        const selected = products.find(p => p.id === selectedProduct);
                        return selected ? (
                          <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg border-2 border-mea-gold">
                            <img
                              src={selected.images[0]}
                              alt={i18n.language === 'tr' ? selected.name : selected.nameEn}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                              <p className="text-white font-semibold">
                                {i18n.language === 'tr' ? selected.name : selected.nameEn}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {selected.category === 'kimono' ? 'Kimono' : 'Set'}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}
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
                  {t('tryOn.processing')}
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  {t('tryOn.tryOnBtn')}
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
              3. {t('tryOn.step3Title')}
            </h2>

            {!result ? (
              <div className="aspect-[3/4] border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center">
                <Camera className="text-gray-400 mb-4" size={48} />
                <p className="text-gray-400 text-center px-4">
                  {t('tryOn.noResult')}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-zinc-800 rounded-xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-white">
                    {t('tryOn.tryOnResult')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="btn-primary">
                    {t('tryOn.liked')}
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="btn-secondary"
                  >
                    {t('tryOn.tryAgain')}
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
            {t('tryOn.howItWorksTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-3">
                1
              </div>
              <p className="text-white font-medium mb-2">{t('tryOn.howStep1Title')}</p>
              <p className="text-gray-400 text-sm">
                {t('tryOn.howStep1Desc')}
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-3">
                2
              </div>
              <p className="text-white font-medium mb-2">{t('tryOn.howStep2Title')}</p>
              <p className="text-gray-400 text-sm">
                {t('tryOn.howStep2Desc')}
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto mb-3">
                3
              </div>
              <p className="text-white font-medium mb-2">{t('tryOn.howStep3Title')}</p>
              <p className="text-gray-400 text-sm">
                {t('tryOn.howStep3Desc')}
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
            🔒 {t('tryOn.privacyNote')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
