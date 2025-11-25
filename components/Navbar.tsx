'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Globe,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { kimonoSubcategories, setSecondLevelCategories, getThirdLevelCategories } from '@/constants/categories';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'tr' ? 'en' : 'tr');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    {
      name: t('nav.kimono'),
      href: '/products?category=kimono',
      hasDropdown: true,
      subcategories: kimonoSubcategories
    },
    {
      name: t('nav.set'),
      href: '/products?category=set',
      hasDropdown: true,
      subcategories: setSecondLevelCategories
    },
    { name: t('nav.corporate'), href: '/corporate' },
    { name: t('nav.aboutUs'), href: '/about' },
    { name: t('nav.carnivals'), href: '/carnivals' },
    { name: t('nav.designRequest'), href: '/design-request' },
    { name: t('nav.tryOn'), href: '/try-on' },
    { name: t('nav.contact'), href: '/contact' },
    { name: t('nav.faq'), href: '/faq' },
    { name: t('nav.orderTracking'), href: '/order-tracking' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass border-b border-white border-opacity-10'
            : 'bg-black bg-opacity-40 backdrop-blur-md'
        }`}
        style={{
          background: isScrolled
            ? undefined
            : 'linear-gradient(135deg, rgba(163, 120, 48, 0.3) 0%, rgba(192, 148, 85, 0.3) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Name Only */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-wider">
                MEA CULPA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 7).map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="nav-link px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-5 flex items-center gap-1"
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown size={16} />}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 pt-8 pb-32 z-50"
                    >
                      {item.href.includes('kimono') ? (
                        // Kimono: 2-2-1 ters piramit düzeni
                        <div className="glass rounded-xl border border-white border-opacity-10 shadow-xl p-6 w-96">
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            {kimonoSubcategories.slice(0, 2).map((sub) => (
                              <Link
                                key={sub.key}
                                href={`/products?category=kimono&subcategory=${sub.key}`}
                                className="block px-4 py-3 text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors rounded-lg"
                              >
                                <div className="font-medium text-sm whitespace-nowrap">{i18n.language === 'tr' ? sub.name : sub.nameEn}</div>
                              </Link>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            {kimonoSubcategories.slice(2, 4).map((sub) => (
                              <Link
                                key={sub.key}
                                href={`/products?category=kimono&subcategory=${sub.key}`}
                                className="block px-4 py-3 text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors rounded-lg"
                              >
                                <div className="font-medium text-sm whitespace-nowrap">{i18n.language === 'tr' ? sub.name : sub.nameEn}</div>
                              </Link>
                            ))}
                          </div>
                          <div className="flex justify-center">
                            {kimonoSubcategories.slice(4, 5).map((sub) => (
                              <Link
                                key={sub.key}
                                href={`/products?category=kimono&subcategory=${sub.key}`}
                                className="block px-4 py-3 text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors rounded-lg"
                              >
                                <div className="font-medium text-sm whitespace-nowrap">{i18n.language === 'tr' ? sub.name : sub.nameEn}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Setler: 2. seviye yan yana, 3. seviye sağa açılır
                        <div className="glass rounded-xl border border-white border-opacity-10 shadow-xl overflow-hidden min-w-[400px]">
                          <div className="grid grid-cols-2 divide-x divide-white divide-opacity-10">
                            {setSecondLevelCategories.map((secondLevel) => (
                              <div key={secondLevel.key} className="relative group/sub">
                                <div className="px-8 py-4 text-gray-300 hover:bg-white hover:bg-opacity-5 transition-colors cursor-pointer">
                                  <div className="font-medium text-sm whitespace-nowrap">{i18n.language === 'tr' ? secondLevel.name : secondLevel.nameEn}</div>
                                </div>
                                {/* 3. seviye sağa açılan menü */}
                                <div className="absolute left-full top-0 ml-2 hidden group-hover/sub:block z-50">
                                  <div className="glass rounded-xl border border-white border-opacity-10 shadow-xl overflow-hidden w-64">
                                    {getThirdLevelCategories(secondLevel.key as 'kreasyonlar' | 'setler').map((third) => (
                                      <Link
                                        key={third.key}
                                        href={`/products?category=set&subcategory=${secondLevel.key}&thirdLevel=${third.key}`}
                                        className="block px-5 py-3 text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors border-b border-white border-opacity-5 last:border-0"
                                      >
                                        <div className="font-medium text-sm whitespace-nowrap">{i18n.language === 'tr' ? third.name : third.nameEn}</div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <Globe size={20} />
                <span className="text-sm font-medium">
                  {i18n.language.toUpperCase()}
                </span>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative text-gray-300 hover:text-white transition-colors"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-mea-gold text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account */}
              <Link
                href="/profile"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <User size={20} />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar (hidden on mobile) */}
        <div className="hidden lg:block border-t border-white border-opacity-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-6 h-12">
              {navItems.slice(7).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="fixed inset-0 glass">
              <div className="flex flex-col h-full pt-20 px-6 pb-6 overflow-y-auto">
                {navItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}
                      className="text-2xl text-white font-medium py-4 border-b border-white border-opacity-10 hover:text-mea-gold transition-colors block"
                    >
                      {item.name}
                    </Link>
                    {item.hasDropdown && item.subcategories && (
                      <div className="pl-4 pb-2">
                        {item.subcategories.map((sub) => (
                          <Link
                            key={sub.key}
                            href={`${item.href}&subcategory=${sub.key}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-lg text-gray-300 py-2 hover:text-mea-gold transition-colors"
                          >
                            {i18n.language === 'tr' ? sub.name : sub.nameEn}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-8 space-y-4">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center btn-primary w-full"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-center btn-secondary w-full"
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-70" />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl glass rounded-2xl p-6"
            >
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.search') + '...'}
                  className="flex-1 px-6 py-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-mea-gold"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-mea-gold text-black font-semibold rounded-xl hover:bg-opacity-90 transition-all"
                >
                  {t('common.search')}
                </button>
              </form>
              <p className="text-gray-400 text-sm mt-4">
                {i18n.language === 'tr'
                  ? 'Ürün adı veya açıklama ile arayın'
                  : 'Search by product name or description'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 lg:h-28" />
    </>
  );
}
