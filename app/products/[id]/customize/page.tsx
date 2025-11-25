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
type ParentType = 'father' | 'mother';

interface ParentInfo {
  type: ParentType;
  size: string;
  shirtLength: string;
  sleeveLength: string;
  pajamaLength: string;
}

interface ChildInfo {
  id: string;
  age: string;
  height: string;
  weight: string;
  size: string;
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

  // Individual order state
  const [gender, setGender] = useState<Gender>('male');
  const [size, setSize] = useState('');
  const [shirtLength, setShirtLength] = useState('');
  const [sleeveLength, setSleeveLength] = useState('');
  const [pajamaLength, setPajamaLength] = useState('');

  // Family order state
  const [childCount, setChildCount] = useState(0);
  const [father, setFather] = useState<ParentInfo>({
    type: 'father',
    size: '',
    shirtLength: '',
    sleeveLength: '',
    pajamaLength: '',
  });
  const [mother, setMother] = useState<ParentInfo>({
    type: 'mother',
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
          age: '',
          height: '',
          weight: '',
          size: '',
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
        undefined,
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
      if (!father.size) {
        alert(i18n.language === 'tr' ? 'Lütfen baba için beden seçin' : 'Please select size for father');
        return;
      }
      if (!mother.size) {
        alert(i18n.language === 'tr' ? 'Lütfen anne için beden seçin' : 'Please select size for mother');
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
        if (!child.size) {
          alert(
            i18n.language === 'tr'
              ? `Lütfen ${i + 1}. çocuk için beden seçin`
              : `Please select size for child ${i + 1}`
          );
          return;
        }
      }

      // Add father to cart
      addToCart(
        product,
        father.size,
        1,
        i18n.language === 'tr' ? 'Baba' : 'Father',
        false,
        undefined,
        {
          shirtLength: father.shirtLength || undefined,
          sleeveLength: father.sleeveLength || undefined,
          pajamaLength: father.pajamaLength || undefined,
        }
      );

      // Add mother to cart
      addToCart(
        product,
        mother.size,
        1,
        i18n.language === 'tr' ? 'Anne' : 'Mother',
        false,
        undefined,
        {
          shirtLength: mother.shirtLength || undefined,
          sleeveLength: mother.sleeveLength || undefined,
          pajamaLength: mother.pajamaLength || undefined,
        }
      );

      // Add each child to cart
      children.forEach((child, index) => {
        addToCart(
          product,
          child.size,
          1,
          i18n.language === 'tr'
            ? `Çocuk ${index + 1} (${child.age} yaş)`
            : `Child ${index + 1} (${child.age} years old)`,
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
                <button
                  onClick={() => setOrderType('individual')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    orderType === 'individual'
                      ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {i18n.language === 'tr' ? 'Bireysel' : 'Individual'}
                </button>
                <button
                  onClick={() => setOrderType('family')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    orderType === 'family'
                      ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                      : 'border-gray-600 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {i18n.language === 'tr' ? 'Aile' : 'Family'}
                </button>
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
                      className={`p-3 rounded-lg border-2 transition-all ${
                        gender === 'male'
                          ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                    </button>
                    <button
                      onClick={() => setGender('female')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        gender === 'female'
                          ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
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
                  <div className="grid grid-cols-4 gap-3">
                    {product.sizes.filter(s => s.inStock).map((sizeOption) => (
                      <button
                        key={sizeOption.size}
                        onClick={() => setSize(sizeOption.size)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          size === sizeOption.size
                            ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {sizeOption.size}
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
                        className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
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
                        className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
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
                        className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
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
                    ? 'Aile siparişi otomatik olarak 2 ebeveyn içerir. İstediğiniz sayıda çocuk ekleyebilirsiniz. (14 yaş ve altı çocuk sayılır)'
                    : 'Family order automatically includes 2 parents. You can add any number of children. (14 years old and under counts as child)'}
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

                {/* Father Section */}
                <div className="glass rounded-lg p-6 space-y-4 border-2 border-blue-500 border-opacity-30">
                  <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    {i18n.language === 'tr' ? '👨 Baba' : '👨 Father'}
                  </h4>

                  {/* Father Size */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Beden' : 'Size'}
                    </label>
                    <select
                      value={father.size}
                      onChange={(e) => setFather({ ...father, size: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                    >
                      <option value="">{i18n.language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                      {product.sizes.filter(s => s.inStock).map((sizeOption) => (
                        <option key={sizeOption.size} value={sizeOption.size}>
                          {sizeOption.size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Father Measurements */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Özel Ölçüler (Opsiyonel)' : 'Custom Measurements (Optional)'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          value={father.shirtLength}
                          onChange={(e) => setFather({ ...father, shirtLength: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Gömlek (cm)' : 'Shirt (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={father.sleeveLength}
                          onChange={(e) => setFather({ ...father, sleeveLength: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Kol (cm)' : 'Sleeve (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={father.pajamaLength}
                          onChange={(e) => setFather({ ...father, pajamaLength: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Pijama (cm)' : 'Pajama (cm)'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mother Section */}
                <div className="glass rounded-lg p-6 space-y-4 border-2 border-pink-500 border-opacity-30">
                  <h4 className="text-white font-bold text-lg flex items-center gap-2">
                    {i18n.language === 'tr' ? '👩 Anne' : '👩 Mother'}
                  </h4>

                  {/* Mother Size */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Beden' : 'Size'}
                    </label>
                    <select
                      value={mother.size}
                      onChange={(e) => setMother({ ...mother, size: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                    >
                      <option value="">{i18n.language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                      {product.sizes.filter(s => s.inStock).map((sizeOption) => (
                        <option key={sizeOption.size} value={sizeOption.size}>
                          {sizeOption.size}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mother Measurements */}
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      {i18n.language === 'tr' ? 'Özel Ölçüler (Opsiyonel)' : 'Custom Measurements (Optional)'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <input
                          type="number"
                          value={mother.shirtLength}
                          onChange={(e) => setMother({ ...mother, shirtLength: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Gömlek (cm)' : 'Shirt (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={mother.sleeveLength}
                          onChange={(e) => setMother({ ...mother, sleeveLength: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
                          placeholder={i18n.language === 'tr' ? 'Kol (cm)' : 'Sleeve (cm)'}
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={mother.pajamaLength}
                          onChange={(e) => setMother({ ...mother, pajamaLength: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none text-sm"
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
                      {i18n.language === 'tr' ? `👶 Çocuk ${index + 1}` : `👶 Child ${index + 1}`}
                      <span className="text-xs text-gray-400 font-normal ml-2">
                        {i18n.language === 'tr' ? '(14 yaş ve altı)' : '(14 years old and under)'}
                      </span>
                    </h4>

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
                            className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                            placeholder={i18n.language === 'tr' ? 'Yaş (0-14)' : 'Age (0-14)'}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={child.height}
                            onChange={(e) => updateChild(child.id, 'height', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                            placeholder={i18n.language === 'tr' ? 'Boy (cm)' : 'Height (cm)'}
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={child.weight}
                            onChange={(e) => updateChild(child.id, 'weight', e.target.value)}
                            className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
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

                    {/* Child Size */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {i18n.language === 'tr' ? 'Beden' : 'Size'}
                      </label>
                      <select
                        value={child.size}
                        onChange={(e) => updateChild(child.id, 'size', e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                      >
                        <option value="">{i18n.language === 'tr' ? 'Seçiniz' : 'Select'}</option>
                        {product.sizes.filter(s => s.inStock).map((sizeOption) => (
                          <option key={sizeOption.size} value={sizeOption.size}>
                            {sizeOption.size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Child Measurements (Auto-calculated, read-only display) */}
                    {child.shirtLength && (
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          {i18n.language === 'tr' ? 'Hesaplanan Ölçüler' : 'Calculated Measurements'}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="px-3 py-2 bg-zinc-900 border border-gray-700 rounded-lg text-gray-300 text-sm">
                            {i18n.language === 'tr' ? 'Gömlek:' : 'Shirt:'} {child.shirtLength} cm
                          </div>
                          <div className="px-3 py-2 bg-zinc-900 border border-gray-700 rounded-lg text-gray-300 text-sm">
                            {i18n.language === 'tr' ? 'Kol:' : 'Sleeve:'} {child.sleeveLength} cm
                          </div>
                          <div className="px-3 py-2 bg-zinc-900 border border-gray-700 rounded-lg text-gray-300 text-sm">
                            {i18n.language === 'tr' ? 'Pijama:' : 'Pajama:'} {child.pajamaLength} cm
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
