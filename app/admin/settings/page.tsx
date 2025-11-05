'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Globe,
  DollarSign,
  Truck,
  Bell,
  Shield,
  Save,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminSettingsPage() {
  const { t, i18n } = useTranslation();
  const isTurkish = i18n.language === 'tr';
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'shipping' | 'payment' | 'notifications'>('general');

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Mea Culpa',
    siteUrl: 'https://www.meaculpadesign.com',
    defaultLanguage: 'tr',
    maintenanceMode: false,
    allowRegistration: true,
  });

  const [contactSettings, setContactSettings] = useState({
    email: 'meaculpadesigns@gmail.com',
    phone: '+90 555 123 45 67',
    address: 'İstanbul, Türkiye',
    instagram: '@meaculpadesigns',
    workingHoursTR: 'Pazartesi-Cuma: 09:00-18:00',
    workingHoursEN: 'Monday-Friday: 09:00-18:00',
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 500,
    domesticShippingFee: 50,
    internationalShipping: true,
    estimatedDeliveryDays: '3-5',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCreditCard: true,
    acceptCrypto: true,
    acceptGooglePay: true,
    taxRate: 20,
    currency: 'TRY',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newOrderAlert: true,
    lowStockAlert: true,
    newReviewAlert: true,
  });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isTurkish ? 'Site Ayarları' : 'Site Settings'}
          </h1>
          <p className="text-gray-400">
            {isTurkish
              ? 'Genel site ayarlarını ve konfigürasyonları yönetin'
              : 'Manage general site settings and configurations'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'general'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <Settings className="inline mr-2" size={20} />
            {isTurkish ? 'Genel' : 'General'}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <Phone className="inline mr-2" size={20} />
            {isTurkish ? 'İletişim' : 'Contact'}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'shipping'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <Truck className="inline mr-2" size={20} />
            {isTurkish ? 'Kargo' : 'Shipping'}
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'payment'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <DollarSign className="inline mr-2" size={20} />
            {isTurkish ? 'Ödeme' : 'Payment'}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'bg-mea-gold text-black'
                : 'glass text-white hover:bg-zinc-800'
            }`}
          >
            <Bell className="inline mr-2" size={20} />
            {isTurkish ? 'Bildirimler' : 'Notifications'}
          </button>
        </div>

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {isTurkish ? 'Genel Ayarlar' : 'General Settings'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Site Adı' : 'Site Name'}
                </label>
                <input
                  type="text"
                  value={generalSettings.siteName}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Site URL' : 'Site URL'}
                </label>
                <input
                  type="text"
                  value={generalSettings.siteUrl}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Varsayılan Dil' : 'Default Language'}
                </label>
                <select
                  value={generalSettings.defaultLanguage}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, defaultLanguage: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {isTurkish ? 'Bakım Modu' : 'Maintenance Mode'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isTurkish
                      ? 'Siteyi ziyaretçilere kapalı tut'
                      : 'Close the site to visitors'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {isTurkish ? 'Kullanıcı Kayıt' : 'User Registration'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isTurkish
                      ? 'Yeni kullanıcıların kayıt olmasına izin ver'
                      : 'Allow new users to register'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generalSettings.allowRegistration}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, allowRegistration: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <button className="btn-primary flex items-center gap-2 w-full md:w-auto">
                <Save size={20} />
                {isTurkish ? 'Kaydet' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Contact Settings Tab */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {isTurkish ? 'İletişim Bilgileri' : 'Contact Information'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 flex items-center gap-2">
                  <Mail size={18} />
                  {isTurkish ? 'E-posta' : 'Email'}
                </label>
                <input
                  type="email"
                  value={contactSettings.email}
                  onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2 flex items-center gap-2">
                  <Phone size={18} />
                  {isTurkish ? 'Telefon' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={contactSettings.phone}
                  onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2 flex items-center gap-2">
                  <MapPin size={18} />
                  {isTurkish ? 'Adres' : 'Address'}
                </label>
                <input
                  type="text"
                  value={contactSettings.address}
                  onChange={(e) => setContactSettings({ ...contactSettings, address: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Instagram</label>
                <input
                  type="text"
                  value={contactSettings.instagram}
                  onChange={(e) => setContactSettings({ ...contactSettings, instagram: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Çalışma Saatleri (TR)' : 'Working Hours (TR)'}
                </label>
                <input
                  type="text"
                  value={contactSettings.workingHoursTR}
                  onChange={(e) => setContactSettings({ ...contactSettings, workingHoursTR: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Çalışma Saatleri (EN)' : 'Working Hours (EN)'}
                </label>
                <input
                  type="text"
                  value={contactSettings.workingHoursEN}
                  onChange={(e) => setContactSettings({ ...contactSettings, workingHoursEN: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <button className="btn-primary flex items-center gap-2 w-full md:w-auto">
                <Save size={20} />
                {isTurkish ? 'Kaydet' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Shipping Settings Tab */}
        {activeTab === 'shipping' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {isTurkish ? 'Kargo Ayarları' : 'Shipping Settings'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Ücretsiz Kargo Eşiği (₺)' : 'Free Shipping Threshold (₺)'}
                </label>
                <input
                  type="number"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: Number(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Yurtiçi Kargo Ücreti (₺)' : 'Domestic Shipping Fee (₺)'}
                </label>
                <input
                  type="number"
                  value={shippingSettings.domesticShippingFee}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, domesticShippingFee: Number(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Tahmini Teslimat Süresi (Gün)' : 'Estimated Delivery Time (Days)'}
                </label>
                <input
                  type="text"
                  value={shippingSettings.estimatedDeliveryDays}
                  onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDeliveryDays: e.target.value })}
                  className="input-field w-full"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {isTurkish ? 'Uluslararası Kargo' : 'International Shipping'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isTurkish
                      ? 'Yurtdışı gönderimlerini aktifleştir'
                      : 'Enable international shipments'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shippingSettings.internationalShipping}
                    onChange={(e) => setShippingSettings({ ...shippingSettings, internationalShipping: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <button className="btn-primary flex items-center gap-2 w-full md:w-auto">
                <Save size={20} />
                {isTurkish ? 'Kaydet' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Payment Settings Tab */}
        {activeTab === 'payment' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {isTurkish ? 'Ödeme Ayarları' : 'Payment Settings'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'Para Birimi' : 'Currency'}
                </label>
                <select
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="TRY">TRY (₺)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">
                  {isTurkish ? 'KDV Oranı (%)' : 'Tax Rate (%)'}
                </label>
                <input
                  type="number"
                  value={paymentSettings.taxRate}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, taxRate: Number(e.target.value) })}
                  className="input-field w-full"
                />
              </div>
              <div className="space-y-3">
                <p className="text-white font-medium">
                  {isTurkish ? 'Ödeme Yöntemleri' : 'Payment Methods'}
                </p>
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <p className="text-white">
                    {isTurkish ? 'Kredi Kartı' : 'Credit Card'}
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.acceptCreditCard}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCreditCard: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <p className="text-white">Google Pay</p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.acceptGooglePay}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptGooglePay: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                  <p className="text-white">
                    {isTurkish ? 'Kripto Para' : 'Cryptocurrency'}
                  </p>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.acceptCrypto}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, acceptCrypto: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                  </label>
                </div>
              </div>
              <button className="btn-primary flex items-center gap-2 w-full md:w-auto">
                <Save size={20} />
                {isTurkish ? 'Kaydet' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Notifications Settings Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-6">
              {isTurkish ? 'Bildirim Ayarları' : 'Notification Settings'}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {isTurkish ? 'E-posta Bildirimleri' : 'Email Notifications'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isTurkish
                      ? 'E-posta ile bildirim al'
                      : 'Receive notifications via email'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {isTurkish ? 'SMS Bildirimleri' : 'SMS Notifications'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isTurkish
                      ? 'SMS ile bildirim al'
                      : 'Receive notifications via SMS'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-white">
                  {isTurkish ? 'Yeni Sipariş Bildirimi' : 'New Order Alert'}
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.newOrderAlert}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, newOrderAlert: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-white">
                  {isTurkish ? 'Düşük Stok Uyarısı' : 'Low Stock Alert'}
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.lowStockAlert}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlert: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg">
                <p className="text-white">
                  {isTurkish ? 'Yeni Yorum Bildirimi' : 'New Review Alert'}
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.newReviewAlert}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, newReviewAlert: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mea-gold"></div>
                </label>
              </div>
              <button className="btn-primary flex items-center gap-2 w-full md:w-auto mt-4">
                <Save size={20} />
                {isTurkish ? 'Kaydet' : 'Save'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}