'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram } from 'lucide-react';
import { createMessage } from '@/lib/firebase-helpers';
import { useTranslation } from 'react-i18next';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.className = 'bg-contact';
    return () => {
      document.body.className = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createMessage({
        type: 'contact',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        read: false,
        createdAt: new Date(),
      });

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t('contact.errorMessage'));
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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-gray-400">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('contact.sendMessage')}
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                  <p className="text-green-500">
                    {t('contact.successMessage')}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white mb-2">{t('contact.name')} *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">{t('contact.email')} *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">{t('contact.message')} *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input-field"
                    rows={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    t('contact.sending')
                  ) : (
                    <>
                      <Send size={20} />
                      {t('contact.send')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Contact */}
            <div className="glass rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {t('contact.contactInfo')}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mea-gold rounded-xl flex-shrink-0">
                    <Mail className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">{t('contact.email')}</p>
                    <a
                      href="mailto:meaculpadesigns@gmail.com"
                      className="text-gray-400 hover:text-mea-gold transition-colors"
                    >
                      meaculpadesigns@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mea-gold rounded-xl flex-shrink-0">
                    <Phone className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">{t('contact.phone')}</p>
                    <a
                      href="tel:+905075620802"
                      className="text-gray-400 hover:text-mea-gold transition-colors"
                    >
                      +90 507 562 08 02
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mea-gold rounded-xl flex-shrink-0">
                    <Instagram className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Instagram</p>
                    <a
                      href="https://www.instagram.com/meaculpadesigns"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-mea-gold transition-colors"
                    >
                      @meaculpadesigns
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mea-gold rounded-xl flex-shrink-0">
                    <MapPin className="text-black" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">{t('contact.address')}</p>
                    <p className="text-gray-400">
                      Yurt mah. 71329 sk. Erkam Apt.<br />
                      Kat: 8 No: 16<br />
                      Çukurova/ADANA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                {t('contact.workingHours')}
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>{t('contact.mondayFriday')}</span>
                  <span className="text-white">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('contact.saturday')}</span>
                  <span className="text-white">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('contact.sunday')}</span>
                  <span className="text-red-400">{t('contact.closed')}</span>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="glass rounded-2xl p-8 bg-mea-gold bg-opacity-10">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('contact.faqTitle')}
              </h3>
              <p className="text-gray-300 mb-4">
                {t('contact.faqDesc')}
              </p>
              <a href="/faq" className="btn-secondary inline-block">
                {t('contact.goToFaq')}
              </a>
            </div>
          </motion.div>
        </div>

        {/* Live Chat Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center glass rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {t('contact.instantHelp')}
          </h3>
          <p className="text-gray-300 mb-6">
            {t('contact.instantHelpDesc')}
          </p>
          <a
            href="https://www.instagram.com/meaculpadesigns"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Instagram size={20} />
            {t('contact.sendInstagram')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
