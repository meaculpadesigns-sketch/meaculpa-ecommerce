'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById, updateUser } from '@/lib/firebase-helpers';
import { User } from '@/types';
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  isDefault: boolean;
}

export default function CardsPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    isDefault: false,
  });

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
        if (userData) {
          setUser(userData);
          setCards(userData.cards || []);
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

  const openModal = (card?: Card) => {
    if (card) {
      setEditingCard(card);
      setFormData({
        cardNumber: card.cardNumber,
        cardHolder: card.cardHolder,
        expiryDate: card.expiryDate,
        cvv: '',
        isDefault: card.isDefault,
      });
    } else {
      setEditingCard(null);
      setFormData({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        isDefault: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCard(null);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cardNumber: formatCardNumber(value) });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setFormData({ ...formData, expiryDate: value });
  };

  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      alert(t('profile.invalidCardNumber'));
      return;
    }

    setSaving(true);
    try {
      let updatedCards: Card[];

      if (editingCard) {
        // Update existing card
        updatedCards = cards.map((card) =>
          card.id === editingCard.id
            ? {
                id: card.id,
                cardNumber: formData.cardNumber,
                cardHolder: formData.cardHolder,
                expiryDate: formData.expiryDate,
                isDefault: formData.isDefault,
              }
            : card
        );
      } else {
        // Add new card
        const newCard: Card = {
          id: Date.now().toString(),
          cardNumber: formData.cardNumber,
          cardHolder: formData.cardHolder,
          expiryDate: formData.expiryDate,
          isDefault: formData.isDefault,
        };
        updatedCards = [...cards, newCard];
      }

      // If this card is set as default, remove default from others
      if (formData.isDefault) {
        updatedCards = updatedCards.map((card) => ({
          ...card,
          isDefault: card.id === (editingCard?.id || updatedCards[updatedCards.length - 1].id),
        }));
      }

      await updateUser(user.id, { cards: updatedCards });
      setCards(updatedCards);
      closeModal();
      alert(i18n.language === 'tr' ? 'Kartınız başarıyla kaydedildi!' : 'Your card has been saved successfully!');
    } catch (error) {
      console.error('Error saving card:', error);
      alert(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cardId: string) => {
    if (!user || !confirm(t('profile.confirmDelete'))) return;

    try {
      const updatedCards = cards.filter((card) => card.id !== cardId);
      await updateUser(user.id, { cards: updatedCards });
      setCards(updatedCards);
      alert(t('profile.deleted'));
    } catch (error) {
      console.error('Error deleting card:', error);
      alert(t('common.error'));
    }
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return '**** **** **** ' + cleaned.slice(-4);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-black dark:text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-black dark:text-white hover:text-black dark:text-white transition-colors mb-4">
            <ArrowLeft size={20} />
            {t('profile.backToProfile')}
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="text-yellow-500" size={32} />
              <h1 className="text-4xl font-bold text-black dark:text-white">{t('profile.cards')}</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              {t('profile.addCard')}
            </button>
          </div>
          <p className="text-black dark:text-white mt-2">{t('profile.savedCards')}</p>
        </div>

        {/* Cards Grid */}
        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <CreditCard className="mx-auto mb-6 text-black dark:text-white" size={80} />
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              {t('profile.noCards')}
            </h2>
            <p className="text-black dark:text-white mb-8">
              {t('profile.noCardsDesc')}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Credit Card Design */}
                <div className="relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl">
                  {card.isDefault && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold text-xs font-medium">
                      {t('profile.default')}
                    </span>
                  )}

                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <CreditCard className="text-mea-gold mb-4" size={40} />
                    </div>

                    <div>
                      <p className="text-black dark:text-white text-xl font-mono mb-4 tracking-wider">
                        {maskCardNumber(card.cardNumber)}
                      </p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-black dark:text-white text-xs mb-1">{t('profile.cardHolder')}</p>
                          <p className="text-black dark:text-white font-medium uppercase">{card.cardHolder}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-black dark:text-white text-xs mb-1">{t('profile.expiryDate')}</p>
                          <p className="text-black dark:text-white font-medium">{card.expiryDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openModal(card)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors text-black dark:text-white"
                  >
                    <Edit size={16} />
                    {t('profile.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Security Notice */}
        <div className="glass rounded-xl p-4 text-black dark:text-white text-sm mt-6">
          <p>🔒 {t('profile.cardSecurity')}</p>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4" style={{ backgroundColor: 'rgba(75, 85, 99, 0.75)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-8 max-w-md w-full"
              style={{ backgroundColor: '#374151', border: '1px solid #4B5563' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {editingCard ? t('profile.editCard') : t('profile.addCard')}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-black dark:text-white hover:text-black dark:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">{t('profile.cardNumber')}</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="input-field font-mono"
                    maxLength={19}
                  />
                </div>

                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">{t('profile.cardHolder')}</label>
                  <input
                    type="text"
                    value={formData.cardHolder}
                    onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value.toUpperCase() })}
                    placeholder="AD SOYAD"
                    className="input-field uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">{t('profile.expiryDate')}</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      className="input-field font-mono"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 3) {
                          setFormData({ ...formData, cvv: value });
                        }
                      }}
                      placeholder="123"
                      className="input-field font-mono"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-black dark:text-white font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-4 h-4"
                    />
                    {t('profile.setAsDefault')}
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {saving ? t('profile.saving') : t('profile.save')}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 btn-secondary"
                  >
                    {t('profile.cancel')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
