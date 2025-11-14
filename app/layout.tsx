import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import I18nProvider from '@/components/I18nProvider';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: 'Mea Culpa - Zamana Dokunan Hikayeler',
  description: 'Doğu\'nun ilhamıyla, modern yaşamın içinde. Her karar bir yolculuktur.',
  keywords: ['mea culpa', 'kimono', 'set', 'tasarım', 'fashion', 'türk tasarım', 'ipek yolu', 'organik kumaş', 'el boyaması'],
  authors: [{ name: 'Mea Culpa Designs' }],
  openGraph: {
    title: 'Mea Culpa - Zamana Dokunan Hikayeler',
    description: 'Doğu\'nun ilhamıyla, modern yaşamın içinde. Her karar bir yolculuktur.',
    url: 'https://meaculpa.com',
    siteName: 'Mea Culpa',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
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
