'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function DistanceSalesAgreementPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isEnglish ? 'Distance Sales Agreement' : 'Mesafeli Satış Sözleşmesi'}
          </h1>
          <p className="text-gray-400">
            {isEnglish ? 'Last Updated: ' : 'Son Güncelleme: '}
            {new Date().toLocaleDateString(isEnglish ? 'en-US' : 'tr-TR')}
          </p>
        </motion.div>

        <div className="glass rounded-2xl p-8 space-y-8">
          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '1. PARTIES' : '1. TARAFLAR'}
            </h2>
            <div className="text-gray-300 space-y-3">
              <div>
                <p className="font-semibold text-mea-gold mb-2">
                  {isEnglish ? 'SELLER INFORMATION:' : 'SATICI BİLGİLERİ:'}
                </p>
                <p>{isEnglish ? 'Company' : 'Ünvan'}: Mea Culpa</p>
                <p>{isEnglish ? 'Address' : 'Adres'}: İstanbul/TÜRKİYE</p>
                <p>{isEnglish ? 'Phone' : 'Telefon'}: +90 507 562 08 02</p>
                <p>E-{isEnglish ? 'mail' : 'posta'}: meaculpadesigns@gmail.com</p>
              </div>
              <div className="mt-4">
                <p className="font-semibold text-mea-gold mb-2">
                  {isEnglish ? 'BUYER INFORMATION:' : 'ALICI BİLGİLERİ:'}
                </p>
                <p>
                  {isEnglish
                    ? 'Customer information registered during order.'
                    : 'Sipariş sırasında kayıt edilen müşteri bilgileri.'}
                </p>
              </div>
            </div>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '2. SUBJECT OF AGREEMENT' : '2. SÖZLEŞME KONUSU'}
            </h2>
            <p className="text-gray-300">
              {isEnglish
                ? 'This agreement regulates the rights and obligations of the parties regarding the sale and delivery of products ordered by the BUYER from the SELLER\'s website www.meaculpa.com, in accordance with the Consumer Protection Law No. 6502 and the Distance Contracts Regulation.'
                : 'İşbu sözleşme, ALICI\'nın SATICI\'ya ait www.meaculpa.com internet sitesinden elektronik ortamda siparişini verdiği aşağıda nitelikleri ve satış fiyatı belirtilen ürün/ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkındaki Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerini düzenler.'}
            </p>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '3. PRODUCT INFORMATION' : '3. ÜRÜN BİLGİLERİ'}
            </h2>
            <p className="text-gray-300">
              {isEnglish
                ? 'Basic features, sales price, payment method, and delivery information of the purchased product(s) are displayed on the order confirmation page and in the order summary sent via email.'
                : 'Satın alınan ürünün/ürünlerin temel özellikleri, satış fiyatı, ödeme şekli, teslimat bilgileri sipariş onay sayfasında ve e-posta ile gönderilen sipariş özet bilgisinde yer almaktadır.'}
            </p>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '4. GENERAL PROVISIONS' : '4. GENEL HÜKÜMLER'}
            </h2>
            <div className="text-gray-300 space-y-3">
              <p>
                {isEnglish
                  ? '4.1. The BUYER declares that they have read and acknowledged the preliminary information about the basic characteristics, sales price, payment method and delivery of the product on the SELLER\'s website and provided the necessary confirmation electronically.'
                  : '4.1. ALICI, SATICI\'ya ait internet sitesinde sözleşme konusu ürünün temel nitelikleri, satış fiyatı ve ödeme şekli ile teslimata ilişkin ön bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli teyidi verdiğini beyan eder.'}
              </p>
              <p>
                {isEnglish
                  ? '4.2. The product subject to the agreement shall be delivered to the BUYER or the person/organization at the address indicated by the BUYER within the period specified in the preliminary information, depending on the distance of the BUYER\'s place of residence, provided that it does not exceed the legal period of 30 days.'
                  : '4.2. Sözleşme konusu ürün, yasal 30 günlük süreyi aşmamak koşulu ile her bir ürün için ALICI\'nın yerleşim yerinin uzaklığına bağlı olarak ön bilgiler içinde açıklanan süre içinde ALICI veya gösterdiği adresteki kişi/kuruluşa teslim edilir.'}
              </p>
              <p>
                {isEnglish
                  ? '4.3. If the product subject to the agreement is to be delivered to a person/organization other than the BUYER, the SELLER cannot be held responsible if the person/organization to whom it is to be delivered does not accept the delivery.'
                  : '4.3. Sözleşme konusu ürün, ALICI\'dan başka bir kişi/kuruluşa teslim edilecek ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden SATICI sorumlu tutulamaz.'}
              </p>
            </div>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '5. RIGHT OF WITHDRAWAL' : '5. CAYMA HAKKI'}
            </h2>
            <div className="text-gray-300 space-y-3">
              <p>
                {isEnglish
                  ? '5.1. The BUYER has the right to withdraw from the agreement within 14 (fourteen) days from the delivery of the product to themselves or the person/organization at the address indicated.'
                  : '5.1. ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (on dört) gün içinde cayma hakkına sahiptir.'}
              </p>
              <p>
                {isEnglish
                  ? '5.2. To exercise the right of withdrawal, the SELLER must be notified by fax, email or phone within this period and the product must not have been used in accordance with Article 6 provisions.'
                  : '5.2. Cayma hakkının kullanılması için bu süre içinde SATICI\'ya faks, e-posta veya telefon ile bildirimde bulunulması ve ürünün 6. madde hükümleri çerçevesinde kullanılmamış olması şarttır.'}
              </p>
              <p className="font-semibold text-mea-gold">
                {isEnglish
                  ? '5.3. Products for Which the Right of Withdrawal Cannot Be Exercised:'
                  : '5.3. Cayma Hakkı Kullanılamayacak Ürünler:'}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  {isEnglish
                    ? 'Products specially prepared or customized for the individual'
                    : 'Özel olarak hazırlanan veya kişiye özel üretilen ürünler'}
                </li>
                <li>
                  {isEnglish
                    ? 'Products that deteriorate quickly or have a risk of expiring'
                    : 'Hızlı bozulan veya son kullanma tarihi geçme ihtimali olan ürünler'}
                </li>
                <li>
                  {isEnglish
                    ? 'Products whose packaging has been opened after delivery (for hygiene reasons)'
                    : 'Teslimattan sonra ambalajı açılmış olan ürünler (hijyen açısından)'}
                </li>
                <li>
                  {isEnglish
                    ? 'Kimonos and garments produced to special order'
                    : 'Özel siparişle üretilen kimono ve giysiler'}
                </li>
              </ul>
            </div>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '6. RETURN CONDITIONS' : '6. İADE KOŞULLARI'}
            </h2>
            <div className="text-gray-300 space-y-3">
              <p>
                {isEnglish
                  ? '6.1. If the BUYER exercises the right of withdrawal, they are obliged to send the product to the SELLER within 14 days from the date of receiving it.'
                  : '6.1. ALICI cayma hakkını kullandığı takdirde, ürünü teslim aldığı tarihten itibaren 14 gün içinde SATICI\'ya göndermekle yükümlüdür.'}
              </p>
              <p>
                {isEnglish
                  ? '6.2. The product to be returned must be sent with its invoice. (If the invoice of the product to be returned is corporate, it must be sent together with the return invoice issued by the corporation.)'
                  : '6.2. İade edilecek ürünün faturası ile birlikte gönderilmesi gerekmektedir. (İade edilecek ürünün faturası kurumsal ise, iade ederken kurumun düzenlemiş olduğu iade faturası ile birlikte gönderilmesi gerekmektedir.)'}
              </p>
              <p>
                {isEnglish
                  ? '6.3. The returned product must be delivered complete and undamaged with its box, packaging, and standard accessories if any.'
                  : '6.3. İade edilen ürünün kutusu, ambalajı, varsa standart aksesuarları ile birlikte eksiksiz ve hasarsız olarak teslim edilmesi gerekmektedir.'}
              </p>
              <p>
                {isEnglish
                  ? '6.4. The SELLER is obliged to refund the total amount to the BUYER within 14 days at the latest from the receipt of the withdrawal notification.'
                  : '6.4. SATICI, cayma bildiriminin kendisine ulaşmasından itibaren en geç 14 gün içinde toplam bedeli ALICI\'ya iade etmekle yükümlüdür.'}
              </p>
              <p>
                {isEnglish
                  ? '6.5. Return shipping costs are covered by the BUYER. However, if the product is defective or damaged, shipping costs are covered by the SELLER.'
                  : '6.5. İade kargo ücreti ALICI tarafından karşılanır. Ancak ürün kusurlu veya hasarlı ise kargo ücreti SATICI tarafından karşılanır.'}
              </p>
            </div>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '7. PAYMENT AND DELIVERY' : '7. ÖDEME VE TESLİMAT'}
            </h2>
            <div className="text-gray-300 space-y-3">
              <p>
                {isEnglish
                  ? '7.1. Payment can be made by credit card, debit card or bank transfer/EFT.'
                  : '7.1. Ödeme, kredi kartı, banka kartı veya havale/EFT yoluyla yapılabilir.'}
              </p>
              <p>
                {isEnglish
                  ? '7.2. Payment transactions are carried out through the secure payment infrastructure iyzico.'
                  : '7.2. Ödeme işlemleri güvenli ödeme altyapısı iyzico üzerinden gerçekleştirilir.'}
              </p>
              <p>
                {isEnglish
                  ? '7.3. Delivery time is 3-7 business days after order confirmation.'
                  : '7.3. Teslimat süresi, siparişin onaylanmasından sonra 3-7 iş günüdür.'}
              </p>
              <p>
                {isEnglish
                  ? '7.4. For custom design products, delivery time may vary between 14-21 business days.'
                  : '7.4. Özel tasarım ürünlerde teslimat süresi 14-21 iş günü arasında değişebilir.'}
              </p>
            </div>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '8. DEFAULT AND LEGAL CONSEQUENCES' : '8. TEMERRÜT HALİ VE HUKUKİ SONUÇLARI'}
            </h2>
            <div className="text-gray-300 space-y-3">
              <p>
                {isEnglish
                  ? '8.1. If the BUYER defaults on credit card transactions, they will pay interest within the framework of the credit card agreement between the cardholder and the bank and will be responsible to the bank.'
                  : '8.1. ALICI, kredi kartı ile yaptığı işlemlerde temerrüde düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı sözleşmesi çerçevesinde faiz ödeyecek ve bankaya karşı sorumlu olacaktır.'}
              </p>
              <p>
                {isEnglish
                  ? '8.2. If the BUYER defaults on payment transactions, they will compensate the damage and loss suffered by the SELLER.'
                  : '8.2. ALICI, ödeme işlemlerinde temerrüde düştüğü takdirde, SATICI\'nın uğradığı zarar ve ziyanını tazmin edecektir.'}
              </p>
            </div>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '9. COMPETENT COURT' : '9. YETKİLİ MAHKEME'}
            </h2>
            <p className="text-gray-300">
              {isEnglish
                ? 'For disputes arising from this agreement, Consumer Arbitration Committees and Consumer Courts at the place of residence of the BUYER or SELLER are authorized up to the value determined annually by the Ministry of Customs and Trade.'
                : 'İşbu sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığı\'nca her yıl belirlenen değere kadar Tüketici Hakem Heyetleri ile ALICI\'nın veya SATICI\'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.'}
            </p>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {isEnglish ? '10. EFFECTIVENESS' : '10. YÜRÜRLÜK'}
            </h2>
            <p className="text-gray-300">
              {isEnglish
                ? 'When the BUYER approves this agreement electronically on the website, they accept, declare and undertake that they are informed about the basic characteristics of the product subject to the agreement, the total sales price including taxes, payment method, delivery conditions and the right of withdrawal, and that they have given approval electronically.'
                : 'ALICI, işbu sözleşmeyi internet sitesi üzerinden elektronik ortamda onayladığında, sözleşme konusu ürünün temel nitelikleri, vergiler dahil toplam satış fiyatı, ödeme şekli, teslimat koşulları ve cayma hakkı konusunda bilgi sahibi olduğunu ve elektronik ortamda onay verdiğini kabul, beyan ve taahhüt eder.'}
            </p>
            <p className="text-gray-300 mt-4">
              {isEnglish
                ? 'This agreement becomes effective when approved electronically by the BUYER.'
                : 'İşbu sözleşme, ALICI tarafından elektronik ortamda onaylanmakla yürürlüğe girer.'}
            </p>
          </section>

          {/* Contact */}
          <section className="mt-12 p-6 bg-white bg-opacity-5 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEnglish ? 'CUSTOMER SERVICE' : 'MÜŞTERİ HİZMETLERİ'}
            </h3>
            <div className="text-gray-300 space-y-2">
              <p>E-{isEnglish ? 'mail' : 'posta'}: meaculpadesigns@gmail.com</p>
              <p>{isEnglish ? 'Phone' : 'Telefon'}: +90 507 562 08 02</p>
              <p>{isEnglish ? 'Address' : 'Adres'}: İstanbul/TÜRKİYE</p>
              <p className="mt-4">
                {isEnglish
                  ? 'For questions and suggestions, you can visit our '
                  : 'Soru ve önerileriniz için '}
                <a href="/contact" className="text-mea-gold hover:underline">
                  {isEnglish ? 'contact page' : 'iletişim sayfamızı'}
                </a>
                {isEnglish ? '.' : ' ziyaret edebilirsiniz.'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
