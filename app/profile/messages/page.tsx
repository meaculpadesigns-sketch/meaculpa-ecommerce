'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById, createMessage } from '@/lib/firebase-helpers';
import { motion } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function MessagesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userData = await getUserById(authUser.uid);
        if (!userData) {
          router.push('/login');
        } else {
          setCurrentUser(userData);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    setSending(true);
    try {
      const messageData = {
        type: 'support' as const,
        name: currentUser.name || currentUser.email,
        email: currentUser.email,
        phone: currentUser.phone || '',
        message: message.trim(),
        read: false,
        createdAt: new Date(),
      };

      console.log('📧 Sending message with data:', messageData);

      const messageId = await createMessage(messageData);

      console.log('✅ Message sent successfully with ID:', messageId);

      // Add message to local state for immediate feedback
      setMessages([...messages, {
        text: message.trim(),
        timestamp: new Date(),
        isAdmin: false,
      }]);

      setMessage('');
      alert(t('profile.messageSent') || 'Mesajınız gönderildi! Admin panelinde "Destek" filtresinde görünecek.');
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert(t('common.error') || 'Mesaj gönderilirken bir hata oluştu: ' + (error as Error).message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">{t('common.loading')}</div>
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
            {t('profile.backToProfile')}
          </Link>
          <h1 className="text-4xl font-bold text-white">{t('profile.messagesTitle')}</h1>
          <p className="text-gray-400 mt-2">{t('profile.messagesDesc')}</p>
        </div>

        {/* Messages Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          {/* Messages List */}
          <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p>{t('profile.noMessages')}</p>
                <p className="text-sm mt-2">{t('profile.noMessagesDesc')}</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.isAdmin
                        ? 'bg-zinc-800 text-white'
                        : 'bg-mea-gold text-black'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {new Date(msg.timestamp).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
              placeholder={t('profile.typeMessage')}
              className="flex-1 input-field"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </motion.div>

        {/* Info */}
        <div className="glass rounded-xl p-4 text-gray-400 text-sm">
          <p>💬 {t('profile.messagesInfo')}</p>
          <p className="mt-2">⏰ {t('profile.avgResponseTime')}</p>
        </div>
      </div>
    </div>
  );
}
