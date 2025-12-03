'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Instagram, Facebook, Twitter, MessageCircle } from 'lucide-react';

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
      { name: t('nav.carnivals'), href: '/carnivals' },
      { name: t('nav.contact'), href: '/contact' },
    ],
    support: [
      { name: t('nav.orderTracking'), href: '/order-tracking' },
      { name: t('nav.faq'), href: '/faq' },
      { name: t('footer.privacy'), href: '/privacy' },
      { name: t('footer.returns'), href: '/returns' },
    ],
    legal: [
      { name: t('footer.distanceSales'), href: '/distance-sales-agreement' },
      { name: t('footer.privacy'), href: '/privacy' },
      { name: t('footer.returns'), href: '/returns' },
    ],
  };

  const socialMedia = [
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://www.instagram.com/meaculpadesigns',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: 'https://wa.me/905075620802',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: '#',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: '#',
    },
  ];

  return (
    <footer className="glass border-t border-white border-opacity-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">MEA CULPA</h2>
            <p className="text-gray-400 text-sm mb-4 max-w-md">
              {t('footer.brandDescription')}
            </p>
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('nav.products')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('nav.corporate')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods & Legal */}
        <div className="mt-12 pt-8 border-t border-white border-opacity-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href="/distance-sales-agreement"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('footer.distanceSales')}
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/returns"
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('footer.returns')}
              </Link>
            </div>

            {/* Payment Logos */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {/* Visa */}
                <div className="bg-white px-3 py-2 rounded flex items-center justify-center">
                  <svg className="h-5 w-auto" viewBox="0 0 48 16" fill="none">
                    <path d="M18.5 2.5L16 13.5h3l2.5-11h-3zm8.5 0l-4 11h3l.7-2h4l.3 2h3.5l-3-11h-4.5zm.5 3l1 5h-2.5l1.5-5zM11 2.5L7.5 10 7 7.5 6 3c-.2-.5-.5-.5-1-.5H0l.5.5c1 .2 2 .5 3 1l2.5 9.5h3L14 2.5h-3zm19 0c-.8 0-1.5.5-1.5 1.2 0 1.3 3 1.3 3 3.8 0 2.5-3.5 2.5-4.5 1.5l-.5 2c1 .5 2 .5 3 .5 2.5 0 4.5-1.2 4.5-3.5 0-1.5-3-1.5-3-3 0-1 2.5-1 3.5 0l.5-2c-1-.5-2-.5-3-.5z" fill="#1434CB"/>
                  </svg>
                </div>
                {/* Mastercard */}
                <div className="bg-white px-3 py-2 rounded flex items-center justify-center">
                  <svg className="h-5 w-auto" viewBox="0 0 48 32" fill="none">
                    <circle cx="19" cy="16" r="11" fill="#EB001B"/>
                    <circle cx="29" cy="16" r="11" fill="#F79E1B"/>
                    <path d="M24 8a10.97 10.97 0 00-5 8 10.97 10.97 0 005 8 10.97 10.97 0 005-8 10.97 10.97 0 00-5-8z" fill="#FF5F00"/>
                  </svg>
                </div>
                {/* iyzico */}
                <div className="bg-white px-3 py-2 rounded flex items-center justify-center">
                  <span className="text-[#1d3557] font-bold text-sm">iyzico</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Mea Culpa. {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
