'use client';

import { motion } from 'framer-motion';

export default function DistanceSalesAgreementPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Mesafeli Satış Sözleşmesi
          </h1>
          <p className="text-gray-400">
            Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </motion.div>

        <div className="glass rounded-2xl p-8 space-y-8">
          {/* Madde 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. TARAFLAR</h2>
            <div className="text-gray-300 space-y-3">
              <div>
                <p className="font-semibold text-mea-gold mb-2">SATICI BİLGİLERİ:</p>
                <p>Ünvan: Mea Culpa</p>
                <p>Adres: Yurt mah. 71329 sk. Erkam Apt. Kat: 8 No: 16 Çukurova/ADANA</p>
                <p>Telefon: +90 507 562 08 02</p>
                <p>E-posta: meaculpadesigns@gmail.com</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-mea-gold mb-2">ALICI BİLGİLERİ:</p>
                <p>Sipariş sırasında kayıt edilen müşteri bilgileri.</p>
              </div>
            </div>
          </section>

          {/* Madde 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. SÖZLEŞME KONUSU</h2>
            <p className="text-gray-300">
              İşbu sözleşme, ALICI&apos;nın SATICI&apos;ya ait www.meaculpa.com internet sitesinden
              elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen
              ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması
              Hakkındaki Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak
              ve yükümlülüklerini düzenler.
            </p>
          </section>

          {/* Madde 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. ÜRÜN BİLGİLERİ</h2>
            <p className="text-gray-300">
              Satın alınan ürünün/ürünlerin temel özellikleri, satış fiyatı, ödeme şekli, teslimat
              bilgileri sipariş onay sayfasında ve e-posta ile gönderilen sipariş özet bilgisinde
              yer almaktadır.
            </p>
          </section>

          {/* Madde 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. GENEL HÜKÜMLER</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                4.1. ALICI, SATICI&apos;ya ait internet sitesinde sözleşme konusu ürünün temel
                nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup
                bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.
              </p>
              <p>
                4.2. Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün
                için ALICI&apos;nın yerleşim yerinin uzaklığına bağlı olarak ön bilgiler içinde
                açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.
              </p>
              <p>
                4.3. Sözleşme konusu ürün, ALICI&apos;dan başka bir kişi/kuruluşa teslim edilecek
                ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden SATICI sorumlu
                tutulamaz.
              </p>
            </div>
          </section>

          {/* Madde 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. CAYMA HAKKI</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                5.1. ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki
                kişi/kuruluşa tesliminden itibaren 14 (on dört) gün içinde cayma hakkına sahiptir.
              </p>
              <p>
                5.2. Cayma hakkının kullanılması için bu süre içinde SATICI&apos;ya faks, e-posta
                veya telefon ile bildirimde bulunulması ve ürünün 6. madde hükümleri çerçevesinde
                kullanılmamış olması şarttır.
              </p>
              <p className="font-semibold text-mea-gold">
                5.3. Cayma Hakkı Kullanılamayacak Ürünler:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Özel olarak hazırlanan veya kişiye özel üretilen ürünler</li>
                <li>Hızlı bozulan veya son kullanma tarihi geçme ihtimali olan ürünler</li>
                <li>Teslimattan sonra ambalajı açılmış olan ürünler (hijyen açısından)</li>
                <li>Özel siparişle üretilen kimono ve giysiler</li>
              </ul>
            </div>
          </section>

          {/* Madde 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. İADE KOŞULLARI</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                6.1. ALICI cayma hakkını kullandığı takdirde, ürünü teslim aldığı tarihten
                itibaren 14 gün içinde SATICI&apos;ya göndermekle yükümlüdür.
              </p>
              <p>
                6.2. İade edilecek ürünün faturası ile birlikte gönderilmesi gerekmektedir.
                (İade edilecek ürünün faturası kurumsal ise, iade ederken kurumun düzenlemiş
                olduğu iade faturası ile birlikte gönderilmesi gerekmektedir.)
              </p>
              <p>
                6.3. İade edilen ürünün kutusu, ambalajı, varsa standart aksesuarları ile
                birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.
              </p>
              <p>
                6.4. SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 14 gün
                içinde toplam bedeli ALICI&apos;ya iade etmekle yükümlüdür.
              </p>
              <p>
                6.5. İade kargo ücreti ALICI tarafından karşılanır. Ancak ürün kusurlu veya
                hasarlı ise kargo ücreti SATICI tarafından karşılanır.
              </p>
            </div>
          </section>

          {/* Madde 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. ÖDEME VE TESLİMAT</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                7.1. Ödeme, kredi kartı, banka kartı veya havale/EFT yoluyla yapılabilir.
              </p>
              <p>
                7.2. Ödeme işlemleri güvenli ödeme altyapısı iyzico üzerinden gerçekleştirilir.
              </p>
              <p>
                7.3. Teslimat süresi, siparişin onaylanmasından sonra 3-7 iş günüdür.
              </p>
              <p>
                7.4. Özel tasarım ürünlerde teslimat süresi 14-21 iş günü arasında değişebilir.
              </p>
            </div>
          </section>

          {/* Madde 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. TEMERRÜT HALİ VE HUKUKİ SONUÇLARI</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                8.1. ALICI, kredi kartı ile yaptığı işlemlerde temerrüde düştüğü takdirde, kart
                sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyecek ve
                bankaya karşı sorumlu olacaktır.
              </p>
              <p>
                8.2. ALICI, ödeme işlemlerinde temerrüde düştüğü takdirde, SATICI&apos;nın
                uğradığı zarar ve ziyanını tazmin edecektir.
              </p>
            </div>
          </section>

          {/* Madde 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. YETKİLİ MAHKEME</h2>
            <p className="text-gray-300">
              İşbu sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığı&apos;nca her yıl
              belirlenen değere kadar Tüketici Hakem Heyetleri ile ALICI&apos;nın veya SATICI&apos;nın
              yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

          {/* Madde 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. YÜRÜRLÜK</h2>
            <p className="text-gray-300">
              ALICI, işbu sözleşmeyi internet sitesi üzerinden elektronik ortamda onayladığında,
              sözleşme konusu ürünün temel nitelikleri, vergiler dahil toplam satış fiyatı,
              ödeme şekli, teslimat koşulları ve cayma hakkı konusunda bilgi sahibi olduğunu ve
              elektronik ortamda onay verdiğini kabul, beyan ve taahhüt eder.
            </p>
            <p className="text-gray-300 mt-4">
              İşbu sözleşme, ALICI tarafından elektronik ortamda onaylanmakla yürürlüğe girer.
            </p>
          </section>

          {/* İletişim */}
          <section className="mt-12 p-6 bg-white bg-opacity-5 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">MÜŞTERİ HİZMETLERİ</h3>
            <div className="text-gray-300 space-y-2">
              <p>E-posta: meaculpadesigns@gmail.com</p>
              <p>Telefon: +90 507 562 08 02</p>
              <p>Adres: Yurt mah. 71329 sk. Erkam Apt. Kat: 8 No: 16 Çukurova/ADANA</p>
              <p className="mt-4">
                Soru ve önerileriniz için{' '}
                <a href="/contact" className="text-mea-gold hover:underline">
                  iletişim sayfamızı
                </a>{' '}
                ziyaret edebilirsiniz.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}