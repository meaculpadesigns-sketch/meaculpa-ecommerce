'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    products: [
      { name: t('nav.products'), href: '/products' },
      { name: t('nav.kimono'), href: '/products?category=kimono' },
      { name: t('nav.set'), href: '/products?category=set' },
    ],
    company: [
      { name: t('nav.aboutUs'), href: '/about' },
      { name: t('nav.corporate'), href: '/corporate' },
      { name: t('nav.contact'), href: '/contact' },
    ],
    support: [
      { name: t('nav.orderTracking'), href: '/order-tracking' },
      { name: t('nav.faq'), href: '/faq' },
      { name: t('footer.privacy'), href: '/privacy' },
      { name: t('footer.returns'), href: '/returns' },
    ],
  };

  const socialMedia = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/meaculpadesign/?igsh=MW8ybW9qdGJ6bTAyNw%3D%3D#',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/905075620802',
    },
  ];

  return (
    <footer style={{ background: '#7a8570' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Top: centered logo */}
        <div className="flex flex-col items-center mb-12">
          <Image
            src="/images/logo-symbol.png"
            alt="Mea Culpa"
            width={56}
            height={56}
            className="h-14 w-auto mb-3"
          />
          <span className="text-lg font-semibold tracking-wider" style={{ color: '#FFF4DE' }}>
            Mea Culpa
          </span>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {/* Products */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4" style={{ color: '#F5D482' }}>
              {t('nav.products')}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-opacity hover:opacity-100" style={{ color: '#FFF4DE', opacity: 0.8 }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4" style={{ color: '#F5D482' }}>
              {t('nav.corporate')}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-opacity hover:opacity-100" style={{ color: '#FFF4DE', opacity: 0.8 }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs tracking-widest uppercase font-semibold mb-4" style={{ color: '#F5D482' }}>
              {t('footer.support')}
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm transition-opacity hover:opacity-100" style={{ color: '#FFF4DE', opacity: 0.8 }}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,244,222,0.2)' }}
        >
          {/* Social */}
          <div className="flex items-center gap-4">
            {socialMedia.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="transition-opacity hover:opacity-100"
                style={{ color: '#FFF4DE', opacity: 0.75 }}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs" style={{ color: '#FFF4DE', opacity: 0.65 }}>
            <Link href="/distance-sales-agreement" className="hover:opacity-100 transition-opacity">
              {t('footer.distanceSales')}
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              {t('footer.privacy')}
            </Link>
            <span>•</span>
            <Link href="/returns" className="hover:opacity-100 transition-opacity">
              {t('footer.returns')}
            </Link>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-2">
            <div className="bg-white bg-opacity-15 px-3 py-1.5 rounded">
              <svg className="h-4 w-auto" viewBox="0 0 48 16" fill="none">
                <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#ffffff" letterSpacing="1">VISA</text>
              </svg>
            </div>
            <div className="bg-white bg-opacity-15 px-3 py-1.5 rounded flex items-center justify-center">
              <svg className="h-4 w-auto" viewBox="0 0 40 26" fill="none">
                <circle cx="15" cy="13" r="9" fill="#EB001B" fillOpacity="0.9"/>
                <circle cx="25" cy="13" r="9" fill="#F79E1B" fillOpacity="0.9"/>
                <path d="M20 6.5a9 9 0 000 13 9 9 0 000-13z" fill="#FF5F00" fillOpacity="0.9"/>
              </svg>
            </div>
            <div className="bg-white bg-opacity-15 px-3 py-1.5 rounded">
              <span className="text-xs font-bold" style={{ color: '#fff' }}>iyzico</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs mt-6" style={{ color: '#FFF4DE', opacity: 0.5 }}>
          &copy; {new Date().getFullYear()} Mea Culpa. {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
}
