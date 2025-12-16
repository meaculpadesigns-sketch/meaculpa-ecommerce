'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, LogIn } from 'lucide-react';
import { authenticateAdmin } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await authenticateAdmin(username, password);

      if (success) {
        router.push('/admin');
      } else {
        setError('Kullanıcı adı veya şifre hatalı');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-mea-gold rounded-full mb-4">
              <Lock className="text-black" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Admin Girişi</h1>
            <p className="text-black dark:text-white">Mea Culpa Yönetim Paneli</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg"
            >
              <p className="text-red-500 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-black dark:text-white font-medium mb-2">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="text-black dark:text-white" size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı girin"
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800 bg-opacity-50 border border-zinc-700 rounded-lg text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-mea-gold transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-black dark:text-white font-medium mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="text-black dark:text-white" size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  className="w-full pl-12 pr-4 py-3 bg-zinc-800 bg-opacity-50 border border-zinc-700 rounded-lg text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-mea-gold transition-colors"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Giriş Yap
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Yetkili admin personel girişi
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
