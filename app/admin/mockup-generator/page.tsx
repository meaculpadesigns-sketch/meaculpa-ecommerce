'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Wand2, Download, X, Plus, Trash2 } from 'lucide-react';

export default function AdminMockupGeneratorPage() {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert('Maksimum 10 fotoğraf yükleyebilirsiniz');
      return;
    }

    setImages([...images, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const generateMockup = async () => {
    if (images.length === 0) {
      alert('Lütfen en az bir fotoğraf yükleyin');
      return;
    }

    if (!prompt.trim()) {
      alert('Lütfen bir prompt girin');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);

    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });
      formData.append('prompt', prompt);

      const response = await fetch('/api/generate-mockup', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mock-up oluşturma başarısız');
      }

      setGeneratedImage(data.imageUrl);
      if (data.description) {
        alert('Mock-up önerisi:\n\n' + data.description);
      }
    } catch (error: any) {
      console.error('Error generating mockup:', error);
      alert('Hata: ' + (error.message || 'Mock-up oluşturulurken bir hata oluştu'));
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `meaculpa-mockup-${Date.now()}.png`;
    link.click();
  };

  const reset = () => {
    setImages([]);
    setImagePreviews([]);
    setPrompt('');
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            AI Mock-up Oluşturucu
          </h1>
          <p className="text-gray-400">
            Gemini AI ile tasarımlarınızın mock-up'larını oluşturun
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Inputs */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Fotoğraflar ({images.length}/10)
              </h3>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800">
                    <img
                      src={preview}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}

                {images.length < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-600 hover:border-mea-gold transition-colors cursor-pointer flex flex-col items-center justify-center">
                    <Plus size={32} className="text-gray-600 mb-2" />
                    <span className="text-xs text-gray-600">Ekle</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>

              {images.length === 0 && (
                <label className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-600 rounded-lg hover:border-mea-gold transition-colors cursor-pointer">
                  <Upload size={48} className="text-gray-600 mb-4" />
                  <p className="text-white font-medium mb-2">
                    Fotoğraf Yükle
                  </p>
                  <p className="text-gray-400 text-sm text-center">
                    Tasarımlarınızın fotoğraflarını sürükleyin veya tıklayarak seçin
                    <br />
                    (Maksimum 10 fotoğraf)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Prompt Input */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Prompt (İstek)
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Mock-up'ın nasıl olmasını istediğinizi detaylı olarak açıklayın. Örneğin: 'Bu kimononun mockupını oluştur, arka plan minimalist beyaz olsun, ürün ortada ve hafif gölgeli görünsün'"
                className="input-field"
                rows={8}
              />

              <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">
                  <strong className="text-white">Örnek Promptlar:</strong>
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• "Profesyonel e-ticaret fotoğrafı oluştur, beyaz arka plan"</li>
                  <li>• "Instagram için stil çekimi, doğal ışıklandırma"</li>
                  <li>• "Katalog fotoğrafı, ürün detayları net görünsün"</li>
                  <li>• "Lifestyle çekim, bohem tarzda dekorasyon ile"</li>
                </ul>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateMockup}
              disabled={loading || images.length === 0 || !prompt.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
            >
              <Wand2 size={24} />
              {loading ? 'Oluşturuluyor...' : 'Mock-up Oluştur'}
            </button>

            {images.length > 0 && (
              <button
                onClick={reset}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Trash2 size={20} />
                Temizle
              </button>
            )}
          </div>

          {/* Right Side - Result */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Sonuç
            </h3>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-mea-gold border-t-transparent mb-4"></div>
                <p className="text-white font-medium">AI mock-up oluşturuyor...</p>
                <p className="text-gray-400 text-sm mt-2">Bu birkaç dakika sürebilir</p>
              </div>
            )}

            {!loading && !generatedImage && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Wand2 size={64} className="text-gray-600 mb-4" />
                <p className="text-white font-medium mb-2">
                  Henüz Mock-up Oluşturulmadı
                </p>
                <p className="text-gray-400 text-sm">
                  Fotoğraf yükleyin ve prompt girerek AI ile mock-up oluşturun
                </p>
              </div>
            )}

            {generatedImage && !loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-zinc-800">
                  <img
                    src={generatedImage}
                    alt="Generated Mockup"
                    className="w-full h-full object-contain"
                  />
                </div>

                <button
                  onClick={downloadImage}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  İndir
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}