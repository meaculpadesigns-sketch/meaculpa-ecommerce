'use client';

import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';
import { useAdminAuth } from '@/lib/use-admin-auth';
import { STANDARD_SIZE_CHARTS } from '@/lib/standard-size-charts';
import AdminBackButton from '@/components/AdminBackButton';

export default function AdminSizeChartsPage() {
  const { loading: authLoading, isAdmin } = useAdminAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminBackButton />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Beden Tabloları</h1>
          <p className="text-gray-400">Standart beden tabloları</p>
        </div>

        {/* Size Charts List */}
        <div className="space-y-6">
          {STANDARD_SIZE_CHARTS.map((chart, index) => {
            const isKimono = chart.category === 'kimono';
            const isKrop = chart.subCategory === 'krop';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Ruler className="text-mea-gold" size={24} />
                      <div>
                        <h3 className="text-xl font-bold text-white">{chart.name}</h3>
                        <p className="text-sm text-gray-400">{chart.nameEn}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded-full">
                        {chart.category === 'set' ? 'Set' : 'Kimono'}
                      </span>
                      {chart.subCategory && (
                        <span className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-400 text-xs rounded-full">
                          {chart.subCategory === 'kadin' ? 'Kadın' :
                           chart.subCategory === 'erkek' ? 'Erkek' :
                           chart.subCategory === 'krop' ? 'Krop' :
                           chart.subCategory === 'uzun' ? 'Uzun' : 'Kısa'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Size Chart Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white border-opacity-10">
                        <th className="text-left text-gray-400 font-medium pb-3 px-2">Beden</th>
                        {!isKimono && !isKrop && (
                          <th className="text-left text-gray-400 font-medium pb-3 px-2">Pijama Boyu</th>
                        )}
                        {!isKimono && (
                          <th className="text-left text-gray-400 font-medium pb-3 px-2">
                            {isKrop ? 'Gömlek Boyu' : 'Gömlek Boyu'}
                          </th>
                        )}
                        {isKimono && (
                          <th className="text-left text-gray-400 font-medium pb-3 px-2">Kimono Boyu</th>
                        )}
                        <th className="text-left text-gray-400 font-medium pb-3 px-2">Kol Boyu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chart.rows.map((row, i) => (
                        <tr key={i} className="border-b border-white border-opacity-5">
                          <td className="py-3 px-2 text-white font-semibold">{row.beden}</td>
                          {!isKimono && !isKrop && row.pijamaBoyu && (
                            <td className="py-3 px-2 text-gray-300">{row.pijamaBoyu}</td>
                          )}
                          {!isKimono && row.gomlekBoyu && (
                            <td className="py-3 px-2 text-gray-300">{row.gomlekBoyu}</td>
                          )}
                          {isKimono && row.kimonoBoyu && (
                            <td className="py-3 px-2 text-gray-300">{row.kimonoBoyu}</td>
                          )}
                          {row.kolBoyu && (
                            <td className="py-3 px-2 text-gray-300">{row.kolBoyu}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-500 bg-opacity-10 rounded-lg border border-blue-500 border-opacity-20">
          <p className="text-blue-300 text-sm">
            ℹ️ Bu beden tabloları standart tablolardır ve değiştirilemez. Ürünler bu tablolara göre üretilmektedir.
          </p>
        </div>
      </div>
    </div>
  );
}
