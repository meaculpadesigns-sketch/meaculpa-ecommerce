'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById, updateUser } from '@/lib/firebase-helpers';
import { User } from '@/types';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BodyInfoPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    gender: 'female' as 'male' | 'female' | 'other',
    chestSize: '',
    waistSize: '',
    hipSize: '',
    shoeSize: '',
  });

  useEffect(() => {
    document.body.className = 'bg-home';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userData = await getUserById(authUser.uid);
        if (userData) {
          setUser(userData);
          // Load existing body info if available
          if (userData.bodyInfo) {
            setFormData({
              height: userData.bodyInfo.height || '',
              weight: userData.bodyInfo.weight || '',
              gender: userData.bodyInfo.gender || 'female',
              chestSize: userData.bodyInfo.chestSize || '',
              waistSize: userData.bodyInfo.waistSize || '',
              hipSize: userData.bodyInfo.hipSize || '',
              shoeSize: userData.bodyInfo.shoeSize || '',
            });
          }
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUser(user.id, {
        bodyInfo: formData,
      });
      alert('Beden bilgileriniz kaydedildi!');
    } catch (error) {
      console.error('Error saving body info:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
            <ArrowLeft size={20} />
            Profil
          </Link>
          <h1 className="text-4xl font-bold text-white">Beden Bilgilerim</h1>
          <p className="text-gray-400 mt-2">Özel tasarımlar için beden bilgilerinizi kaydedin</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender */}
            <div className="md:col-span-2">
              <label className="block text-white font-medium mb-3">Cinsiyet</label>
              <div className="flex gap-4">
                {[
                  { value: 'female', label: 'Kadın' },
                  { value: 'male', label: 'Erkek' },
                  { value: 'other', label: 'Diğer' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, gender: option.value as any })}
                    className={`px-6 py-3 rounded-lg transition-all ${
                      formData.gender === option.value
                        ? 'bg-mea-gold text-black font-semibold'
                        : 'glass hover:bg-white hover:bg-opacity-10 text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-white font-medium mb-2">Boy (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="Örn: 170"
                className="input-field w-full"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-white font-medium mb-2">Kilo (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Örn: 65"
                className="input-field w-full"
              />
            </div>

            {/* Chest Size */}
            <div>
              <label className="block text-white font-medium mb-2">Göğüs Çevresi (cm)</label>
              <input
                type="number"
                value={formData.chestSize}
                onChange={(e) => setFormData({ ...formData, chestSize: e.target.value })}
                placeholder="Örn: 90"
                className="input-field w-full"
              />
            </div>

            {/* Waist Size */}
            <div>
              <label className="block text-white font-medium mb-2">Bel Çevresi (cm)</label>
              <input
                type="number"
                value={formData.waistSize}
                onChange={(e) => setFormData({ ...formData, waistSize: e.target.value })}
                placeholder="Örn: 70"
                className="input-field w-full"
              />
            </div>

            {/* Hip Size */}
            <div>
              <label className="block text-white font-medium mb-2">Kalça Çevresi (cm)</label>
              <input
                type="number"
                value={formData.hipSize}
                onChange={(e) => setFormData({ ...formData, hipSize: e.target.value })}
                placeholder="Örn: 95"
                className="input-field w-full"
              />
            </div>

            {/* Shoe Size */}
            <div>
              <label className="block text-white font-medium mb-2">Ayakkabı Numarası</label>
              <input
                type="number"
                value={formData.shoeSize}
                onChange={(e) => setFormData({ ...formData, shoeSize: e.target.value })}
                placeholder="Örn: 38"
                className="input-field w-full"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </motion.div>

        {/* Info */}
        <div className="glass rounded-xl p-4 text-gray-400 text-sm mt-6">
          <p>📏 Bu bilgiler, size özel tasarımlarımızda kullanılacaktır.</p>
          <p className="mt-2">🔒 Beden bilgileriniz güvenle saklanır ve sadece sizin için kullanılır.</p>
        </div>
      </div>
    </div>
  );
}
