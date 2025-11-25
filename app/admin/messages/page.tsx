'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, Instagram, Trash2, Eye, Search, Filter } from 'lucide-react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'contact' | 'order' | 'support' | 'other';
  message: string;
  createdAt: Date;
  read: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'contact' | 'order' | 'support' | 'other'>('all');
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, filterType, filterRead]);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    if (searchTerm) {
      filtered = filtered.filter(
        msg =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(msg => msg.type === filterType);
    }

    if (filterRead === 'read') {
      filtered = filtered.filter(msg => msg.read);
    } else if (filterRead === 'unread') {
      filtered = filtered.filter(msg => !msg.read);
    }

    setFilteredMessages(filtered);
  };

  const markAsRead = async (messageId: string) => {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        read: true,
      });
      await fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'messages', messageId));
      await fetchMessages();
      setSelectedMessage(null);
      alert('Mesaj silindi!');
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Mesaj silinirken hata oluştu');
    }
  };

  const openMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      await markAsRead(message.id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contact':
        return <Mail size={20} />;
      case 'order':
        return <MessageSquare size={20} />;
      case 'support':
        return <Phone size={20} />;
      default:
        return <MessageSquare size={20} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contact':
        return 'İletişim';
      case 'order':
        return 'Sipariş';
      case 'support':
        return 'Destek';
      default:
        return 'Diğer';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.read).length,
    contact: messages.filter(m => m.type === 'contact').length,
    order: messages.filter(m => m.type === 'order').length,
    support: messages.filter(m => m.type === 'support').length,
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mesajlar</h1>
          <p className="text-gray-400">Müşteri mesajlarını görüntüleyin ve yanıtlayın</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Toplam</p>
            <p className="text-white text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Okunmamış</p>
            <p className="text-mea-gold text-2xl font-bold">{stats.unread}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">İletişim</p>
            <p className="text-white text-2xl font-bold">{stats.contact}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Sipariş</p>
            <p className="text-white text-2xl font-bold">{stats.order}</p>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Destek</p>
            <p className="text-white text-2xl font-bold">{stats.support}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Mesaj ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="admin-input"
            >
              <option value="all">Tüm Tipler</option>
              <option value="contact">İletişim</option>
              <option value="order">Sipariş</option>
              <option value="support">Destek</option>
              <option value="other">Diğer</option>
            </select>

            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value as any)}
              className="admin-input"
            >
              <option value="all">Tümü</option>
              <option value="unread">Okunmamış</option>
              <option value="read">Okunmuş</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        <div className="glass rounded-2xl overflow-hidden">
          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="mx-auto mb-4 text-gray-600" size={60} />
              <p className="text-white text-xl">Mesaj bulunamadı</p>
              <p className="text-gray-400 mt-2">
                {searchTerm || filterType !== 'all' || filterRead !== 'all'
                  ? 'Filtreleri değiştirmeyi deneyin'
                  : 'Henüz mesaj yok'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openMessage(message)}
                  className={`p-6 hover:bg-white hover:bg-opacity-5 cursor-pointer transition-colors ${
                    !message.read ? 'bg-mea-gold bg-opacity-5' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-white bg-opacity-10 rounded-xl">
                        {getTypeIcon(message.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-semibold">{message.name}</h3>
                          {!message.read && (
                            <span className="px-2 py-1 bg-mea-gold text-black text-xs font-semibold rounded-full">
                              YENİ
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{message.email}</p>
                        <p className="text-gray-300 line-clamp-2">{message.message}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-sm text-gray-400">
                        {message.createdAt.toLocaleDateString('tr-TR')}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{getTypeLabel(message.type)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white bg-opacity-10 rounded-xl">
                    {getTypeIcon(selectedMessage.type)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedMessage.name}</h2>
                    <p className="text-gray-400">{getTypeLabel(selectedMessage.type)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">E-posta</p>
                  <p className="text-white">{selectedMessage.email}</p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Telefon</p>
                    <p className="text-white">{selectedMessage.phone}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-400 text-sm mb-1">Tarih</p>
                  <p className="text-white">
                    {selectedMessage.createdAt.toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Mesaj</p>
                  <div className="glass rounded-xl p-4">
                    <p className="text-white whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/meaculpa.tr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Instagram size={20} />
                  Instagram'dan Yanıtla
                </a>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="px-6 py-3 bg-red-500 bg-opacity-20 text-red-500 rounded-xl hover:bg-opacity-30 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={20} />
                  Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}