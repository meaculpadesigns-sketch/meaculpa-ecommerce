# Mea Culpa — Proje Rehberi

## Proje
Türk moda markası "Mea Culpa" için Next.js 16 App Router e-ticaret sitesi.
- **URL:** meaculpadesign.com (Vercel'de host)
- **Repo:** meaculpadesigns-sketch/meaculpa-ecommerce
- **Ana branch:** main — her push otomatik deploy

## Tech Stack
- Next.js 16 App Router, TypeScript, `'use client'` bileşenler
- Tailwind CSS
- Framer Motion (animasyonlar)
- Firebase (ürün veritabanı)
- react-i18next (TR/EN dil desteği)

## Marka Renkleri
| Değişken | Renk | Kullanım |
|---|---|---|
| Krem | `#FFF4DE` | SETLER bg, ürün kartları, HERO metin |
| Taupe | `#9E906C` | KİMONO bg, footer bg, SETLER başlık |

## Ana Dosyalar
- `app/page.tsx` — Ana sayfa, tüm section'lar burada
- `components/Navbar.tsx` — Navbar
- `components/Footer.tsx` — Footer
- `components/ProductCard.tsx` — Ürün kartı
- `app/globals.css` — Global CSS (`.product-card` sınıfı burada)
- `next.config.js` — Next.js config

## Ana Sayfa Section Yapısı (page.tsx)
1. **HERO** — Full bleed fotoğraf, overlay içerik, 2 polaroid görseli
2. **KİMONO** — `background: #9E906C`, sol featured görsel + sağ başlık/çubuk/kartlar
3. **SETLER** — `background: #FFF4DE`, 3 sütun grid (sol manken | orta içerik | sağ manken)
4. **BİZ KİMİZ?** — `background: #9E906C`, sol polaroidler + sağ metin
5. **Testimonials** — `<Testimonials />` bileşeni
6. **Footer** — `<Footer />` bileşeni

## Kritik Teknik Kurallar

### overflow-x
- `body { overflow-x: clip }` — **clip kullan, hidden değil**
- `hidden` Chrome'da sol tarafı kırpar (scroll container oluşturur); `clip` oluşturmaz

### Navbar
- `position: absolute` (fixed DEĞİL) — sayfa kaydırıldığında kaybolur, sayfanın en üstünde görünür
- Scroll tracking / isScrolled state yok, tamamen kaldırıldı
- Logo: `meaculpa3kahveSVG.svg`

### Framer Motion — Stacking Context
- `motion.div` ile `opacity` animasyonu (`initial={{ opacity: 0 }}`) CSS stacking context yaratır
- Bu, kardeş elementlerin z-index sıralamasını bozar (Chrome'da yazılar mankenin arkasına gider)
- KİMONO section'da bu yüzden `initial={{ opacity: 1 }}` (animasyon yok)

### Ürün Kartları
- `.product-card` class'ı `app/globals.css`'de tanımlı
- Köşe kıvrımı (`rounded-*`) ve border/outline yok
- `h-full` ile kartlar section yüksekliğini doldurur

## SETLER Mankenleri (app/page.tsx ~369. satır)
Sol ve sağ manken görselleri `position: absolute` ile konumlandırılmış.
Mevcut değerler (kullanıcı onayıyla ayarlandı):
- **Sol:** `src="sol-manken.png"` `width={477} height={850}` `style={{ bottom: -120, left: -170, zIndex: 10 }}`
- **Sağ:** `src="sag-manken.png"` `width={477} height={850}` `style={{ bottom: -120, right: -120, zIndex: 10 }}`

> Değişiklik öncesinde kullanıcıya sor — bu değerlere ulaşmak çok ince ayar gerektirdi.

## KİMONO Section Özel Durumu
- Sol sütun: `zIndex: 5` — framer-motion stacking context'i geçmek için
- Çubuk sol kenara uzanıyor: `position: absolute, left: -100vw` ile
- KİMONO başlığı ve çubuk: `marginLeft: 'calc(-40vw - 48px)'` ile sağ sütundan sol sütuna taşıyor

## Footer (components/Footer.tsx)
- `background: #9E906C`
- 5 bölge: ödeme ikonları | sol linkler | copyright (absolute center) | sağ linkler | sosyal medya
- Ödeme ikonları çerçevesiz (inline SVG)
- `paddingTop: 32, paddingBottom: 10`

## iOS Safari Uyumluluğu
`next.config.js`'de `Alt-Svc: clear` header'ı var — HTTP/3 devre dışı (iOS Safari uyumluluğu için).

## Dil Sistemi
- `i18n.language === 'tr' ? 'Türkçe metin' : 'English text'` şeklinde inline
- Alternatif: `t('key')` fonksiyonu
