'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAdminAuth } from '@/lib/use-admin-auth';

interface SizeChartRow {
  beden: string;
  bust: string;
  bel: string;
  kalca: string;
  boy: string;
}

interface SizeChart {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  rows: SizeChartRow[];
  createdAt: Date;
}

export default function AdminSizeChartsPage() {
  const { loading: authLoading, isAdmin } = useAdminAuth();
  const [sizeCharts, setSizeCharts] = useState<SizeChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChart, setEditingChart] = useState<SizeChart | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    category: 'set',
    rows: [
      { beden: 'XS', bust: '', bel: '', kalca: '', boy: '' },
      { beden: 'S', bust: '', bel: '', kalca: '', boy: '' },
      { beden: 'M', bust: '', bel: '', kalca: '', boy: '' },
      { beden: 'L', bust: '', bel: '', kalca: '', boy: '' },
      { beden: 'XL', bust: '', bel: '', kalca: '', boy: '' },
    ] as SizeChartRow[],
  });

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchSizeCharts();
    }
  }, [authLoading, isAdmin]);

  const fetchSizeCharts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'sizeCharts'));
      const chartsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as SizeChart[];
      setSizeCharts(chartsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
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
        rows: formData.rows,
        createdAt: editingChart?.createdAt || new Date(),
      };

      if (editingChart) {
        await updateDoc(doc(db, 'sizeCharts', editingChart.id), chartData);
        alert('Beden tablosu güncellendi!');
      } else {
        await addDoc(collection(db, 'sizeCharts'), chartData);
        alert('Beden tablosu oluşturuldu!');
      }

      await fetchSizeCharts();
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
      await fetchSizeCharts();
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
        rows: chart.rows,
      });
    } else {
      setEditingChart(null);
      setFormData({
        name: '',
        nameEn: '',
        category: 'set',
        rows: [
          { beden: 'XS', bust: '', bel: '', kalca: '', boy: '' },
          { beden: 'S', bust: '', bel: '', kalca: '', boy: '' },
          { beden: 'M', bust: '', bel: '', kalca: '', boy: '' },
          { beden: 'L', bust: '', bel: '', kalca: '', boy: '' },
          { beden: 'XL', bust: '', bel: '', kalca: '', boy: '' },
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
    setFormData({
      ...formData,
      rows: [...formData.rows, { beden: '', bust: '', bel: '', kalca: '', boy: '' }],
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Beden Tabloları</h1>
            <p className="text-gray-400">Ürünler için beden tabloları oluşturun ve yönetin</p>
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
        <div className="space-y-4">
          {sizeCharts.map((chart, index) => (
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
                      <h3 className="text-xl font-bold text-white">{chart.name}</h3>
                      <p className="text-sm text-gray-400">{chart.nameEn}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded-full">
                    {chart.category === 'set' ? 'Setler' : 'Kimono'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(chart)}
                    className="p-2 bg-blue-500 bg-opacity-20 text-blue-400 rounded-lg hover:bg-opacity-30 transition-colors"
                    title="Düzenle"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => deleteChart(chart.id)}
                    className="p-2 bg-red-500 bg-opacity-20 text-red-400 rounded-lg hover:bg-opacity-30 transition-colors"
                    title="Sil"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Size Chart Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white border-opacity-10">
                      <th className="text-left text-gray-400 font-medium pb-3 px-2">Beden</th>
                      <th className="text-left text-gray-400 font-medium pb-3 px-2">Büst (cm)</th>
                      <th className="text-left text-gray-400 font-medium pb-3 px-2">Bel (cm)</th>
                      <th className="text-left text-gray-400 font-medium pb-3 px-2">Kalça (cm)</th>
                      <th className="text-left text-gray-400 font-medium pb-3 px-2">Boy (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, i) => (
                      <tr key={i} className="border-b border-white border-opacity-5">
                        <td className="py-3 px-2 text-white font-semibold">{row.beden}</td>
                        <td className="py-3 px-2 text-gray-300">{row.bust}</td>
                        <td className="py-3 px-2 text-gray-300">{row.bel}</td>
                        <td className="py-3 px-2 text-gray-300">{row.kalca}</td>
                        <td className="py-3 px-2 text-gray-300">{row.boy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>

        {sizeCharts.length === 0 && !loading && (
          <div className="text-center py-20">
            <Ruler className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">Henüz Beden Tablosu Yok</h2>
            <p className="text-gray-400 mb-6">
              İlk beden tablonuzu oluşturarak başlayın
            </p>
            <button
              onClick={() => openModal()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Yeni Beden Tablosu Oluştur
            </button>
          </div>
        )}

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
                    <label className="block text-gray-900 font-medium mb-2">
                      Tablo Adı (Türkçe) *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                      placeholder="Standart Set Beden Tablosu"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 font-medium mb-2">
                      Tablo Adı (İngilizce) *
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                      placeholder="Standard Set Size Chart"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-gray-900 font-medium mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                    required
                  >
                    <option value="set">Setler</option>
                    <option value="kimono">Kimono</option>
                  </select>
                </div>

                {/* Size Rows */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-gray-900 font-medium">
                      Beden Ölçüleri *
                    </label>
                    <button
                      type="button"
                      onClick={addRow}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                    >
                      <Plus size={16} />
                      Satır Ekle
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.rows.map((row, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={row.beden}
                          onChange={(e) => updateRow(index, 'beden', e.target.value)}
                          className="w-20 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                          placeholder="XS"
                          required
                        />
                        <input
                          type="text"
                          value={row.bust}
                          onChange={(e) => updateRow(index, 'bust', e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                          placeholder="Büst (cm)"
                          required
                        />
                        <input
                          type="text"
                          value={row.bel}
                          onChange={(e) => updateRow(index, 'bel', e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                          placeholder="Bel (cm)"
                          required
                        />
                        <input
                          type="text"
                          value={row.kalca}
                          onChange={(e) => updateRow(index, 'kalca', e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                          placeholder="Kalça (cm)"
                          required
                        />
                        <input
                          type="text"
                          value={row.boy}
                          onChange={(e) => updateRow(index, 'boy', e.target.value)}
                          className="flex-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mea-gold text-gray-900"
                          placeholder="Boy (cm)"
                          required
                        />
                        {formData.rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-mea-gold text-black font-semibold py-3 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    {editingChart ? 'Güncelle' : 'Oluştur'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-8 bg-gray-200 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-all"
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
