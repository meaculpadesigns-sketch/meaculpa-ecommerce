import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import I18nProvider from '@/components/I18nProvider';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  metadataBase: new URL('https://meaculpadesigns.com'),
  title: {
    default: 'Mea Culpa - Zamana Dokunan Hikayeler | Özel Tasarım Kimono ve Setler',
    template: '%s | Mea Culpa',
  },
  description: 'Doğu\'nun ilhamıyla, modern yaşamın içinde. Özel tasarım kimono, set ve kreasyonlar. Organik kumaş, el boyaması ve kişiye özel tasarımlarla zamana dokunan hikayeler.',
  keywords: ['mea culpa', 'kimono', 'set', 'tasarım', 'fashion', 'türk tasarım', 'ipek yolu', 'organik kumaş', 'el boyaması', 'özel tasarım kimono', 'retro kreasyon', 'kişiye özel tasarım', 'luxury fashion'],
  authors: [{ name: 'Mea Culpa Designs' }],
  creator: 'Mea Culpa Designs',
  publisher: 'Mea Culpa Designs',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Mea Culpa - Zamana Dokunan Hikayeler',
    description: 'Doğu\'nun ilhamıyla, modern yaşamın içinde. Her karar bir yolculuktur.',
    url: 'https://meaculpadesigns.com',
    siteName: 'Mea Culpa',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mea Culpa - Özel Tasarım Kimono ve Setler',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mea Culpa - Zamana Dokunan Hikayeler',
    description: 'Doğu\'nun ilhamıyla, modern yaşamın içinde.',
    images: ['/images/twitter-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased">
        <I18nProvider>
          <CartProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
                <CookieConsent />
              </div>
            </ThemeProvider>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
