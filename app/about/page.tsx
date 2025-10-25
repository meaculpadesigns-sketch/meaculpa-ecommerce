'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Biz Kimiz?
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Doğu&apos;nun zengin kültürel mirasını modern tasarımla buluşturan bir markayız
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Hikayemiz</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <span className="text-mea-gold font-semibold">Mea Culpa</span>, Latince&apos;de
              &quot;benim hatam, benim tercihim&quot; anlamına gelir. Bizim için bu ifade, her
              kararın ve sonucunun sorumluluğunu cesurca üstlenmeyi simgeliyor.
            </p>
            <p>
              Her bir tasarımımız, tarihi İpek Yolu&apos;nun doğusundan özenle seçilen doğal, el
              dokuması kumaşlardan yapılır. Türkiye&apos;nin zengin tekstil mirasını modern
              yaşamla harmanlayan markamız, her parçanın benzersiz bir hikayesi olmasını sağlar.
            </p>
            <p>
              Sadece kıyafet üretmiyoruz; kültürler arası bir köprü kuruyoruz. Her ürünümüz,
              geleneksel el sanatlarını yaşatırken, çağdaş tasarım anlayışıyla geleceğe
              taşıyor.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Heart className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">El Emeği</h3>
            </div>
            <p className="text-gray-300">
              Her bir ürünümüz, usta eller tarafından özenle hazırlanır. Seri üretim yerine,
              özel sipariş sistemiyle çalışıyoruz.
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Award className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Kalite</h3>
            </div>
            <p className="text-gray-300">
              Doğal kumaşlar, geleneksel dokuma teknikleri ve titiz kalite kontrol ile en iyi
              ürünleri sunuyoruz.
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Users className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Topluluk</h3>
            </div>
            <p className="text-gray-300">
              Yerel zanaatkarlarla çalışarak, geleneksel sanatların yaşamasına ve gelişmesine
              katkıda bulunuyoruz.
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-mea-gold rounded-xl">
                <Globe className="text-black" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Sürdürülebilirlik</h3>
            </div>
            <p className="text-gray-300">
              Çevre dostu üretim yöntemleri ve doğal malzemeler kullanarak, geleceğe saygılı
              bir üretim anlayışı benimsiyoruz.
            </p>
          </div>
        </motion.div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Misyonumuz</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Doğu&apos;nun zengin tekstil mirasını modern tasarım anlayışıyla harmanlayarak, her
            bireyin kendi tarzını özgürce ifade edebileceği, kaliteli ve anlamlı ürünler
            sunmak.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Geleneksel el sanatlarını yaşatırken, çağdaş yaşam tarzına uygun, sürdürülebilir
            ve etik üretim yöntemleriyle geleceğe değer katmak.
          </p>
        </motion.div>

        {/* Team Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-2xl font-semibold text-white mb-4">
            &quot;Her karar bir yolculuktur.&quot;
          </p>
          <p className="text-gray-400">
            Mea Culpa ailesine hoş geldiniz. Sizinle bu yolculukta olmaktan mutluluk
            duyuyoruz.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
