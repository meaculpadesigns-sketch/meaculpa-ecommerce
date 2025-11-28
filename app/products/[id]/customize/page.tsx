'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { getProductById } from '@/lib/firebase-helpers';
import { formatPrice } from '@/lib/currency';
import { useCart } from '@/lib/cart-context';

type OrderType = 'individual' | 'family';
type Gender = 'male' | 'female';

interface ParentInfo {
  gender: Gender;
  size: string;
  shirtLength: string;
  sleeveLength: string;
  pajamaLength: string;
}

interface ChildInfo {
  id: string;
  gender: Gender;
  age: string;
  height: string;
  weight: string;
  shirtLength: string;
  sleeveLength: string;
  pajamaLength: string;
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
  const [pajamaLength, setPajamaLength] = useState('');

  // Family order state
  const [childCount, setChildCount] = useState(0);
  const [parent1, setParent1] = useState<ParentInfo>({
    gender: 'male',
    size: '',
    shirtLength: '',
    sleeveLength: '',
    pajamaLength: '',
  });
  const [parent2, setParent2] = useState<ParentInfo>({
    gender: 'female',
    size: '',
    shirtLength: '',
    sleeveLength: '',
    pajamaLength: '',
  });
  const [children, setChildren] = useState<ChildInfo[]>([]);

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
          // Set default order type based on category
          if (productData.category === 'kimono') {
            setOrderType('individual');
          } else if (productData.category === 'set') {
            setOrderType('family');
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
          pajamaLength: '',
        }));
        setChildren([...children, ...newChildren]);
      } else if (childCount < currentCount) {
        // Remove children
        setChildren(children.slice(0, childCount));
      }
    }
  }, [childCount, orderType]);

  // Auto-calculate measurements for a child
  const calculateChildMeasurements = (age: string, height: string, weight: string) => {
    if (!age || !height || !weight) return null;

    const ageNum = parseInt(age);
    const heightNum = parseInt(height);

    if (ageNum >= 0 && ageNum <= 14 && heightNum > 0) {
      return {
        shirtLength: String(Math.round(heightNum * 0.4)),
        sleeveLength: String(Math.round(heightNum * 0.3)),
        pajamaLength: String(Math.round(heightNum * 0.55)),
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
            updatedChild.pajamaLength = measurements.pajamaLength;
          }
        }

        return updatedChild;
      })
    );
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (orderType === 'individual') {
      // Validate individual order
      if (!size) {
        alert(i18n.language === 'tr' ? 'Lütfen bir beden seçin' : 'Please select a size');
        return;
      }

      addToCart(
        product,
        size,
        quantity,
        specialRequests || undefined,
        false,
        undefined,
        {
          shirtLength: shirtLength || undefined,
          sleeveLength: sleeveLength || undefined,
          pajamaLength: pajamaLength || undefined,
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
        product,
        parent1.size,
        1,
        parent1Label,
        false,
        undefined,
        {
          shirtLength: parent1.shirtLength || undefined,
          sleeveLength: parent1.sleeveLength || undefined,
          pajamaLength: parent1.pajamaLength || undefined,
        }
      );

      // Add parent 2 to cart
      const parent2Label =
        i18n.language === 'tr'
          ? `${parent2.gender === 'male' ? 'Erkek' : 'Kadın'}${specialRequests ? ' - ' + specialRequests : ''}`
          : `${parent2.gender === 'male' ? 'Male' : 'Female'}${specialRequests ? ' - ' + specialRequests : ''}`;
      addToCart(
        product,
        parent2.size,
        1,
        parent2Label,
        false,
        undefined,
        {
          shirtLength: parent2.shirtLength || undefined,
          sleeveLength: parent2.sleeveLength || undefined,
          pajamaLength: parent2.pajamaLength || undefined,
        }
      );

      // Add each child to cart
      children.forEach((child, index) => {
        const childLabel =
          i18n.language === 'tr'
            ? `Çocuk ${index + 1} (${child.gender === 'male' ? 'Erkek' : 'Kız'}, ${child.age} yaş)${specialRequests ? ' - ' + specialRequests : ''}`
            : `Child ${index + 1} (${child.gender === 'male' ? 'Boy' : 'Girl'}, ${child.age} years old)${specialRequests ? ' - ' + specialRequests : ''}`;
        addToCart(
          product,
          'Özel Ölçü',
          1,
          childLabel,
          false,
          undefined,
          {
            shirtLength: child.shirtLength || undefined,
            sleeveLength: child.sleeveLength || undefined,
            pajamaLength: child.pajamaLength || undefined,
          }
        );
      });

      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-white text-2xl">
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
        <Link href={`/products/${product.id}`} className="inline-flex items-center gap-2 text-white hover:text-mea-gold transition-colors mb-8">
          <ArrowLeft size={20} />
          {i18n.language === 'tr' ? 'Ürüne Dön' : 'Back to Product'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <div className="glass rounded-2xl p-8">
            <div className="relative aspect-[3/4] bg-zinc-800 rounded-xl overflow-hidden mb-6">
              {product.fabricImages && product.fabricImages.length > 0 ? (
                <img
                  src={product.fabricImages[0]}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  {t('home.productView')}
                </div>
              )}
            </div>

            <h2 className="text-3xl font-bold text-white mb-4">{name}</h2>
            <p className="text-gray-300 mb-4">{description}</p>
            <div className="text-4xl font-bold text-mea-gold">
              {formatPrice(product.price, i18n.language)}
            </div>
          </div>

          {/* Right: Customization Form */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              {i18n.language === 'tr' ? 'Sipariş Detayları' : 'Order Details'}
            </h3>

            {/* Order Type Selection */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3">
                {i18n.language === 'tr' ? 'Sipariş Tipi' : 'Order Type'}
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* For Set: Family first, Individual second */}
                {/* For Kimono: Individual first, Family second */}
                {isSetProduct ? (
                  <>
                    <button
                      onClick={() => setOrderType('family')}
                      className={`p-4 rounded-xl transition-all ${
                        orderType === 'family'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Aile' : 'Family'}
                    </button>
                    <button
                      onClick={() => setOrderType('individual')}
                      className={`p-4 rounded-xl transition-all ${
                        orderType === 'individual'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Bireysel' : 'Individual'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setOrderType('individual')}
                      className={`p-4 rounded-xl transition-all ${
                        orderType === 'individual'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Bireysel' : 'Individual'}
                    </button>
                    <button
                      onClick={() => setOrderType('family')}
                      className={`p-4 rounded-xl transition-all ${
                        orderType === 'family'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Aile' : 'Family'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {orderType === 'individual' ? (
              /* Individual Order Form */
              <div className="space-y-6">
                {/* Gender Selection */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGender('male')}
                      className={`p-3 rounded-lg transition-all ${
                        gender === 'male'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`p-3 rounded-lg transition-all ${
                        gender === 'female'
                          ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Kadın' : 'Female'}
                    </button>
                  </div>
                </div>

                {/* Size Selection */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Beden' : 'Size'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {STANDARD_SIZES.map((sizeOption) => (
                      <button
                        key={sizeOption}
                        onClick={() => setSize(sizeOption)}
                        className={`p-3 rounded-lg transition-all ${
                          size === sizeOption
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                            : 'text-gray-400 hover:text-gray-300 border border-gray-600'
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
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {i18n.language === 'tr' ? 'Gömlek Boyu (cm)' : 'Shirt Length (cm)'}
                      </label>
                      <input
                        type="number"
                        value={shirtLength}
                        onChange={(e) => setShirtLength(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                        placeholder="cm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
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
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {i18n.language === 'tr' ? 'Pijama Boyu (cm)' : 'Pajama Length (cm)'}
                      </label>
                      <input
                        type="number"
                        value={pajamaLength}
                        onChange={(e) => setPajamaLength(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                        placeholder="cm"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Adet' : 'Quantity'}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      <Minus size={20} className="text-white" />
                    </button>
                    <span className="text-2xl font-bold text-white w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      <Plus size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Family Order Form */
              <div className="space-y-8">
                <p className="text-gray-300 text-sm">
                  {i18n.language === 'tr'
                    ? 'Aile siparişi otomatik olarak 2 kişi içerir. İstediğiniz sayıda çocuk ekleyebilirsiniz. (14 yaş ve altı çocuk sayılır)'
                    : 'Family order automatically includes 2 people. You can add any number of children. (14 years old and under counts as child)'}
                </p>

                {/* Child Count Selection */}
                <div>
                  <label className="block text-white font-semibold mb-3">
                    {i18n.language === 'tr' ? 'Çocuk Sayısı' : 'Number of Children'}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setChildCount(Math.max(0, childCount - 1))}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                      disabled={childCount === 0}
                    >
                      <Minus size={20} className="text-white" />
                    </button>
                    <span className="text-2xl font-bold text-white w-12 text-center">{childCount}</span>
                    <button
                      onClick={() => setChildCount(Math.min(10, childCount + 1))}
                      className="p-2 glass rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      <Plus size={20} className="text-white" />
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
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
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setParent1({ ...parent1, gender: 'male' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent1.gender === 'male'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                      </button>
                      <button
                        onClick={() => setParent1({ ...parent1, gender: 'female' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent1.gender === 'female'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Kadın' : 'Female'}
                      </button>
                    </div>
                  </div>

                  {/* Parent 1 Size */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Beden' : 'Size'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {STANDARD_SIZES.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          onClick={() => setParent1({ ...parent1, size: sizeOption })}
                          className={`p-2 rounded-lg transition-all text-sm ${
                            parent1.size === sizeOption
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                              : 'text-gray-400 hover:text-gray-300 border border-gray-600'
                          }`}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parent 1 Measurements */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
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
                          value={parent1.pajamaLength}
                          onChange={(e) => setParent1({ ...parent1, pajamaLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Pijama (cm)' : 'Pajama (cm)'}
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
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setParent2({ ...parent2, gender: 'male' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent2.gender === 'male'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                      </button>
                      <button
                        onClick={() => setParent2({ ...parent2, gender: 'female' })}
                        className={`p-3 rounded-lg transition-all ${
                          parent2.gender === 'female'
                            ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                      >
                        {i18n.language === 'tr' ? 'Kadın' : 'Female'}
                      </button>
                    </div>
                  </div>

                  {/* Parent 2 Size */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Beden' : 'Size'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {STANDARD_SIZES.map((sizeOption) => (
                        <button
                          key={sizeOption}
                          onClick={() => setParent2({ ...parent2, size: sizeOption })}
                          className={`p-2 rounded-lg transition-all text-sm ${
                            parent2.size === sizeOption
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                              : 'text-gray-400 hover:text-gray-300 border border-gray-600'
                          }`}
                        >
                          {sizeOption}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parent 2 Measurements */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
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
                          value={parent2.pajamaLength}
                          onChange={(e) => setParent2({ ...parent2, pajamaLength: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Pijama (cm)' : 'Pajama (cm)'}
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
                      <span className="text-xs text-gray-400 font-normal ml-2">
                        {i18n.language === 'tr' ? '(14 yaş ve altı)' : '(14 years old and under)'}
                      </span>
                    </h4>

                    {/* Child Gender */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => updateChild(child.id, 'gender', 'male')}
                          className={`p-3 rounded-lg transition-all ${
                            child.gender === 'male'
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          {i18n.language === 'tr' ? 'Erkek' : 'Boy'}
                        </button>
                        <button
                          onClick={() => updateChild(child.id, 'gender', 'female')}
                          className={`p-3 rounded-lg transition-all ${
                            child.gender === 'female'
                              ? 'border-2 border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                              : 'text-gray-400 hover:text-gray-300'
                          }`}
                        >
                          {i18n.language === 'tr' ? 'Kız' : 'Girl'}
                        </button>
                      </div>
                    </div>

                    {/* Child Info */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
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
                        <label className="block text-gray-300 text-sm mb-2">
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
                              value={child.pajamaLength}
                              onChange={(e) => updateChild(child.id, 'pajamaLength', e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                              placeholder={i18n.language === 'tr' ? 'Pijama (cm)' : 'Pajama (cm)'}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {childCount === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">
                    {i18n.language === 'tr'
                      ? 'Çocuk eklenmedi. Yukarıdan çocuk sayısını seçebilirsiniz.'
                      : 'No children added. You can select the number of children above.'}
                  </div>
                )}
              </div>
            )}

            {/* Special Requests */}
            <div className="mt-8">
              <label className="block text-white font-semibold mb-3">
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

            {/* Size Chart Link */}
            <div className="mt-6 text-center">
              <Link href="/size-chart" className="text-mea-gold hover:text-yellow-500 transition-colors">
                {i18n.language === 'tr' ? 'Beden Tablosu' : 'Size Chart'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
