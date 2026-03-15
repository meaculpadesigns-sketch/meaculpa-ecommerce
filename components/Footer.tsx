'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Instagram, MessageCircle } from 'lucide-react';

export default function Footer() {
  const { t, i18n } = useTranslation();

  const linkColor = { color: '#ffffff' };

  return (
    <footer style={{ background: '#9E906C' }}>
      {/* Logo için boşluk (128px logo, 64px footer'a taşıyor) + içerik satırı */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10" style={{ paddingTop: 76, paddingBottom: 22 }}>

        {/* Ana tek satır: 5 bölge */}
        <div className="relative flex items-center justify-between gap-4">

          {/* Sol: ödeme yöntemleri — çerçevesiz */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <svg viewBox="0 0 48 16" fill="none" style={{ height: 14, width: 'auto' }}>
              <text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#ffffff" letterSpacing="1">VISA</text>
            </svg>
            <svg viewBox="0 0 40 26" fill="none" style={{ height: 16, width: 'auto' }}>
              <circle cx="15" cy="13" r="9" fill="#EB001B"/>
              <circle cx="25" cy="13" r="9" fill="#F79E1B"/>
              <path d="M20 6.5a9 9 0 000 13 9 9 0 000-13z" fill="#FF5F00"/>
            </svg>
            <span className="text-xs font-bold" style={{ color: '#fff' }}>iyzico</span>
          </div>

          {/* Sol linkler */}
          <ul className="space-y-1 text-xs" style={{ marginLeft: '-16%' }}>
            <li>
              <Link href="/distance-sales-agreement" className="hover:opacity-100 transition-opacity" style={linkColor}>
                • {i18n.language === 'tr' ? 'Mesafeli Satış Sözleşmesi' : 'Distance Sales Agreement'}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:opacity-100 transition-opacity" style={linkColor}>
                • {i18n.language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:opacity-100 transition-opacity" style={linkColor}>
                • {i18n.language === 'tr' ? 'İade Politikaları' : 'Return Policy'}
              </Link>
            </li>
          </ul>

          {/* Merkez: copyright — sayfanın tam ortasına absolute */}
          <p className="absolute text-xs text-center pointer-events-none" style={{ color: '#ffffff', opacity: 0.85, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
            © {new Date().getFullYear()} MEA CULPA.<br />
            {i18n.language === 'tr' ? 'TÜM HAKLARI SAKLIDIR.' : 'ALL RIGHTS RESERVED.'}
          </p>

          {/* Sağ linkler */}
          <ul className="space-y-1 text-xs" style={{ marginRight: '-8%' }}>
            <li>
              <Link href="/order-tracking" className="hover:opacity-100 transition-opacity" style={linkColor}>
                • {i18n.language === 'tr' ? 'Sipariş Takip' : 'Order Tracking'}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:opacity-100 transition-opacity" style={linkColor}>
                • {i18n.language === 'tr' ? 'Sıkça Sorulan Sorular' : 'FAQ'}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:opacity-100 transition-opacity" style={linkColor}>
                • {i18n.language === 'tr' ? 'Bize Ulaşın' : 'Contact Us'}
              </Link>
            </li>
          </ul>

          {/* Sağ: sosyal medya */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="https://www.instagram.com/meaculpadesign/?igsh=MW8ybW9qdGJ6bTAyNw%3D%3D#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-100 transition-opacity"
              style={{ color: '#ffffff' }}
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://wa.me/905075620802"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:opacity-100 transition-opacity"
              style={{ color: '#ffffff' }}
            >
              <MessageCircle size={22} />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
