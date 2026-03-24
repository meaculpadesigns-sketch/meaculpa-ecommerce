'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/lib/cart-context';
import { useTheme } from 'next-themes';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Globe,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { kimonoSubcategories, setSecondLevelCategories, getThirdLevelCategories } from '@/constants/categories';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { getCartCount } = useCart();
  const { theme, setTheme } = useTheme();
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

  type NavItem = { name: string; href: string; hasDropdown: boolean; subcategories?: typeof setSecondLevelCategories; thirdLevel?: boolean };

  // Sol grup: ürün/keşif linkleri
  const leftNavItems: NavItem[] = [
    { name: t('nav.kimono'), href: '/products?category=kimono', hasDropdown: false },
    { name: t('nav.set'), href: '/products?category=set', hasDropdown: true, subcategories: setSecondLevelCategories },
    { name: t('nav.designRequest'), href: '/design-request', hasDropdown: false },
  ];

  // Sağ grup: kurumsal linkleri
  const rightNavItems: NavItem[] = [
    { name: t('nav.aboutUs'), href: '/about', hasDropdown: false },
    { name: t('nav.corporate'), href: '/corporate', hasDropdown: false },
    { name: t('nav.tryOn'), href: '/try-on', hasDropdown: false },
  ];

  // Mobil menü için tüm linkler
  const allNavItems: NavItem[] = [
    ...leftNavItems,
    { name: t('nav.festivalsAndBlog'), href: '/festivals-and-blog', hasDropdown: false },
    ...rightNavItems,
  ];

  const linkColor = !isScrolled ? '#FFF4DE' : undefined;
  const iconClass = !isScrolled
    ? 'text-[#FFF4DE] opacity-80 hover:opacity-100 transition-opacity'
    : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors';
  const dividerColor = !isScrolled ? 'rgba(255,244,222,0.3)' : 'rgba(0,0,0,0.12)';

  const renderNavLink = (item: NavItem) => (
    <div
      key={item.href}
      className="relative"
      onMouseEnter={() => item.hasDropdown && setOpenDropdown(item.name)}
      onMouseLeave={() => setOpenDropdown(null)}
    >
      <Link
        href={item.href}
        className="nav-link px-3 py-1.5 rounded-lg hover:bg-white hover:bg-opacity-5 flex items-center gap-1 text-sm"
        style={{ color: linkColor }}
      >
        {item.name}
        {item.hasDropdown && <ChevronDown size={13} />}
      </Link>

      {item.hasDropdown && openDropdown === item.name && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          className="absolute top-full left-0 pt-4 pb-20 z-50"
        >
          {item.href.includes('kimono') ? (
            <div className="glass rounded-xl border border-black dark:border-white border-opacity-10 dark:border-opacity-10 shadow-xl overflow-hidden min-w-[280px]">
              {kimonoSubcategories.map((sub) => (
                <Link
                  key={sub.key}
                  href={`/products?category=kimono&subcategory=${sub.key}`}
                  className="block px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 hover:text-black dark:hover:text-white transition-colors border-b border-black dark:border-white border-opacity-5 last:border-0"
                >
                  <div className="font-medium text-sm whitespace-nowrap">{i18n.language === 'tr' ? sub.name : sub.nameEn}</div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl border border-black dark:border-white border-opacity-10 dark:border-opacity-10 shadow-xl overflow-visible min-w-[400px]">
              <div className="grid grid-cols-2 divide-x divide-black dark:divide-white divide-opacity-10">
                {setSecondLevelCategories.map((secondLevel) => (
                  <div key={secondLevel.key} className="relative group">
                    <Link
                      href={`/products?category=set&subcategory=${secondLevel.key}`}
                      className="block px-8 py-4 text-gray-700 dark:text-gray-300 hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-5 transition-colors"
                    >
                      <div className="font-medium text-sm whitespace-nowrap">{i18n.language === 'tr' ? secondLevel.name : secondLevel.nameEn}</div>
                    </Link>
                    <div className="absolute top-full left-0 mt-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                      <div className="glass rounded-xl border border-black dark:border-white border-opacity-10 shadow-xl overflow-hidden w-64">
                        {getThirdLevelCategories(secondLevel.key as 'kreasyonlar' | 'setler').map((third) => (
                          <Link
                            key={third.key}
                            href={`/products?category=set&subcategory=${secondLevel.key}&thirdLevel=${third.key}`}
                            className="block px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-black hover:bg-opacity-5 dark:hover:bg-white dark:hover:bg-opacity-10 hover:text-black dark:hover:text-white transition-colors border-b border-black dark:border-white border-opacity-5 last:border-0"
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
  );

  return (
    <>
      <nav
        className={`transition-all duration-300 ${isScrolled ? 'glass border-b' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: isScrolled ? undefined : 'transparent',
          borderColor: isScrolled ? 'rgba(0,0,0,0.1)' : undefined,
        }}
      >
        <div className="w-full px-4 md:px-8 pt-10 md:pt-14">
          <div className="flex items-stretch">

            {/* ── SOL: Logo (dikey, tam yüksekliği kaplar) ── */}
            <Link href="/" className="flex-shrink-0 flex items-end pr-6 md:pr-10 pb-2">
              <Image
                src="/images/meaculpa3kahveSVG.svg"
                alt="Mea Culpa"
                width={260}
                height={130}
                className="w-44 md:w-56 lg:w-64 h-auto object-contain"
                priority
              />
            </Link>

            {/* ── SAĞ: İki satırlı bölüm ── */}
            <div className="flex-1 flex flex-col">

              {/* Üst satır: ikonlar sağa hizalı */}
              <div className="flex items-center justify-end gap-3 pb-2">
                <button onClick={() => setSearchOpen(true)} className={iconClass}>
                  <Search size={17} />
                </button>
                <button onClick={toggleLanguage} className={`flex items-center gap-1 ${iconClass}`}>
                  <Globe size={17} />
                  <span className="text-xs font-medium">{i18n.language.toUpperCase()}</span>
                </button>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className={iconClass}
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <Link href="/cart" className={`relative ${iconClass}`}>
                  <ShoppingCart size={17} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-mea-gold text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className={iconClass}>
                  <User size={17} />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`lg:hidden ${iconClass}`}
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>

              {/* Yatay çizgi */}
              <div style={{ borderTop: `1px solid ${dividerColor}` }} />

              {/* Alt satır: nav linkleri (sadece desktop) */}
              <div className="hidden lg:flex items-center justify-between pt-2 pb-2.5">
                {/* Sol grup */}
                <div className="flex items-center">
                  {leftNavItems.map(renderNavLink)}
                </div>
                {/* Sağ grup */}
                <div className="flex items-center">
                  {rightNavItems.map(renderNavLink)}
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

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
              <div className="flex flex-col h-full pt-24 px-6 pb-6 overflow-y-auto">
                {allNavItems.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => !item.hasDropdown && setIsMobileMenuOpen(false)}
                      className="text-2xl text-black dark:text-white font-medium py-4 border-b border-black dark:border-white border-opacity-10 hover:text-mea-gold transition-colors block"
                    >
                      {item.name}
                    </Link>
                    {item.hasDropdown && item.subcategories && (
                      <div className="pl-4 pb-2">
                        {item.subcategories.map((sub) => (
                          <div key={sub.key}>
                            <Link
                              href={`${item.href}&subcategory=${sub.key}`}
                              onClick={() => !sub.thirdLevel && setIsMobileMenuOpen(false)}
                              className="block text-lg text-gray-700 dark:text-gray-300 py-2 hover:text-mea-gold transition-colors"
                            >
                              {i18n.language === 'tr' ? sub.name : sub.nameEn}
                            </Link>
                            {sub.thirdLevel && (sub.key === 'kreasyonlar' || sub.key === 'setler') && getThirdLevelCategories(sub.key as 'kreasyonlar' | 'setler').length > 0 && (
                              <div className="pl-4 pb-2">
                                {getThirdLevelCategories(sub.key as 'kreasyonlar' | 'setler').map((third) => (
                                  <Link
                                    key={third.key}
                                    href={`${item.href}&subcategory=${sub.key}&thirdLevel=${third.key}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-base text-gray-600 dark:text-gray-400 py-1.5 hover:text-mea-gold transition-colors"
                                  >
                                    {i18n.language === 'tr' ? third.name : third.nameEn}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-8 space-y-4">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block text-center btn-primary w-full">
                    {t('nav.login')}
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)} className="block text-center btn-secondary w-full">
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
                  className="flex-1 px-6 py-4 bg-black dark:bg-white bg-opacity-5 dark:bg-opacity-10 border border-black dark:border-white border-opacity-20 dark:border-opacity-20 rounded-xl text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:border-mea-gold"
                  autoFocus
                />
                <button type="submit" className="px-8 py-4 bg-mea-gold text-black font-semibold rounded-xl hover:bg-opacity-90 transition-all">
                  {t('common.search')}
                </button>
              </form>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-4">
                {i18n.language === 'tr' ? 'Ürün adı veya açıklama ile arayın' : 'Search by product name or description'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer — navbar yüksekliğine uygun */}
      <div className="h-44" />
    </>
  );
}
