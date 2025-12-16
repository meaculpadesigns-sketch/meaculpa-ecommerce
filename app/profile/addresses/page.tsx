'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById, updateUser } from '@/lib/firebase-helpers';
import { User, Address } from '@/types';
import { motion } from 'framer-motion';
import { MapPin, ArrowLeft, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function AddressesPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Turkey',
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
          setAddresses(userData.addresses || []);
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

  const openModal = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        title: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Turkey',
        isDefault: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      let updatedAddresses: Address[];

      if (editingAddress) {
        // Update existing address
        updatedAddresses = addresses.map((addr) =>
          addr.id === editingAddress.id ? { ...formData, id: addr.id } : addr
        );
      } else {
        // Add new address
        const newAddress = {
          ...formData,
          id: Date.now().toString(),
        };
        updatedAddresses = [...addresses, newAddress];
      }

      // If this address is set as default, remove default from others
      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === (editingAddress?.id || updatedAddresses[updatedAddresses.length - 1].id),
        }));
      }

      await updateUser(user.id, { addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      closeModal();
      alert(t('profile.saved'));
    } catch (error) {
      console.error('Error saving address:', error);
      alert(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    if (!user || !confirm(t('profile.confirmDelete'))) return;

    try {
      const updatedAddresses = addresses.filter((addr) => addr.id !== addressId);
      await updateUser(user.id, { addresses: updatedAddresses });
      setAddresses(updatedAddresses);
      alert(t('profile.deleted'));
    } catch (error) {
      console.error('Error deleting address:', error);
      alert(t('common.error'));
    }
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
              <MapPin className="text-purple-500" size={32} />
              <h1 className="text-4xl font-bold text-black dark:text-white">{t('profile.addresses')}</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              {t('profile.addAddress')}
            </button>
          </div>
          <p className="text-black dark:text-white mt-2">
            {addresses.length} {t('profile.address')}
          </p>
        </div>

        {/* Addresses Grid */}
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <MapPin className="mx-auto mb-6 text-black dark:text-white" size={80} />
            <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
              {t('profile.noAddresses')}
            </h2>
            <p className="text-black dark:text-white mb-8">
              {t('profile.noAddressesDesc')}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 relative"
              >
                {address.isDefault && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-mea-gold bg-opacity-20 text-mea-gold text-xs font-medium">
                    {t('profile.default')}
                  </span>
                )}

                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{address.title}</h3>
                <div className="space-y-2 text-black dark:text-white mb-4">
                  <p className="font-medium">{address.firstName} {address.lastName}</p>
                  <p>{address.phone}</p>
                  <p>{address.address}</p>
                  <p>{address.state} / {address.city}</p>
                  <p>{address.zipCode}{address.country && `, ${address.country}`}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(address)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-mea-gold bg-opacity-20 text-mea-gold rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Edit size={16} />
                    {t('profile.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 bg-opacity-20 text-red-500 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4" style={{ backgroundColor: 'rgba(75, 85, 99, 0.75)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              style={{ backgroundColor: '#374151', border: '1px solid #4B5563' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  {editingAddress ? t('profile.editAddress') : t('profile.addAddress')}
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
                  <label className="block text-black dark:text-white font-medium mb-2">{t('profile.addressTitle')}</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={t('profile.addressTitlePlaceholder')}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">{t('auth.firstName')}</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">{t('auth.lastName')}</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">{t('profile.phone')}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-black dark:text-white font-medium mb-2">{t('profile.address')}</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">{t('profile.city')}</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">
                      {i18n.language === 'tr' ? 'İl/Eyalet' : 'State/Province'}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">{t('profile.zipCode')}</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white font-medium mb-2">
                      {i18n.language === 'tr' ? 'Ülke' : 'Country'}
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="input-field"
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
