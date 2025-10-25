'use client';

import { useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      // Navigation
      nav: {
        products: 'Ürünlerimiz',
        kimono: 'Kimono',
        shirt: 'Gömlek',
        set: 'Set',
        corporate: 'Kurumsal',
        aboutUs: 'Biz Kimiz?',
        carnivals: 'Karnavallar',
        orderTracking: 'Sipariş Takip',
        designRequest: 'Tasarım İstekleri',
        tryOn: 'Dene',
        contact: 'Bize Ulaşın',
        faq: 'Sıkça Sorulan Sorular',
        cart: 'Sepetim',
        login: 'Giriş Yap',
        signup: 'Üye Ol',
        logout: 'Çıkış Yap',
      },
      // Hero Section
      hero: {
        slogan1: 'Her Karar Bir Yolculuktur.',
        slogan2: 'Zamana Dokunan Hikayeler.',
        slogan3: 'Doğu\'nun İlhamıyla, Modern Yaşamın İçinde.',
        shopNow: 'Alışverişe Başla',
        learnMore: 'Daha Fazla Bilgi',
      },
      // Products
      products: {
        addToCart: 'Sepete Ekle',
        addToFavorites: 'Favorilere Ekle',
        removeFromFavorites: 'Favorilerden Çıkar',
        viewStory: 'Hikayesi',
        selectSize: 'Beden Seç',
        preOrder: 'Ön Sipariş',
        outOfStock: 'Stokta Yok',
        specialRequests: 'Özel İstekleriniz',
        giftWrapping: 'Hediye Paketleme',
        giftMessage: 'Hediye Mesajı',
        discount: 'İndirim',
        estimatedDelivery: 'Tahmini Teslimat',
      },
      // Cart
      cart: {
        title: 'Sepetim',
        empty: 'Sepetiniz boş',
        subtotal: 'Ara Toplam',
        shipping: 'Kargo',
        discount: 'İndirim',
        total: 'Toplam',
        checkout: 'Ödemeye Geç',
        continueShopping: 'Alışverişe Devam',
      },
      // Auth
      auth: {
        firstName: 'İsim',
        lastName: 'Soyisim',
        email: 'E-posta',
        phone: 'Telefon',
        password: 'Şifre',
        confirmPassword: 'Şifre Doğrula',
        forgotPassword: 'Şifremi Unuttum',
        resetPassword: 'Şifreyi Sıfırla',
        login: 'Giriş Yap',
        signup: 'Üye Ol',
        or: 'veya',
        googleLogin: 'Google ile Giriş Yap',
      },
      // Profile
      profile: {
        myProfile: 'Profilim',
        favorites: 'Favorilerim',
        activeOrders: 'Aktif Siparişlerim',
        pastOrders: 'Geçmiş Siparişlerim',
        myCards: 'Kartlarım',
        myCoupons: 'Kuponlarım',
        myAddresses: 'Adreslerim',
        trackOrder: 'Siparişi Takip Et',
      },
      // Footer
      footer: {
        privacy: 'Gizlilik Politikası',
        returns: 'İade Politikaları',
        cookies: 'Çerez Politikası',
        acceptCookies: 'Çerezleri Kabul Et',
        rejectCookies: 'Reddet',
        followUs: 'Bizi Takip Edin',
      },
      // Design Request
      designRequest: {
        title: 'Tasarım İstekleri',
        textDescription: 'Sözel Anlatım',
        uploadImage: 'Görsel Yükle',
        submit: 'Gönder',
        requestNumber: 'Tasarım No',
        status: 'Durum',
      },
      // Admin
      admin: {
        dashboard: 'Yönetim Paneli',
        products: 'Ürün Yönetimi',
        orders: 'Siparişler',
        users: 'Kullanıcılar',
        messages: 'Mesajlar',
        analytics: 'Analitik',
        settings: 'Ayarlar',
        addProduct: 'Ürün Ekle',
        editProduct: 'Ürün Düzenle',
        deleteProduct: 'Ürün Sil',
        hideProduct: 'Ürünü Gizle',
      },
      // Common
      common: {
        save: 'Kaydet',
        cancel: 'İptal',
        edit: 'Düzenle',
        delete: 'Sil',
        search: 'Ara',
        filter: 'Filtrele',
        sort: 'Sırala',
        loading: 'Yükleniyor...',
        error: 'Bir hata oluştu',
        success: 'İşlem başarılı',
        viewAll: 'Tümünü Gör',
      },
    },
  },
  en: {
    translation: {
      // Navigation
      nav: {
        products: 'Our Products',
        kimono: 'Kimono',
        shirt: 'Shirt',
        set: 'Set',
        corporate: 'Corporate',
        aboutUs: 'About Us',
        carnivals: 'Carnivals',
        orderTracking: 'Order Tracking',
        designRequest: 'Design Requests',
        tryOn: 'Try On',
        contact: 'Contact Us',
        faq: 'FAQ',
        cart: 'Cart',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
      },
      // Hero Section
      hero: {
        slogan1: 'Every Decision is a Journey.',
        slogan2: 'Stories That Touch Time.',
        slogan3: 'Inspired by the East, Within Modern Life.',
        shopNow: 'Shop Now',
        learnMore: 'Learn More',
      },
      // Products
      products: {
        addToCart: 'Add to Cart',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        viewStory: 'Story',
        selectSize: 'Select Size',
        preOrder: 'Pre-Order',
        outOfStock: 'Out of Stock',
        specialRequests: 'Special Requests',
        giftWrapping: 'Gift Wrapping',
        giftMessage: 'Gift Message',
        discount: 'Discount',
        estimatedDelivery: 'Estimated Delivery',
      },
      // Cart
      cart: {
        title: 'My Cart',
        empty: 'Your cart is empty',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        discount: 'Discount',
        total: 'Total',
        checkout: 'Checkout',
        continueShopping: 'Continue Shopping',
      },
      // Auth
      auth: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        forgotPassword: 'Forgot Password',
        resetPassword: 'Reset Password',
        login: 'Login',
        signup: 'Sign Up',
        or: 'or',
        googleLogin: 'Sign in with Google',
      },
      // Profile
      profile: {
        myProfile: 'My Profile',
        favorites: 'Favorites',
        activeOrders: 'Active Orders',
        pastOrders: 'Past Orders',
        myCards: 'My Cards',
        myCoupons: 'My Coupons',
        myAddresses: 'My Addresses',
        trackOrder: 'Track Order',
      },
      // Footer
      footer: {
        privacy: 'Privacy Policy',
        returns: 'Return Policy',
        cookies: 'Cookie Policy',
        acceptCookies: 'Accept Cookies',
        rejectCookies: 'Reject',
        followUs: 'Follow Us',
      },
      // Design Request
      designRequest: {
        title: 'Design Requests',
        textDescription: 'Text Description',
        uploadImage: 'Upload Image',
        submit: 'Submit',
        requestNumber: 'Request Number',
        status: 'Status',
      },
      // Admin
      admin: {
        dashboard: 'Dashboard',
        products: 'Product Management',
        orders: 'Orders',
        users: 'Users',
        messages: 'Messages',
        analytics: 'Analytics',
        settings: 'Settings',
        addProduct: 'Add Product',
        editProduct: 'Edit Product',
        deleteProduct: 'Delete Product',
        hideProduct: 'Hide Product',
      },
      // Common
      common: {
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Operation successful',
        viewAll: 'View All',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
  });

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
