'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { getCartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartCount = getCartCount();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const navItems = [
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.kimono'), href: '/products?category=kimono' },
    { name: t('nav.shirt'), href: '/products?category=shirt' },
    { name: t('nav.set'), href: '/products?category=set' },
    { name: t('nav.corporate'), href: '/corporate' },
    { name: t('nav.aboutUs'), href: '/about' },
    { name: t('nav.carnivals'), href: '/carnivals' },
    { name: t('nav.designRequest'), href: '/design-request' },
    { name: t('nav.tryOn'), href: '/try-on' },
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
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">
                MEA CULPA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-5"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button className="text-gray-300 hover:text-white transition-colors">
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

              {/* Theme Switcher */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              )}

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
              {navItems.slice(5).map((item) => (
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
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl text-white font-medium py-4 border-b border-white border-opacity-10 hover:text-mea-gold transition-colors"
                  >
                    {item.name}
                  </Link>
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

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 lg:h-28" />
    </>
  );
}
