'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/types';
import { getProductById } from '@/lib/firebase-helpers';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/lib/cart-context';
import {
  KADIN_SET_SIZE_CHART,
  ERKEK_SET_SIZE_CHART,
  KROP_GOMLEK_SIZE_CHART,
  UZUN_KIMONO_SIZE_CHART,
  KISA_KIMONO_SIZE_CHART,
} from '@/lib/standard-size-charts';

type OrderType = 'individual' | 'family';
type Gender = 'male' | 'female';

interface ParentInfo {
  gender: Gender;
  size: string;
  shirtLength: string;
  sleeveLength: string;
  pantsLength: string;
}

interface ChildInfo {
  id: string;
  gender: Gender;
  age: string;
  height: string;
  weight: string;
  shirtLength: string;
  sleeveLength: string;
  pantsLength: string;
}

export default function CustomizePage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState<OrderType>('individual');
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');

  // Standard sizes
  const STANDARD_SIZES = ['S', 'M', 'L', 'XL'];

  // Individual order state
  const [gender, setGender] = useState<Gender>('male');
  const [size, setSize] = useState('');
  const [shirtLength, setShirtLength] = useState('');
  const [sleeveLength, setSleeveLength] = useState('');
  const [pantsLength, setPantsLength] = useState('');

  // New states for kimono/set options
  const [kimonoType, setKimonoType] = useState<'uzun' | 'kisa'>('uzun');
  const [setItemSelection, setSetItemSelection] = useState<'full' | 'shirt-only' | 'pants-only'>('full');
  const [isCropShirt, setIsCropShirt] = useState(false);
  const [showFamilyOrder, setShowFamilyOrder] = useState(false);

  // Image gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Size chart modal state
  const [showSizeChartModal, setShowSizeChartModal] = useState(false);

  // Family order state
  const [childCount, setChildCount] = useState(0);
  const [parent1, setParent1] = useState<ParentInfo>({
    gender: 'male',
    size: '',
    shirtLength: '',
    sleeveLength: '',
    pantsLength: '',
  });
  const [parent2, setParent2] = useState<ParentInfo>({
    gender: 'female',
    size: '',
    shirtLength: '',
    sleeveLength: '',
    pantsLength: '',
  });
  const [children, setChildren] = useState<ChildInfo[]>([]);

  // Calculate current price based on product category and selection
  const getCurrentPrice = () => {
    if (!product) return 0;

    // For set category, check if single item is selected
    if (product.category === 'set' && setItemSelection !== 'full') {
      if (setItemSelection === 'shirt-only') {
        // Use admin-defined shirt price or default to half the set price
        return product.setPricing?.shirtOnly || product.price / 2;
      } else if (setItemSelection === 'pants-only') {
        // Use admin-defined pants price or default to half the set price
        return product.setPricing?.pantsOnly || product.price / 2;
      }
    }

    // Default: return full product price
    return product.price;
  };

  const currentPrice = getCurrentPrice();

  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productData = await getProductById(id as string);
        if (productData) {
          setProduct(productData);
          // Set default order type and checkbox state based on category and thirdLevelCategory
          console.log('🔍 Product category:', productData.category, 'subcategory:', productData.subcategory, 'thirdLevel:', productData.thirdLevelCategory);

          if (productData.category === 'kimono') {
            // Kimono: default to individual, checkbox unchecked
            console.log('✅ Kimono - Setting to individual');
            setOrderType('individual');
            setShowFamilyOrder(false);
          } else if (productData.category === 'set') {
            // Special case: Family Sets (Aile Setleri) default to 'family', others default to 'individual'
            // Check thirdLevelCategory for 'family-sets' OR subcategory for legacy 'aile-setleri'
            if (productData.thirdLevelCategory === 'family-sets' || productData.subcategory === 'aile-setleri') {
              console.log('✅ Aile Setleri (Family Sets) - Setting to family');
              setOrderType('family');
              setShowFamilyOrder(true); // For Aile Setleri, checkbox starts checked (family mode)
            } else {
              console.log('✅ Normal Set - Setting to individual');
              setOrderType('individual');
              setShowFamilyOrder(false); // For normal sets, checkbox starts unchecked
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // Update children array when childCount changes
  useEffect(() => {
    if (orderType === 'family') {
      const currentCount = children.length;
      if (childCount > currentCount) {
        // Add new children
        const newChildren = Array.from({ length: childCount - currentCount }, (_, i) => ({
          id: `child-${Date.now()}-${i}`,
          gender: 'male' as Gender,
          age: '',
          height: '',
          weight: '',
          shirtLength: '',
          sleeveLength: '',
          pantsLength: '',
        }));
        setChildren([...children, ...newChildren]);
      } else if (childCount < currentCount) {
        // Remove children
        setChildren(children.slice(0, childCount));
      }
    }
  }, [childCount, orderType]);

  // Auto-fill measurements from size charts
  useEffect(() => {
    if (!size || !product) {
      console.log('Auto-fill skipped: size =', size, 'product =', !!product);
      return;
    }

    console.log('Auto-fill triggered: size =', size, 'category =', product.category, 'gender =', gender);

    if (product.category === 'kimono') {
      const chart = kimonoType === 'uzun' ? UZUN_KIMONO_SIZE_CHART : KISA_KIMONO_SIZE_CHART;
      const sizeRow = chart.rows.find(row => row.beden === size);

      console.log('Kimono chart:', chart.name, 'sizeRow:', sizeRow);

      if (sizeRow) {
        const kimonoBoy = sizeRow.kimonoBoyu?.replace('cm', '') || '';
        const kolBoy = sizeRow.kolBoyu?.replace('cm', '') || '';
        console.log('Setting kimono measurements:', { kimonoBoy, kolBoy });
        setShirtLength(kimonoBoy);
        setSleeveLength(kolBoy);
        setPantsLength('');
      }
    } else if (product.category === 'set') {
      let chart;
      if (isCropShirt && gender === 'female') {
        chart = KROP_GOMLEK_SIZE_CHART;
      } else if (gender === 'male') {
        chart = ERKEK_SET_SIZE_CHART;
      } else {
        chart = KADIN_SET_SIZE_CHART;
      }

      const sizeRow = chart.rows.find(row => row.beden === size);

      console.log('Set chart:', chart.name, 'sizeRow:', sizeRow);

      if (sizeRow) {
        if (setItemSelection === 'shirt-only') {
          const gomlekBoy = sizeRow.gomlekBoyu?.replace('cm', '') || '';
          const kolBoy = sizeRow.kolBoyu?.replace('cm', '') || '';
          console.log('Setting shirt-only measurements:', { gomlekBoy, kolBoy });
          setShirtLength(gomlekBoy);
          setSleeveLength(kolBoy);
          setPantsLength('');
        } else if (setItemSelection === 'pants-only') {
          const pantolonBoy = sizeRow.pantolonBoyu?.replace('cm', '') || '';
          console.log('Setting pants-only measurements:', { pantolonBoy });
          setShirtLength('');
          setSleeveLength('');
          setPantsLength(pantolonBoy);
        } else {
          const gomlekBoy = sizeRow.gomlekBoyu?.replace('cm', '') || '';
          const kolBoy = sizeRow.kolBoyu?.replace('cm', '') || '';
          const pantolonBoy = sizeRow.pantolonBoyu?.replace('cm', '') || '';
          console.log('Setting full set measurements:', { gomlekBoy, kolBoy, pantolonBoy });
          setShirtLength(gomlekBoy);
          setSleeveLength(kolBoy);
          setPantsLength(pantolonBoy);
        }
      }
    }
  }, [size, gender, kimonoType, product, isCropShirt, setItemSelection]);

  // Auto-fill measurements for Parent 1
  useEffect(() => {
    if (!parent1.size || !product || orderType !== 'family') return;

    console.log('Auto-fill Parent 1: size =', parent1.size, 'gender =', parent1.gender);

    if (product.category === 'kimono') {
      const chart = kimonoType === 'uzun' ? UZUN_KIMONO_SIZE_CHART : KISA_KIMONO_SIZE_CHART;
      const sizeRow = chart.rows.find(row => row.beden === parent1.size);

      if (sizeRow) {
        const kimonoBoy = sizeRow.kimonoBoyu?.replace('cm', '') || '';
        const kolBoy = sizeRow.kolBoyu?.replace('cm', '') || '';
        console.log('Setting Parent 1 kimono measurements:', { kimonoBoy, kolBoy });
        setParent1({
          ...parent1,
          shirtLength: kimonoBoy,
          sleeveLength: kolBoy,
          pantsLength: '',
        });
      }
    } else if (product.category === 'set') {
      const chart = parent1.gender === 'male' ? ERKEK_SET_SIZE_CHART : KADIN_SET_SIZE_CHART;
      const sizeRow = chart.rows.find(row => row.beden === parent1.size);

      if (sizeRow) {
        const gomlekBoy = sizeRow.gomlekBoyu?.replace('cm', '') || '';
        const kolBoy = sizeRow.kolBoyu?.replace('cm', '') || '';
        const pantolonBoy = sizeRow.pantolonBoyu?.replace('cm', '') || '';
        console.log('Setting Parent 1 set measurements:', { gomlekBoy, kolBoy, pantolonBoy });
        setParent1({
          ...parent1,
          shirtLength: gomlekBoy,
          sleeveLength: kolBoy,
          pantsLength: pantolonBoy,
        });
      }
    }
  }, [parent1.size, parent1.gender, product, orderType, kimonoType]);

  // Auto-fill measurements for Parent 2
  useEffect(() => {
    if (!parent2.size || !product || orderType !== 'family') return;

    console.log('Auto-fill Parent 2: size =', parent2.size, 'gender =', parent2.gender);

    if (product.category === 'kimono') {
      const chart = kimonoType === 'uzun' ? UZUN_KIMONO_SIZE_CHART : KISA_KIMONO_SIZE_CHART;
      const sizeRow = chart.rows.find(row => row.beden === parent2.size);

      if (sizeRow) {
        const kimonoBoy = sizeRow.kimonoBoyu?.replace('cm', '') || '';
        const kolBoy = sizeRow.kolBoyu?.replace('cm', '') || '';
        console.log('Setting Parent 2 kimono measurements:', { kimonoBoy, kolBoy });
        setParent2({
          ...parent2,
          shirtLength: kimonoBoy,
          sleeveLength: kolBoy,
          pantsLength: '',
        });
      }
    } else if (product.category === 'set') {
      const chart = parent2.gender === 'male' ? ERKEK_SET_SIZE_CHART : KADIN_SET_SIZE_CHART;
      const sizeRow = chart.rows.find(row => row.beden === parent2.size);

      if (sizeRow) {
        const gomlekBoy = sizeRow.gomlekBoyu?.replace('cm', '') || '';
        const kolBoy = sizeRow.kolBoyu?.replace('cm', '') || '';
        const pantolonBoy = sizeRow.pantolonBoyu?.replace('cm', '') || '';
        console.log('Setting Parent 2 set measurements:', { gomlekBoy, kolBoy, pantolonBoy });
        setParent2({
          ...parent2,
          shirtLength: gomlekBoy,
          sleeveLength: kolBoy,
          pantsLength: pantolonBoy,
        });
      }
    }
  }, [parent2.size, parent2.gender, product, orderType, kimonoType]);

  // Auto-calculate measurements for a child
  const calculateChildMeasurements = (age: string, height: string, weight: string) => {
    if (!age || !height || !weight) return null;

    const ageNum = parseInt(age);
    const heightNum = parseInt(height);

    if (ageNum >= 0 && ageNum <= 14 && heightNum > 0) {
      return {
        shirtLength: String(Math.round(heightNum * 0.4)),
        sleeveLength: String(Math.round(heightNum * 0.3)),
        pantsLength: String(Math.round(heightNum * 0.55)),
      };
    }
    return null;
  };

  const updateChild = (id: string, field: keyof ChildInfo, value: string) => {
    setChildren(prevChildren =>
      prevChildren.map(child => {
        if (child.id !== id) return child;

        const updatedChild = { ...child, [field]: value };

        // Auto-calculate measurements if age, height, or weight changes
        if (field === 'age' || field === 'height' || field === 'weight') {
          const measurements = calculateChildMeasurements(
            field === 'age' ? value : child.age,
            field === 'height' ? value : child.height,
            field === 'weight' ? value : child.weight
          );
          if (measurements) {
            updatedChild.shirtLength = measurements.shirtLength;
            updatedChild.sleeveLength = measurements.sleeveLength;
            updatedChild.pantsLength = measurements.pantsLength;
          }
        }

        return updatedChild;
      })
    );
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Create product object with adjusted price for single item selection
    const productWithPrice = product.category === 'set' && setItemSelection !== 'full'
      ? { ...product, price: currentPrice }
      : product;

    if (orderType === 'individual') {
      // Validate individual order
      if (!size) {
        alert(i18n.language === 'tr' ? 'Lütfen bir beden seçin' : 'Please select a size');
        return;
      }

      // Build special requests with item selection info
      let finalSpecialRequests = specialRequests || '';
      if (product.category === 'set' && setItemSelection !== 'full') {
        const itemNote = setItemSelection === 'shirt-only'
          ? (i18n.language === 'tr' ? 'Sadece Gömlek' : 'Shirt Only')
          : (i18n.language === 'tr' ? 'Sadece Pantolon' : 'Pants Only');
        finalSpecialRequests = finalSpecialRequests
          ? `${itemNote} - ${finalSpecialRequests}`
          : itemNote;
      }
      if (product.category === 'set' && isCropShirt && gender === 'female') {
        const cropNote = i18n.language === 'tr' ? 'Krop Gömlek' : 'Crop Shirt';
        finalSpecialRequests = finalSpecialRequests
          ? `${cropNote} - ${finalSpecialRequests}`
          : cropNote;
      }
      if (product.category === 'kimono' && kimonoType) {
        const typeNote = kimonoType === 'uzun'
          ? (i18n.language === 'tr' ? 'Uzun Kimono' : 'Long Kimono')
          : (i18n.language === 'tr' ? 'Kısa Kimono' : 'Short Kimono');
        finalSpecialRequests = finalSpecialRequests
          ? `${typeNote} - ${finalSpecialRequests}`
          : typeNote;
      }

      addToCart(
        productWithPrice,
        size,
        quantity,
        finalSpecialRequests || undefined,
        false,
        undefined,
        {
          shirtLength: shirtLength || undefined,
          sleeveLength: sleeveLength || undefined,
          pantsLength: pantsLength || undefined,
        }
      );

      router.push('/cart');
    } else {
      // Validate family order
      if (!parent1.size) {
        alert(
          i18n.language === 'tr'
            ? 'Lütfen 1. kişi için beden seçin'
            : 'Please select size for person 1'
        );
        return;
      }
      if (!parent2.size) {
        alert(
          i18n.language === 'tr'
            ? 'Lütfen 2. kişi için beden seçin'
            : 'Please select size for person 2'
        );
        return;
      }

      // Validate children
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child.age || !child.height || !child.weight) {
          alert(
            i18n.language === 'tr'
              ? `Lütfen ${i + 1}. çocuk için yaş, boy ve kilo bilgilerini girin`
              : `Please enter age, height and weight for child ${i + 1}`
          );
          return;
        }
      }

      // Add parent 1 to cart
      const parent1Label =
        i18n.language === 'tr'
          ? `${parent1.gender === 'male' ? 'Erkek' : 'Kadın'}${specialRequests ? ' - ' + specialRequests : ''}`
          : `${parent1.gender === 'male' ? 'Male' : 'Female'}${specialRequests ? ' - ' + specialRequests : ''}`;
      addToCart(
        productWithPrice,
        parent1.size,
        1,
        parent1Label,
        false,
        undefined,
        {
          shirtLength: parent1.shirtLength || undefined,
          sleeveLength: parent1.sleeveLength || undefined,
          pantsLength: parent1.pantsLength || undefined,
        }
      );

      // Add parent 2 to cart
      const parent2Label =
        i18n.language === 'tr'
          ? `${parent2.gender === 'male' ? 'Erkek' : 'Kadın'}${specialRequests ? ' - ' + specialRequests : ''}`
          : `${parent2.gender === 'male' ? 'Male' : 'Female'}${specialRequests ? ' - ' + specialRequests : ''}`;
      addToCart(
        productWithPrice,
        parent2.size,
        1,
        parent2Label,
        false,
        undefined,
        {
          shirtLength: parent2.shirtLength || undefined,
          sleeveLength: parent2.sleeveLength || undefined,
          pantsLength: parent2.pantsLength || undefined,
        }
      );

      // Add each child to cart
      children.forEach((child, index) => {
        const childLabel =
          i18n.language === 'tr'
            ? `Çocuk ${index + 1} (${child.gender === 'male' ? 'Erkek' : 'Kız'}, ${child.age} yaş)${specialRequests ? ' - ' + specialRequests : ''}`
            : `Child ${index + 1} (${child.gender === 'male' ? 'Boy' : 'Girl'}, ${child.age} years old)${specialRequests ? ' - ' + specialRequests : ''}`;
        addToCart(
          productWithPrice,
          'Özel Ölçü',
          1,
          childLabel,
          false,
          undefined,
          {
            shirtLength: child.shirtLength || undefined,
            sleeveLength: child.sleeveLength || undefined,
            pantsLength: child.pantsLength || undefined,
          }
        );
      });

      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black dark:text-white text-2xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-black dark:text-white text-2xl">
          {i18n.language === 'tr' ? 'Ürün bulunamadı' : 'Product not found'}
        </div>
        <Link href="/products" className="btn-primary">
          {i18n.language === 'tr' ? 'Ürünlere Dön' : 'Back to Products'}
        </Link>
      </div>
    );
  }

  const name = i18n.language === 'tr' ? product.name : product.nameEn;
  const description = i18n.language === 'tr' ? product.description : product.descriptionEn;

  // Determine order type button order based on category
  const isSetProduct = product.category === 'set';

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 text-black dark:text-white hover:text-mea-gold transition-colors mb-8">
          <ArrowLeft size={20} />
          {i18n.language === 'tr' ? 'Ürüne Dön' : 'Back to Product'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Image Gallery */}
          <div className="glass rounded-2xl p-8">
            {/* Only show white background images */}
            {product.whiteBackgroundImages && product.whiteBackgroundImages.length > 0 && (
              <>
                {/* Main Image Display */}
                <div className="relative aspect-[3/4] bg-zinc-800 rounded-xl overflow-hidden mb-6">
                  <img
                    src={product.whiteBackgroundImages[currentImageIndex]}
                    alt={`${name} - ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Thumbnail Gallery - Only show if more than 1 image */}
                {product.whiteBackgroundImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {product.whiteBackgroundImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative aspect-square bg-zinc-800 rounded-lg overflow-hidden transition-all ${
                          currentImageIndex === idx
                            ? 'ring-2 ring-mea-gold'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            <h2 className="text-3xl font-bold text-black dark:text-white mb-4">{name}</h2>
            <div className="mb-4 formatted-description">
              {description}
            </div>
          </div>

          {/* Right: Customization Form */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
              {i18n.language === 'tr' ? 'Sipariş Detayları' : 'Order Details'}
            </h3>

            {/* Order Type Selection */}
            {product.category === 'kimono' ? (
              /* Kimono: Checkbox for family order */
              <div className="mb-8">
                <label className="flex items-center gap-3 text-black dark:text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={orderType === 'family'}
                    onChange={(e) => {
                      setOrderType(e.target.checked ? 'family' : 'individual');
                      setShowFamilyOrder(e.target.checked);
                    }}
                    className="w-5 h-5 rounded border-gray-600 text-mea-gold focus:ring-mea-gold focus:ring-offset-0"
                  />
                  <span className="font-semibold">
                    {i18n.language === 'tr' ? 'Ailece sipariş vermek istiyorum' : 'I want to order for family'}
                  </span>
                </label>
              </div>
            ) : (
              /* Set: Checkbox for family/individual order based on thirdLevelCategory */
              <div className="mb-8">
                {(product.thirdLevelCategory === 'family-sets' || product.subcategory === 'aile-setleri') ? (
                  /* Aile Setleri: Checkbox for individual order (opposite) */
                  <label className="flex items-center gap-3 text-black dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderType === 'individual'}
                      onChange={(e) => {
                        setOrderType(e.target.checked ? 'individual' : 'family');
                        setShowFamilyOrder(!e.target.checked);
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-mea-gold focus:ring-mea-gold focus:ring-offset-0"
                    />
                    <span className="font-semibold">
                      {i18n.language === 'tr' ? 'Bireysel sipariş vermek istiyorum' : 'I want to order individually'}
                    </span>
                  </label>
                ) : (
                  /* Normal Sets: Checkbox for family order */
                  <label className="flex items-center gap-3 text-black dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orderType === 'family'}
                      onChange={(e) => {
                        setOrderType(e.target.checked ? 'family' : 'individual');
                        setShowFamilyOrder(e.target.checked);
                      }}
                      className="w-5 h-5 rounded border-gray-600 text-mea-gold focus:ring-mea-gold focus:ring-offset-0"
                    />
                    <span className="font-semibold">
                      {i18n.language === 'tr' ? 'Ailece sipariş vermek istiyorum' : 'I want to order for family'}
                    </span>
                  </label>
                )}
              </div>
            )}

            {orderType === 'individual' ? (
              /* Individual Order Form */
              <div className="space-y-6">
                {/* Gender Selection */}
                <div>
                  <label className="block text-black dark:text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGender('male')}
                      className={`p-3 rounded-lg transition-all ${
                        gender === 'male'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                          : 'text-black dark:text-white hover:opacity-80'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`p-3 rounded-lg transition-all ${
                        gender === 'female'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                          : 'text-black dark:text-white hover:opacity-80'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Kadın' : 'Female'}
                    </button>
                  </div>
                </div>

                {/* Crop Shirt Option - Only for single shirt purchases */}
                {product.category === 'set' && gender === 'female' && setItemSelection === 'shirt-only' && (
                  <div>
                    <label className="flex items-center gap-3 text-black dark:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCropShirt}
                        onChange={(e) => setIsCropShirt(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 text-mea-gold focus:ring-mea-gold focus:ring-offset-0"
                      />
                      <span className="font-semibold">
                        {i18n.language === 'tr' ? 'Krop gömlek istiyorum' : 'I want crop shirt'}
                      </span>
                    </label>
                  </div>
                )}

                {/* Set Item Selection - Only for Set category */}
                {product.category === 'set' && (
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-black dark:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={setItemSelection !== 'full'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSetItemSelection('shirt-only');
                          } else {
                            setSetItemSelection('full');
                          }
                        }}
                        className="w-5 h-5 rounded border-gray-600 text-mea-gold focus:ring-mea-gold focus:ring-offset-0"
                      />
                      <span className="font-semibold">
                        {i18n.language === 'tr' ? 'Tek parça almak istiyorum' : 'I want single item'}
                      </span>
                    </label>

                    {/* Radio buttons for single item selection */}
                    {setItemSelection !== 'full' && (
                      <div className="ml-8 space-y-2">
                        <label className="flex items-center gap-3 text-black dark:text-white cursor-pointer">
                          <input
                            type="radio"
                            name="setItem"
                            checked={setItemSelection === 'shirt-only'}
                            onChange={() => setSetItemSelection('shirt-only')}
                            className="w-4 h-4 border-gray-600 text-mea-gold focus:ring-mea-gold focus:ring-offset-0"
                          />
                          <span>{i18n.language === 'tr' ? 'Sadece Gömlek' : 'Shirt Only'}</span>
                        </label>
                        <label className="flex items-center gap-3 text-black dark:text-white cursor-pointer">
                          <input
                            type="radio"
                            name="setItem"
                            checked={setItemSelection === 'pants-only'}
                            onChange={() => setSetItemSelection('pants-only')}
                            className="w-4 h-4 border-gray-600 text-mea-gold focus:ring-mea-gold focus:ring-offset-0"
                          />
                          <span>{i18n.language === 'tr' ? 'Sadece Pantolon' : 'Pants Only'}</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                {/* Size Selection */}
                <div>
                  <label className="block text-black dark:text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Beden' : 'Size'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {STANDARD_SIZES.map((sizeOption) => (
                      <button
                        key={sizeOption}
                        onClick={() => setSize(sizeOption)}
                        className={`p-3 rounded-lg transition-all ${
                          size === sizeOption
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                            : 'text-black dark:text-white hover:text-black dark:text-white border border-gray-600'
                        }`}
                      >
                        {sizeOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Measurements */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">
                    {i18n.language === 'tr' ? 'Özel Ölçüler (Opsiyonel)' : 'Custom Measurements (Optional)'}
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {/* First field - Kimono Boyu OR Gömlek Boyu */}
                    {(product.category === 'set' ? setItemSelection !== 'pants-only' : true) && (
                      <div>
                        <label className="block text-black dark:text-white text-sm mb-2">
                          {product.category === 'kimono'
                            ? (i18n.language === 'tr' ? 'Kimono Boyu (cm)' : 'Kimono Length (cm)')
                            : (i18n.language === 'tr' ? 'Gömlek Boyu (cm)' : 'Shirt Length (cm)')
                          }
                        </label>
                        <input
                          type="number"
                          value={shirtLength}
                          onChange={(e) => setShirtLength(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="cm"
                        />
                      </div>
                    )}

                    {/* Second field - Kol Boyu (always shown except for pants-only) */}
                    {(product.category === 'set' ? setItemSelection !== 'pants-only' : true) && (
                      <div>
                        <label className="block text-black dark:text-white text-sm mb-2">
                          {i18n.language === 'tr' ? 'Kol Boyu (cm)' : 'Sleeve Length (cm)'}
                        </label>
                        <input
                          type="number"
                          value={sleeveLength}
                          onChange={(e) => setSleeveLength(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="cm"
                        />
                      </div>
                    )}

                    {/* Third field - Pantolon Boyu (only for set, not for shirt-only) */}
                    {product.category === 'set' && setItemSelection !== 'shirt-only' && (
                      <div>
                        <label className="block text-black dark:text-white text-sm mb-2">
                          {i18n.language === 'tr' ? 'Pantolon Boyu (cm)' : 'Pants Length (cm)'}
                        </label>
                        <input
                          type="number"
                          value={pantsLength}
                          onChange={(e) => setPantsLength(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="cm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-black dark:text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Adet' : 'Quantity'}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      <Minus size={20} className="text-black dark:text-white" />
                    </button>
                    <span className="text-2xl font-bold text-black dark:text-white w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      <Plus size={20} className="text-black dark:text-white" />
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="glass rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-black dark:text-white font-medium">
                      {i18n.language === 'tr' ? 'Toplam Fiyat:' : 'Total Price:'}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {formatPrice(currentPrice * quantity, i18n.language)}
                    </span>
                  </div>
                  {quantity > 1 && (
                    <p className="text-black dark:text-white text-sm mt-2">
                      {formatPrice(currentPrice, i18n.language)} × {quantity}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Family Order Form */
              <div className="space-y-8">
                <p className="text-black dark:text-white text-sm">
                  {i18n.language === 'tr'
                    ? 'Aile siparişi otomatik olarak 2 kişi içerir. İstediğiniz sayıda çocuk ekleyebilirsiniz. (14 yaş ve altı çocuk sayılır)'
                    : 'Family order automatically includes 2 people. You can add any number of children. (14 years old and under counts as child)'}
                </p>

                {/* Child Count Selection */}
                <div>
                  <label className="block text-black dark:text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Çocuk Sayısı' : 'Number of Children'}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                      disabled={childCount === 0}
                    >
                      <Minus size={20} className="text-black dark:text-white" />
                    </button>
                    <span className="text-2xl font-bold text-black dark:text-white w-12 text-center">{childCount}</span>
                    <button
                      onClick={() => setChildCount(Math.min(10, childCount + 1))}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      <Plus size={20} className="text-black dark:text-white" />
                    </button>
                  </div>
                  <p className="text-black dark:text-white text-sm mt-2">
                    {i18n.language === 'tr' ? '0-10 arası çocuk ekleyebilirsiniz' : 'You can add 0-10 children'}
                  </p>
                </div>

                {/* Parent 1 Section */}
                <div className="glass rounded-lg p-6 space-y-4 border-2 border-blue-500 border-opacity-30">
                  <h4 className="text-white font-bold text-lg">
                    {i18n.language === 'tr' ? 'Kişi 1' : 'Person 1'}
                  </h4>

                  {/* Parent 1 Gender */}
                  <div>
                    <label className="block text-black dark:text-white text-sm mb-2">
                      {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setParent1({ ...parent1, gender: 'male' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent1.gender === 'male'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                            : 'text-black dark:text-white hover:opacity-80'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                      </button>
                      <button
                        onClick={() => setParent1({ ...parent1, gender: 'female' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent1.gender === 'female'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                            : 'text-black dark:text-white hover:opacity-80'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Kadın' : 'Female'}
                      </button>
                    </div>
                  </div>

                  {/* Parent 1 Size */}
                  <div>
                    <label className="block text-black dark:text-white text-sm mb-2">
                      {i18n.language === 'tr' ? 'Beden' : 'Size'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {STANDARD_SIZES.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          onClick={() => setParent1({ ...parent1, size: sizeOption })}
                          className={`p-2 rounded-lg transition-all text-sm ${
                            parent1.size === sizeOption
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                              : 'text-black dark:text-white hover:text-black dark:text-white border border-gray-600'
                          }`}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parent 1 Measurements */}
                  <div>
                    <label className="block text-black dark:text-white text-sm mb-2">
                      {i18n.language === 'tr' ? 'Özel Ölçüler (Opsiyonel)' : 'Custom Measurements (Optional)'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          value={parent1.shirtLength}
                          onChange={(e) => setParent1({ ...parent1, shirtLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Gömlek (cm)' : 'Shirt (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={parent1.sleeveLength}
                          onChange={(e) => setParent1({ ...parent1, sleeveLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Kol (cm)' : 'Sleeve (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={parent1.pantsLength}
                          onChange={(e) => setParent1({ ...parent1, pantsLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Pantolon (cm)' : 'Pants (cm)'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parent 2 Section */}
                <div className="glass rounded-lg p-6 space-y-4 border-2 border-pink-500 border-opacity-30">
                  <h4 className="text-white font-bold text-lg">
                    {i18n.language === 'tr' ? 'Kişi 2' : 'Person 2'}
                  </h4>

                  {/* Parent 2 Gender */}
                  <div>
                    <label className="block text-black dark:text-white text-sm mb-2">
                      {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setParent2({ ...parent2, gender: 'male' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent2.gender === 'male'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                            : 'text-black dark:text-white hover:opacity-80'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                      </button>
                      <button
                        onClick={() => setParent2({ ...parent2, gender: 'female' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent2.gender === 'female'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                            : 'text-black dark:text-white hover:opacity-80'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Kadın' : 'Female'}
                      </button>
                    </div>
                  </div>

                  {/* Parent 2 Size */}
                  <div>
                    <label className="block text-black dark:text-white text-sm mb-2">
                      {i18n.language === 'tr' ? 'Beden' : 'Size'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {STANDARD_SIZES.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          onClick={() => setParent2({ ...parent2, size: sizeOption })}
                          className={`p-2 rounded-lg transition-all text-sm ${
                            parent2.size === sizeOption
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                              : 'text-black dark:text-white hover:text-black dark:text-white border border-gray-600'
                          }`}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parent 2 Measurements */}
                  <div>
                    <label className="block text-black dark:text-white text-sm mb-2">
                      {i18n.language === 'tr' ? 'Özel Ölçüler (Opsiyonel)' : 'Custom Measurements (Optional)'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          value={parent2.shirtLength}
                          onChange={(e) => setParent2({ ...parent2, shirtLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Gömlek (cm)' : 'Shirt (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={parent2.sleeveLength}
                          onChange={(e) => setParent2({ ...parent2, sleeveLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Kol (cm)' : 'Sleeve (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={parent2.pantsLength}
                          onChange={(e) => setParent2({ ...parent2, pantsLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Pantolon (cm)' : 'Pants (cm)'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Children Sections */}
                {children.map((child, index) => (
                  <div key={child.id} className="glass rounded-lg p-6 space-y-4 border-2 border-green-500 border-opacity-30">
                    <h4 className="text-white font-bold text-lg flex items-center gap-2">
                      {i18n.language === 'tr' ? `Çocuk ${index + 1}` : `Child ${index + 1}`}
                      <span className="text-xs text-black dark:text-white font-normal ml-2">
                        {i18n.language === 'tr' ? '(14 yaş ve altı)' : '(14 years old and under)'}
                      </span>
                    </h4>

                    {/* Child Gender */}
                    <div>
                      <label className="block text-black dark:text-white text-sm mb-2">
                        {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => updateChild(child.id, 'gender', 'male')}
                          className={`p-3 rounded-lg transition-all ${
                            child.gender === 'male'
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                              : 'text-black dark:text-white hover:opacity-80'
                          }`}
                        >
                          {i18n.language === 'tr' ? 'Erkek' : 'Boy'}
                        </button>
                        <button
                          onClick={() => updateChild(child.id, 'gender', 'female')}
                          className={`p-3 rounded-lg transition-all ${
                            child.gender === 'female'
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-black dark:text-white'
                              : 'text-black dark:text-white hover:opacity-80'
                          }`}
                        >
                          {i18n.language === 'tr' ? 'Kız' : 'Girl'}
                        </button>
                      </div>
                    </div>

                    {/* Child Info */}
                    <div>
                      <label className="block text-black dark:text-white text-sm mb-2">
                        {i18n.language === 'tr' ? 'Çocuk Bilgileri' : 'Child Information'}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <input
                            type="number"
                            min="0"
                            max="14"
                            value={child.age}
                            onChange={(e) => updateChild(child.id, 'age', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                            placeholder={i18n.language === 'tr' ? 'Yaş (0-14)' : 'Age (0-14)'}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={child.height}
                            onChange={(e) => updateChild(child.id, 'height', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                            placeholder={i18n.language === 'tr' ? 'Boy (cm)' : 'Height (cm)'}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={child.weight}
                            onChange={(e) => updateChild(child.id, 'weight', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                            placeholder={i18n.language === 'tr' ? 'Kilo (kg)' : 'Weight (kg)'}
                          />
                        </div>
                      </div>
                      {child.age && child.height && child.weight && (
                        <p className="text-green-400 text-xs mt-2">
                          {i18n.language === 'tr' ? '✓ Ölçüler otomatik hesaplandı' : '✓ Measurements auto-calculated'}
                        </p>
                      )}
                    </div>

                    {/* Child Measurements - Editable fields for algorithm results */}
                    {child.shirtLength && (
                      <div>
                        <label className="block text-black dark:text-white text-sm mb-2">
                          {i18n.language === 'tr' ? 'Hesaplanan Ölçüler (Düzenlenebilir)' : 'Calculated Measurements (Editable)'}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <input
                              type="number"
                              value={child.shirtLength}
                              onChange={(e) => updateChild(child.id, 'shirtLength', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                              placeholder={i18n.language === 'tr' ? 'Gömlek (cm)' : 'Shirt (cm)'}
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={child.sleeveLength}
                              onChange={(e) => updateChild(child.id, 'sleeveLength', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                              placeholder={i18n.language === 'tr' ? 'Kol (cm)' : 'Sleeve (cm)'}
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={child.pantsLength}
                              onChange={(e) => updateChild(child.id, 'pantsLength', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                              placeholder={i18n.language === 'tr' ? 'Pantolon (cm)' : 'Pants (cm)'}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {childCount === 0 && (
                  <div className="text-center py-4 text-black dark:text-white text-sm">
                    {i18n.language === 'tr'
                      ? 'Çocuk eklenmedi. Yukarıdan çocuk sayısını seçebilirsiniz.'
                      : 'No children added. You can select the number of children above.'}
                  </div>
                )}
              </div>
            )}

            {/* Price Display */}
            <div className="mt-8 p-6 glass rounded-xl border-2 border-mea-gold border-opacity-30">
              <div className="flex justify-between items-center">
                <span className="text-black font-semibold text-lg">
                  {i18n.language === 'tr' ? 'Fiyat' : 'Price'}
                </span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-black">
                    {formatPrice(currentPrice, i18n.language)}
                  </div>
                  {product.category === 'set' && setItemSelection !== 'full' && (
                    <div className="text-xs text-black dark:text-white mt-1">
                      {setItemSelection === 'shirt-only'
                        ? (i18n.language === 'tr' ? 'Sadece Gömlek' : 'Shirt Only')
                        : (i18n.language === 'tr' ? 'Sadece Pantolon' : 'Pants Only')
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="mt-8">
              <label className="block text-black dark:text-white font-semibold mb-3">
                {i18n.language === 'tr' ? 'Özel İstekleriniz' : 'Special Requests'}
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none resize-none"
                rows={4}
                placeholder={i18n.language === 'tr' ? 'Özel isteklerinizi buraya yazabilirsiniz...' : 'You can write your special requests here...'}
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full btn-primary flex items-center justify-center gap-3 mt-8"
            >
              <ShoppingCart size={24} />
              {i18n.language === 'tr' ? 'Sepete Ekle' : 'Add to Cart'}
            </button>

            {/* Size Chart Button */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowSizeChartModal(true)}
                className="text-mea-gold hover:text-yellow-500 transition-colors underline"
              >
                {t('products.viewSizeChart')}
              </button>
            </div>
          </div>
        </div>

        {/* Size Chart Modal */}
        <AnimatePresence>
          {showSizeChartModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    {t('products.sizeChartModal')}
                  </h2>
                  <button
                    onClick={() => setShowSizeChartModal(false)}
                    className="text-black dark:text-white hover:text-mea-gold transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  {product.category === 'kimono' ? (
                    <>
                      {/* Uzun Kimono Beden Tablosu */}
                      <div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                          {i18n.language === 'tr' ? 'Uzun Kimono Beden Tablosu' : 'Long Kimono Size Chart'}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-white">
                            <thead>
                              <tr className="border-b border-white border-opacity-20">
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Beden' : 'Size'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Kimono Boyu' : 'Kimono Length'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Kol Boyu' : 'Sleeve Length'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {UZUN_KIMONO_SIZE_CHART.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-white border-opacity-10">
                                  <td className="py-3 px-4 font-semibold text-black dark:text-white">{row.beden}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.kimonoBoyu}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.kolBoyu}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Kısa Kimono Beden Tablosu */}
                      <div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                          {i18n.language === 'tr' ? 'Kısa Kimono Beden Tablosu' : 'Short Kimono Size Chart'}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-white">
                            <thead>
                              <tr className="border-b border-white border-opacity-20">
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Beden' : 'Size'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Kimono Boyu' : 'Kimono Length'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Kol Boyu' : 'Sleeve Length'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {KISA_KIMONO_SIZE_CHART.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-white border-opacity-10">
                                  <td className="py-3 px-4 font-semibold text-black dark:text-white">{row.beden}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.kimonoBoyu}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.kolBoyu}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Kadın Set Beden Tablosu */}
                      <div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                          {i18n.language === 'tr' ? 'Kadın Set Beden Tablosu' : 'Women Set Size Chart'}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-white">
                            <thead>
                              <tr className="border-b border-white border-opacity-20">
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Beden' : 'Size'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Pantolon Boyu' : 'Pants Length'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Gömlek Boyu' : 'Shirt Length'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Kol Boyu' : 'Sleeve Length'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {KADIN_SET_SIZE_CHART.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-white border-opacity-10">
                                  <td className="py-3 px-4 font-semibold text-black dark:text-white">{row.beden}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.pantolonBoyu}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.gomlekBoyu}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.kolBoyu}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Erkek Set Beden Tablosu */}
                      <div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                          {i18n.language === 'tr' ? 'Erkek Set Beden Tablosu' : 'Men Set Size Chart'}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-white">
                            <thead>
                              <tr className="border-b border-white border-opacity-20">
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Beden' : 'Size'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Pantolon Boyu' : 'Pants Length'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Gömlek Boyu' : 'Shirt Length'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Kol Boyu' : 'Sleeve Length'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ERKEK_SET_SIZE_CHART.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-white border-opacity-10">
                                  <td className="py-3 px-4 font-semibold text-black dark:text-white">{row.beden}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.pantolonBoyu}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.gomlekBoyu}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.kolBoyu}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Krop Gömlek Beden Tablosu */}
                      <div>
                        <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                          {i18n.language === 'tr' ? 'Krop Gömlek Beden Tablosu' : 'Crop Shirt Size Chart'}
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-white">
                            <thead>
                              <tr className="border-b border-white border-opacity-20">
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Beden' : 'Size'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Gömlek Boyu' : 'Shirt Length'}</th>
                                <th className="text-left py-3 px-4 text-black dark:text-white">{i18n.language === 'tr' ? 'Kol Boyu' : 'Sleeve Length'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {KROP_GOMLEK_SIZE_CHART.rows.map((row, idx) => (
                                <tr key={idx} className="border-b border-white border-opacity-10">
                                  <td className="py-3 px-4 font-semibold text-black dark:text-white">{row.beden}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.gomlekBoyu}</td>
                                  <td className="py-3 px-4 text-black dark:text-white">{row.kolBoyu}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
