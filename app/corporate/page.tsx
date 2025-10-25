'use client';

import { motion } from 'framer-motion';
import { Building, Users, Gift, Award, Mail, Phone } from 'lucide-react';

export default function CorporatePage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Kurumsal Çözümler
          </h1>
          <p className="text-xl text-gray-400">
            İşletmeniz için özel tasarım ve toplu sipariş hizmetleri
          </p>
        </motion.div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Building className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Kurumsal Üniformalar</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Otel, restoran, spa ve diğer işletmeler için özel tasarım çalışan kıyafetleri.
              Markanızın kimliğini yansıtan, konforlu ve şık üniformalar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Gift className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Kurumsal Hediyeler</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Özel günler, etkinlikler ve ödül törenleri için özel tasarım hediye setleri.
              Logo ve marka kimliğiniz ile kişiselleştirilebilir.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Users className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">Toplu Sipariş</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Organizasyonlar, davetler ve özel günler için toplu sipariş imkanı.
              Özel fiyatlandırma ve öncelikli üretim hizmeti.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Award className="text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white">VIP Hizmet</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Özel müşterileriniz için VIP hizmet ve özel koleksiyonlar.
              Kişisel tasarım danışmanlığı ve premium ambalaj seçenekleri.
            </p>
          </motion.div>
        </div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Nasıl Çalışır?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                1
              </div>
              <h3 className="text-white font-semibold mb-2">İletişim</h3>
              <p className="text-gray-400 text-sm">
                Bizimle iletişime geçin ve ihtiyaçlarınızı paylaşın
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                2
              </div>
              <h3 className="text-white font-semibold mb-2">Tasarım</h3>
              <p className="text-gray-400 text-sm">
                Tasarım ekibimiz sizinle birlikte çalışır
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                3
              </div>
              <h3 className="text-white font-semibold mb-2">Teklif</h3>
              <p className="text-gray-400 text-sm">
                Detaylı fiyat teklifi ve üretim süresi bildirimi
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-mea-gold rounded-full flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                4
              </div>
              <h3 className="text-white font-semibold mb-2">Üretim</h3>
              <p className="text-gray-400 text-sm">
                Onay sonrası üretim ve teslimat
              </p>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Neden Mea Culpa?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Özel tasarım ve üretim',
              'Minimum sipariş adedi yok',
              'Hızlı üretim süreci',
              'Rekabetçi fiyatlandırma',
              'Kaliteli doğal kumaşlar',
              'Profesyonel müşteri hizmetleri',
              'Özel ambalaj seçenekleri',
              'Teslimatta esneklik',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-mea-gold rounded-full" />
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Projenizi Konuşalım
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Kurumsal ihtiyaçlarınız için size özel çözümler üretelim.
            Detaylı bilgi almak ve teklif almak için bizimle iletişime geçin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:corporate@meaculpa.com"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Mail size={20} />
              corporate@meaculpa.com
            </a>
            <a
              href="tel:+905551234567"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Phone size={20} />
              +90 555 123 45 67
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
