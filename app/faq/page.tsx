'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      category: 'Sipariş ve Teslimat',
      questions: [
        {
          q: 'Siparişim ne zaman kargoya verilir?',
          a: 'Siparişiniz onaylandıktan sonra 1-3 iş günü içinde kargoya verilir. Özel tasarım siparişler için süre 7-14 iş günü olabilir.',
        },
        {
          q: 'Kargo ücreti ne kadar?',
          a: '500 TL ve üzeri alışverişlerde kargo ücretsizdir. 500 TL altındaki siparişler için kargo ücreti 50 TL\'dir.',
        },
        {
          q: 'Hangi kargo firması ile çalışıyorsunuz?',
          a: 'Yurtiçi Kargo ve MNG Kargo ile çalışmaktayız. Sipariş sonrası kargo takip numaranız tarafınıza SMS ve e-posta ile gönderilir.',
        },
        {
          q: 'Yurtdışına gönderim yapıyor musunuz?',
          a: 'Evet, dünya geneline gönderim yapıyoruz. Uluslararası kargo ücretleri ülkeye göre değişiklik gösterir. Detaylı bilgi için bizimle iletişime geçebilirsiniz.',
        },
      ],
    },
    {
      category: 'Ürün ve Beden',
      questions: [
        {
          q: 'Beden seçiminde nasıl karar verebilirim?',
          a: 'Her ürün sayfasında detaylı beden tablosu bulunmaktadır. Ölçülerinizi alarak tablomuzla karşılaştırabilirsiniz. Ayrıca özel beden seçenekleri için tasarım istekleri bölümünden bize ulaşabilirsiniz.',
        },
        {
          q: 'Ürünler hangi kumaşlardan yapılıyor?',
          a: 'Ürünlerimiz %100 doğal kumaşlardan (pamuk, keten, ipek) üretilmektedir. Tüm kumaşlarımız Türkiye\'nin doğusundaki geleneksel el tezgahlarında dokunmaktadır.',
        },
        {
          q: 'Ürünlerin bakımı nasıl yapılmalı?',
          a: 'Doğal kumaşlar olduğu için 30 derece el yıkama önerilir. Kuru temizleme de tercih edilebilir. Ütüleme düşük ısıda yapılmalıdır.',
        },
        {
          q: 'Stokta olmayan ürünleri satın alabilir miyim?',
          a: 'Evet, stokta olmayan ürünler için ön sipariş verebilirsiniz. Ön sipariş ürünlerin teslimat süresi 14-21 iş günüdür.',
        },
      ],
    },
    {
      category: 'İade ve Değişim',
      questions: [
        {
          q: 'İade politikanız nedir?',
          a: 'Ürünü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Ürün kullanılmamış, etiketli ve orijinal ambalajında olmalıdır. Özel tasarım ürünler iade kapsamı dışındadır.',
        },
        {
          q: 'İade nasıl yapabilirim?',
          a: 'İade için meaculpadesigns@gmail.com adresine mail atabilir veya +90 555 123 45 67 numaralı telefondan bize ulaşabilirsiniz. İade kargo ücreti tarafımızca karşılanır.',
        },
        {
          q: 'Bedeni değiştirebilir miyim?',
          a: 'Evet, 14 gün içinde beden değişimi yapabilirsiniz. Ürünü kullanılmamış ve etiketli olarak gönderin, yeni bedeninizi kargo ücreti olmadan gönderelim.',
        },
        {
          q: 'İade bedelim ne zaman hesabıma geçer?',
          a: 'İade ettiğiniz ürün depomıza ulaştıktan ve kontrol edildikten sonra 3-5 iş günü içinde ödeme iadeniz gerçekleştirilir.',
        },
      ],
    },
    {
      category: 'Ödeme',
      questions: [
        {
          q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          a: 'Kredi kartı, banka kartı, Google Pay ve kripto para ile ödeme alabilirsiniz. Tüm ödeme işlemleriniz SSL sertifikası ile güvence altındadır.',
        },
        {
          q: 'Taksit imkanı var mı?',
          a: 'Evet, tüm kredi kartlarına 3, 6 ve 9 taksit imkanı sunuyoruz. Taksit seçenekleri ödeme sayfasında görüntülenir.',
        },
        {
          q: 'Kapıda ödeme yapabilir miyim?',
          a: 'Şu an için kapıda ödeme seçeneğimiz bulunmamaktadır. Ancak güvenli online ödeme yöntemlerimizi kullanabilirsiniz.',
        },
      ],
    },
    {
      category: 'Özel Tasarım',
      questions: [
        {
          q: 'Kendi tasarımımı yaptırabilir miyim?',
          a: 'Evet! Tasarım İstekleri sayfamızdan fikrinizi bize iletebilirsiniz. Ekibimiz sizinle iletişime geçerek detayları görüşür ve fiyat teklifi sunar.',
        },
        {
          q: 'Özel tasarım süreci nasıl işler?',
          a: 'İsteğinizi aldıktan sonra 24 saat içinde size dönüş yapıyoruz. Tasarım onaylandıktan sonra 14-21 iş günü içinde üretim tamamlanıp kargoya veriliyor.',
        },
        {
          q: 'Minimum sipariş adedi var mı?',
          a: 'Bireysel özel tasarımlar için minimum adet yok. Kurumsal toplu siparişler için detaylı bilgi almak üzere iletişime geçebilirsiniz.',
        },
      ],
    },
    {
      category: 'Hesap ve Üyelik',
      questions: [
        {
          q: 'Üye olmadan alışveriş yapabilir miyim?',
          a: 'Evet, misafir kullanıcı olarak da alışveriş yapabilirsiniz. Ancak üye olarak favori ürünlerinizi kaydedebilir, sipariş geçmişinizi görebilir ve özel kampanyalardan yararlanabilirsiniz.',
        },
        {
          q: 'Şifremi unuttum ne yapmalıyım?',
          a: 'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinizi girin. Size şifre sıfırlama linki göndereceğiz.',
        },
        {
          q: 'Hesabımı nasıl silebilirim?',
          a: 'Hesabınızı silmek için meaculpadesigns@gmail.com adresine talepte bulunabilirsiniz. Talebiniz 48 saat içinde işleme alınır.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-xl text-gray-400">
            Aklınıza takılan soruların cevaplarını burada bulabilirsiniz
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((faq, qIndex) => {
                  const index = catIndex * 100 + qIndex;
                  const isOpen = openIndex === index;

                  return (
                    <div key={qIndex} className="glass rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white hover:bg-opacity-5 transition-colors"
                      >
                        <span className="text-white font-medium pr-4">{faq.q}</span>
                        <ChevronDown
                          className={`text-mea-gold flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                          size={24}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Sorunuzun cevabını bulamadınız mı?
          </h3>
          <p className="text-gray-400 mb-6">
            Bizimle iletişime geçmekten çekinmeyin, size yardımcı olmaktan mutluluk duyarız
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Bize Ulaşın
          </a>
        </motion.div>
      </div>
    </div>
  );
}
