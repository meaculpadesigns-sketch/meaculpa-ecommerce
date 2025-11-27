'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Filter, SortAsc, Grid, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { getProducts } from '@/lib/firebase-helpers';
import { kimonoSubcategories, setSecondLevelCategories, getThirdLevelCategories, setSubcategories } from '@/constants/categories';

function ProductsContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const thirdLevel = searchParams.get('thirdLevel');
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  // Fetch products from Firebase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        // Filter out hidden products
        const visibleProducts = data.filter(p => !p.hidden);
        console.log('📦 Fetched products from Firebase:', visibleProducts);
        console.log('📦 Number of visible products:', visibleProducts.length);
        console.log('📦 Product categories:', visibleProducts.map(p => ({ id: p.id, category: p.category, subcategory: p.subcategory })));
        setProducts(visibleProducts);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('🔍 Filtering products...');
    console.log('🔍 Total products:', products.length);
    console.log('🔍 Category filter:', category);
    console.log('🔍 Subcategory filter:', subcategory);
    console.log('🔍 Search query:', searchQuery);

    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.nameEn.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.descriptionEn.toLowerCase().includes(query)
      );
      console.log('🔍 After search filter:', filtered.length);
    }

    // Filter by category
    if (category) {
      console.log('🔍 Filtering by category:', category);
      console.log('🔍 Products before category filter:', filtered.map(p => ({ id: p.id, category: p.category })));
      filtered = filtered.filter(p => p.category === category);
      console.log('🔍 After category filter:', filtered.length, filtered.map(p => ({ id: p.id, category: p.category })));
    }

    // Filter by subcategory
    if (subcategory) {
      console.log('🔍 Filtering by subcategory:', subcategory);
      filtered = filtered.filter(p => p.subcategory === subcategory);
      console.log('🔍 After subcategory filter:', filtered.length);
    }

    // Filter by third level category
    if (thirdLevel) {
      console.log('🔍 Filtering by thirdLevel:', thirdLevel);
      filtered = filtered.filter(p => p.thirdLevelCategory === thirdLevel);
      console.log('🔍 After thirdLevel filter:', filtered.length);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        // Would use sales/views data in production
        break;
    }

    console.log('🔍 Final filtered products:', filtered.length);
    setFilteredProducts(filtered);
  }, [products, category, subcategory, thirdLevel, searchQuery, sortBy]);

  const getPageTitle = () => {
    if (searchQuery) {
      return i18n.language === 'tr' ? `"${searchQuery}" için arama sonuçları` : `Search results for "${searchQuery}"`;
    }
    if (thirdLevel) {
      // 3. seviye kategori ismi
      const thirdLevelCat = getThirdLevelCategories(subcategory as 'kreasyonlar' | 'setler').find(c => c.key === thirdLevel);
      if (thirdLevelCat) {
        return i18n.language === 'tr' ? thirdLevelCat.name : thirdLevelCat.nameEn;
      }
    }
    if (subcategory) {
      // 2. seviye kategori ismi
      if (category === 'set') {
        const secondLevelCat = setSecondLevelCategories.find(c => c.key === subcategory);
        if (secondLevelCat) {
          return i18n.language === 'tr' ? secondLevelCat.name : secondLevelCat.nameEn;
        }
      } else if (category === 'kimono') {
        const kimonoCat = kimonoSubcategories.find(c => c.key === subcategory);
        if (kimonoCat) {
          return i18n.language === 'tr' ? kimonoCat.name : kimonoCat.nameEn;
        }
      }
      return t(`categories.${subcategory}`);
    }
    if (category) {
      return t(`categories.${category}`);
    }
    return t('nav.products');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 flex items-center justify-center">
        <div className="text-white text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {getPageTitle()}
          </motion.h1>
          <p className="text-gray-400">
            {filteredProducts.length} {t('products.productsFound')}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="glass px-6 py-3 rounded-full flex items-center gap-2 hover:bg-white hover:bg-opacity-10 transition-all"
          >
            <Filter size={20} />
            <span>{t('common.filter')}</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass px-6 py-3 rounded-full bg-transparent text-white cursor-pointer"
            >
              <option value="newest" className="bg-white text-black">{t('products.sortNewest')}</option>
              <option value="popular" className="bg-white text-black">{t('products.sortPopular')}</option>
              <option value="price-low" className="bg-white text-black">{t('products.sortPriceLow')}</option>
              <option value="price-high" className="bg-white text-black">{t('products.sortPriceHigh')}</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-white text-black'
                    : 'glass hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-white text-black'
                    : 'glass hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <h3 className="text-white font-semibold mb-4">{i18n.language === 'tr' ? 'Kategoriler' : 'Categories'}</h3>
            <div className="flex flex-wrap gap-2">
              {category === 'kimono' && kimonoSubcategories.map((sub) => (
                <Link
                  key={sub.key}
                  href={`/products?category=kimono&subcategory=${sub.key}`}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    subcategory === sub.key
                      ? 'bg-mea-gold text-black font-medium'
                      : 'glass text-gray-300 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {i18n.language === 'tr' ? sub.name : sub.nameEn}
                </Link>
              ))}
              {category === 'set' && setSecondLevelCategories.map((second) => (
                <div key={second.key} className="space-y-2">
                  <Link
                    href={`/products?category=set&subcategory=${second.key}`}
                    className={`block px-4 py-2 rounded-lg text-sm ${
                      subcategory === second.key
                        ? 'bg-mea-gold text-black font-medium'
                        : 'glass text-gray-300 hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    {i18n.language === 'tr' ? second.name : second.nameEn}
                  </Link>
                  {subcategory === second.key && (
                    <div className="ml-4 flex flex-wrap gap-2">
                      {getThirdLevelCategories(second.key as 'kreasyonlar' | 'setler').map((third) => (
                        <Link
                          key={third.key}
                          href={`/products?category=set&subcategory=${second.key}&thirdLevel=${third.key}`}
                          className={`px-3 py-1 rounded-lg text-xs ${
                            thirdLevel === third.key
                              ? 'bg-white text-black font-medium'
                              : 'bg-white bg-opacity-10 text-gray-400 hover:bg-opacity-20'
                          }`}
                        >
                          {i18n.language === 'tr' ? third.name : third.nameEn}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              {t('products.noProductsFound')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-pulse mb-4">{t('common.loading')}</div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
