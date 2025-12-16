'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Plus, Trash2, Edit, X } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAdminAuth } from '@/lib/use-admin-auth';
import { STANDARD_SIZE_CHARTS, SizeChart, SizeChartRow } from '@/lib/standard-size-charts';
import AdminBackButton from '@/components/AdminBackButton';

export default function AdminSizeChartsPage() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [customCharts, setCustomCharts] = useState<SizeChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChart, setEditingChart] = useState<SizeChart | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    category: 'set' as 'set' | 'kimono',
    subCategory: 'kadin' as 'kadin' | 'erkek' | 'krop' | 'uzun' | 'kisa' | undefined,
    rows: [
      { beden: 'S', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
      { beden: 'M', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
      { beden: 'L', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
      { beden: 'XL', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
    ] as SizeChartRow[],
  });

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchCustomCharts();
    }
  }, [authLoading, isAdmin]);

  const fetchCustomCharts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sizeCharts'));
      const chartsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as SizeChart[];
      setCustomCharts(chartsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Error fetching size charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const chartData = {
        name: formData.name,
        nameEn: formData.nameEn,
        category: formData.category,
        subCategory: formData.subCategory,
        rows: formData.rows,
        createdAt: editingChart?.createdAt || new Date(),
        isStandard: editingChart?.id.startsWith('standard-') || false,
        standardId: editingChart?.id.startsWith('standard-') ? editingChart.id : undefined,
      };

      if (editingChart && editingChart.id.startsWith('standard-')) {
        // For standard charts, check if an override exists
        const querySnapshot = await getDocs(collection(db, 'sizeCharts'));
        const existingOverride = querySnapshot.docs.find(doc =>
          doc.data().standardId === editingChart.id
        );

        if (existingOverride) {
          await updateDoc(existingOverride.ref, chartData);
        } else {
          await addDoc(collection(db, 'sizeCharts'), chartData);
        }
        alert('Standart beden tablosu güncellendi!');
      } else if (editingChart && !editingChart.id.startsWith('standard-')) {
        await updateDoc(doc(db, 'sizeCharts', editingChart.id), chartData);
        alert('Beden tablosu güncellendi!');
      } else {
        await addDoc(collection(db, 'sizeCharts'), chartData);
        alert('Beden tablosu oluşturuldu!');
      }

      await fetchCustomCharts();
      closeModal();
    } catch (error) {
      console.error('Error saving size chart:', error);
      alert('Beden tablosu kaydedilirken hata oluştu');
    }
  };

  const deleteChart = async (id: string) => {
    if (!confirm('Bu beden tablosunu silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'sizeCharts', id));
      await fetchCustomCharts();
      alert('Beden tablosu silindi!');
    } catch (error) {
      console.error('Error deleting size chart:', error);
      alert('Beden tablosu silinirken hata oluştu');
    }
  };

  const openModal = (chart?: SizeChart) => {
    if (chart) {
      setEditingChart(chart);
      setFormData({
        name: chart.name,
        nameEn: chart.nameEn,
        category: chart.category,
        subCategory: chart.subCategory,
        rows: chart.rows,
      });
    } else {
      setEditingChart(null);
      setFormData({
        name: '',
        nameEn: '',
        category: 'set',
        subCategory: 'kadin',
        rows: [
          { beden: 'S', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
          { beden: 'M', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
          { beden: 'L', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
          { beden: 'XL', pijamaBoyu: '', gomlekBoyu: '', kolBoyu: '' },
        ],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingChart(null);
  };

  const addRow = () => {
    const newRow: SizeChartRow = { beden: '' };
    if (formData.category === 'set') {
      if (formData.subCategory !== 'krop') {
        newRow.pijamaBoyu = '';
      }
      newRow.gomlekBoyu = '';
      newRow.kolBoyu = '';
    } else {
      newRow.kimonoBoyu = '';
      newRow.kolBoyu = '';
    }
    setFormData({
      ...formData,
      rows: [...formData.rows, newRow],
    });
  };

  const removeRow = (index: number) => {
    setFormData({
      ...formData,
      rows: formData.rows.filter((_, i) => i !== index),
    });
  };

  const updateRow = (index: number, field: keyof SizeChartRow, value: string) => {
    const newRows = [...formData.rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setFormData({ ...formData, rows: newRows });
  };

  const renderTableHeaders = (category: 'set' | 'kimono', subCategory?: string) => {
    if (category === 'kimono') {
      return (
        <>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Beden</th>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Kimono Boyu</th>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Kol Boyu</th>
        </>
      );
    } else if (subCategory === 'krop') {
      return (
        <>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Beden</th>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Gömlek Boyu</th>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Kol Boyu</th>
        </>
      );
    } else {
      return (
        <>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Beden</th>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Pijama Boyu</th>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Gömlek Boyu</th>
          <th className="text-left text-black dark:text-white font-medium pb-3 px-2">Kol Boyu</th>
        </>
      );
    }
  };

  const renderTableRow = (row: SizeChartRow, category: 'set' | 'kimono', subCategory?: string) => {
    if (category === 'kimono') {
      return (
        <>
          <td className="py-3 px-2 text-black dark:text-white font-semibold">{row.beden}</td>
          <td className="py-3 px-2 text-black dark:text-white">{row.kimonoBoyu}</td>
          <td className="py-3 px-2 text-black dark:text-white">{row.kolBoyu}</td>
        </>
      );
    } else if (subCategory === 'krop') {
      return (
        <>
          <td className="py-3 px-2 text-black dark:text-white font-semibold">{row.beden}</td>
          <td className="py-3 px-2 text-black dark:text-white">{row.gomlekBoyu}</td>
          <td className="py-3 px-2 text-black dark:text-white">{row.kolBoyu}</td>
        </>
      );
    } else {
      return (
        <>
          <td className="py-3 px-2 text-black dark:text-white font-semibold">{row.beden}</td>
          <td className="py-3 px-2 text-black dark:text-white">{row.pijamaBoyu}</td>
          <td className="py-3 px-2 text-black dark:text-white">{row.gomlekBoyu}</td>
          <td className="py-3 px-2 text-black dark:text-white">{row.kolBoyu}</td>
        </>
      );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-black dark:text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Merge standard charts with custom overrides
  const allCharts = STANDARD_SIZE_CHARTS.map((chart, idx) => {
    const standardId = `standard-${idx}`;
    const override = customCharts.find(c => c.standardId === standardId);
    return override || { ...chart, id: standardId, createdAt: new Date() };
  }).concat(customCharts.filter(c => !c.standardId));

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <AdminBackButton />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">Beden Tabloları</h1>
            <p className="text-black dark:text-white">Ürünler için beden tabloları oluşturun ve yönetin</p>
          </div>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Yeni Beden Tablosu
          </button>
        </div>

        {/* Size Charts List */}
        <div className="space-y-6">
          {allCharts.map((chart, index) => {
            const isStandard = chart.id.startsWith('standard-');

            return (
              <motion.div
                key={chart.id}
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
                        <h3 className="text-xl font-bold text-black dark:text-white">{chart.name}</h3>
                        <p className="text-sm text-black dark:text-white">{chart.nameEn}</p>
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
                      {isStandard && (
                        <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded-full">
                          Standart
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(chart)}
                      className="p-2 bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg hover:bg-opacity-30 transition-colors"
                      title="Düzenle"
                    >
                      <Edit size={20} />
                    </button>
                    {!isStandard && (
                      <button
                        onClick={() => deleteChart(chart.id)}
                        className="p-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors"
                        title="Sil"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Size Chart Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white border-opacity-10">
                        {renderTableHeaders(chart.category, chart.subCategory)}
                      </tr>
                    </thead>
                    <tbody>
                      {chart.rows.map((row, i) => (
                        <tr key={i} className="border-b border-white border-opacity-5">
                          {renderTableRow(row, chart.category, chart.subCategory)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingChart ? 'Beden Tablosunu Düzenle' : 'Yeni Beden Tablosu Oluştur'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tablo Adı (Türkçe)
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tablo Adı (İngilizce)
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as 'set' | 'kimono' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="set">Set</option>
                      <option value="kimono">Kimono</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Kategori
                    </label>
                    <select
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {formData.category === 'set' ? (
                        <>
                          <option value="kadin">Kadın</option>
                          <option value="erkek">Erkek</option>
                          <option value="krop">Krop</option>
                        </>
                      ) : (
                        <>
                          <option value="uzun">Uzun</option>
                          <option value="kisa">Kısa</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Sizes Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Beden Ölçüleri
                    </label>
                    <button
                      type="button"
                      onClick={addRow}
                      className="px-4 py-2 bg-blue-500 text-black dark:text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      + Satır Ekle
                    </button>
                  </div>
                  <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Beden</th>
                          {formData.category === 'set' && formData.subCategory !== 'krop' && (
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Pijama Boyu (cm)</th>
                          )}
                          {formData.category === 'set' && (
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Gömlek Boyu (cm)</th>
                          )}
                          {formData.category === 'kimono' && (
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Kimono Boyu (cm)</th>
                          )}
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Kol Boyu (cm)</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.rows.map((row, index) => (
                          <tr key={index} className="border-t border-gray-200">
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={row.beden}
                                onChange={(e) => updateRow(index, 'beden', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="S"
                              />
                            </td>
                            {formData.category === 'set' && formData.subCategory !== 'krop' && (
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={row.pijamaBoyu || ''}
                                  onChange={(e) => updateRow(index, 'pijamaBoyu', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="95cm"
                                />
                              </td>
                            )}
                            {formData.category === 'set' && (
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={row.gomlekBoyu || ''}
                                  onChange={(e) => updateRow(index, 'gomlekBoyu', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="60cm"
                                />
                              </td>
                            )}
                            {formData.category === 'kimono' && (
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={row.kimonoBoyu || ''}
                                  onChange={(e) => updateRow(index, 'kimonoBoyu', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                  placeholder="115cm"
                                />
                              </td>
                            )}
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                value={row.kolBoyu || ''}
                                onChange={(e) => updateRow(index, 'kolBoyu', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="35cm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <button
                                type="button"
                                onClick={() => removeRow(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-500 text-black dark:text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    {editingChart ? 'Güncelle' : 'Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
