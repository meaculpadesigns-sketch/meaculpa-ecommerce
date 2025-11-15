'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Filter, SortAsc, Grid, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { getProducts } from '@/lib/firebase-helpers';
import { kimonoSubcategories, setSubcategories } from '@/constants/categories';

function ProductsContent() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = 'bg-home';
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
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by subcategory
    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }

    // Filter by price range
    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p =>
        p.sizes.some(s => selectedSizes.includes(s.size) && s.inStock)
      );
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

    setFilteredProducts(filtered);
  }, [products, category, subcategory, priceRange, selectedSizes, sortBy]);

  const getPageTitle = () => {
    if (subcategory) {
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

        {/* Subcategory Chips */}
        {category && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => router.push(`/products?category=${category}`)}
                className={`px-4 py-2 rounded-full transition-all ${
                  !subcategory
                    ? 'bg-mea-gold text-black font-semibold'
                    : 'glass hover:bg-white hover:bg-opacity-10 text-gray-300'
                }`}
              >
                {t('common.all')}
              </button>
              {(category === 'kimono' ? kimonoSubcategories : setSubcategories).map((sub) => (
                <button
                  key={sub.key}
                  onClick={() => router.push(`/products?category=${category}&subcategory=${sub.key}`)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    subcategory === sub.key
                      ? 'bg-mea-gold text-black font-semibold'
                      : 'glass hover:bg-white hover:bg-opacity-10 text-gray-300'
                  }`}
                >
                  {i18n.language === 'tr' ? sub.name : sub.nameEn}
                </button>
              ))}
            </div>
          </div>
        )}

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
              <option value="newest" className="bg-zinc-900">{t('products.sortNewest')}</option>
              <option value="popular" className="bg-zinc-900">{t('products.sortPopular')}</option>
              <option value="price-low" className="bg-zinc-900">{t('products.sortPriceLow')}</option>
              <option value="price-high" className="bg-zinc-900">{t('products.sortPriceHigh')}</option>
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

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <h3 className="text-white font-semibold mb-4">{t('products.priceRange')}</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-gray-400 text-sm">
                    ₺0 - ₺{priceRange[1]}
                  </p>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-white font-semibold mb-4">{t('products.size')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(selectedSizes.filter(s => s !== size));
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg ${
                        selectedSizes.includes(size)
                          ? 'bg-white text-black'
                          : 'glass hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <h3 className="text-white font-semibold mb-4">{t('products.stockStatus')}</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{t('products.inStock')}</span>
                  </label>
                  <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span>{t('products.preOrder')}</span>
                  </label>
                </div>
              </div>
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
