'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { createDesignRequest, uploadFile } from '@/lib/firebase-helpers';
import { motion } from 'framer-motion';
import { Upload, FileText, Image as ImageIcon, Send } from 'lucide-react';

export default function DesignRequestPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [requestType, setRequestType] = useState<'text' | 'image'>('text');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = 'bg-about';
    return () => {
      document.body.className = '';
    };
  }, []);

  // Guest info
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const path = `design-requests/${Date.now()}_${file.name}`;
        const url = await uploadFile(file, path);
        return url;
      });

      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(t('common.error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !phone) {
        alert(t('contact.errorMessage'));
        setLoading(false);
        return;
      }

      if (requestType === 'text' && !description) {
        alert(t('common.error'));
        setLoading(false);
        return;
      }

      if (requestType === 'image' && images.length === 0) {
        alert(t('common.error'));
        setLoading(false);
        return;
      }

      const { requestNumber } = await createDesignRequest({
        type: requestType,
        description: requestType === 'text' ? description : undefined,
        images: requestType === 'image' ? images : undefined,
        status: 'pending',
        guestEmail: email,
        guestPhone: phone,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Show success message
      alert(`${t('designRequest.successMessage')} ${requestNumber}`);

      // Redirect to tracking page
      router.push(`/design-request/track?number=${requestNumber}&contact=${email}`);
    } catch (error) {
      console.error('Error creating design request:', error);
      alert(t('common.error'));
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
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t('designRequest.title')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('designRequest.subtitle')}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Request Type Selection */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-black mb-6">
              {t('designRequest.selectType')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRequestType('text')}
                className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${
                  requestType === 'text'
                    ? 'bg-mea-gold text-black'
                    : 'glass text-black hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <FileText size={40} />
                <span className="font-semibold">{t('designRequest.textOption')}</span>
                <p className="text-sm opacity-80 text-center">
                  {t('designRequest.textOptionDesc')}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setRequestType('image')}
                className={`p-6 rounded-xl flex flex-col items-center gap-3 transition-all ${
                  requestType === 'image'
                    ? 'bg-mea-gold text-black'
                    : 'glass text-black hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <ImageIcon size={40} />
                <span className="font-semibold">{t('designRequest.imageOption')}</span>
                <p className="text-sm opacity-80 text-center">
                  {t('designRequest.imageOptionDesc')}
                </p>
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-black mb-6">
              {t('designRequest.contactInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.email')}
                className="input-field"
                required
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('auth.phone')}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Request Content */}
          {requestType === 'text' ? (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-black mb-6">
                {t('designRequest.designDescription')}
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('designRequest.designPlaceholder')}
                className="input-field"
                rows={10}
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                {t('designRequest.detailHelp')}
              </p>
            </div>
          ) : (
            <div className="glass rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-black mb-6">
                {t('designRequest.uploadTitle')}
              </h2>

              {/* Uploaded Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {images.map((url, index) => (
                    <div key={index} className="relative aspect-square bg-zinc-800 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-black"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                <Upload size={20} />
                {uploading ? t('designRequest.uploading') : t('designRequest.uploadBtn')}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  disabled={uploading}
                />
              </label>

              {/* Optional Description */}
              <div className="mt-6">
                <label className="block text-black font-medium mb-2">
                  {t('designRequest.additionalDesc')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('designRequest.additionalPlaceholder')}
                  className="input-field"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="glass rounded-2xl p-6 bg-mea-gold bg-opacity-10">
            <h3 className="text-black font-semibold mb-3">
              {t('designRequest.processTitle')}
            </h3>
            <ul className="text-gray-900 dark:text-gray-300 space-y-2 text-sm">
              <li>✓ {t('designRequest.processStep1')}</li>
              <li>✓ {t('designRequest.processStep2')}</li>
              <li>✓ {t('designRequest.processStep3')}</li>
              <li>✓ {t('designRequest.processStep4')}</li>
              <li>✓ {t('designRequest.processStep5')}</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              t('designRequest.sending')
            ) : (
              <>
                <Send size={24} />
                {t('designRequest.submit')}
              </>
            )}
          </button>
        </motion.form>

        {/* Tracking Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400">
            {t('designRequest.trackPrevious')}{' '}
            <a href="/design-request/track" className="text-mea-gold hover:underline">
              {t('designRequest.trackLink')}
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
