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
type Gender = 'male' | 'female' | 'child';

interface FamilyMember {
  id: string;
  gender: Gender;
  size: string;
  shirtLength: string;
  sleeveLength: string;
  pajamaLength: string;
  childAge?: string;
  childHeight?: string;
  childWeight?: string;
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
  const [childAge, setChildAge] = useState('');
  const [childHeight, setChildHeight] = useState('');
  const [childWeight, setChildWeight] = useState('');

  // Family order state
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{
    id: '1',
    gender: 'male',
    size: '',
    shirtLength: '',
    sleeveLength: '',
    pajamaLength: '',
  }]);

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

  // Auto-calculate measurements for children
  useEffect(() => {
    if (gender === 'child' && childAge && childHeight && childWeight) {
      const age = parseInt(childAge);
      const height = parseInt(childHeight);

      // Simple estimation formulas (can be refined)
      if (age >= 2 && age <= 14) {
        setShirtLength(String(Math.round(height * 0.4)));
        setSleeveLength(String(Math.round(height * 0.3)));
        setPajamaLength(String(Math.round(height * 0.55)));
      }
    }
  }, [childAge, childHeight, childWeight, gender]);

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, {
      id: Date.now().toString(),
      gender: 'male',
      size: '',
      shirtLength: '',
      sleeveLength: '',
      pajamaLength: '',
    }]);
  };

  const removeFamilyMember = (id: string) => {
    if (familyMembers.length > 1) {
      setFamilyMembers(familyMembers.filter(m => m.id !== id));
    }
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(familyMembers.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
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
        undefined, // specialRequests
        false, // giftWrapping
        undefined, // giftMessage
        {
          shirtLength: shirtLength || undefined,
          sleeveLength: sleeveLength || undefined,
          pajamaLength: pajamaLength || undefined,
        }
      );

      router.push('/cart');
    } else {
      // Family order - add each member separately
      const invalidMember = familyMembers.find(m => !m.size);
      if (invalidMember) {
        alert(i18n.language === 'tr' ? 'Lütfen tüm aile üyeleri için beden seçin' : 'Please select size for all family members');
        return;
      }

      familyMembers.forEach(member => {
        addToCart(
          product,
          member.size,
          1, // quantity
          undefined, // specialRequests
          false, // giftWrapping
          undefined, // giftMessage
          {
            shirtLength: member.shirtLength || undefined,
            sleeveLength: member.sleeveLength || undefined,
            pajamaLength: member.pajamaLength || undefined,
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
                  <div className="grid grid-cols-3 gap-3">
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
                    <button
                      onClick={() => setGender('child')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        gender === 'child'
                          ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {i18n.language === 'tr' ? 'Çocuk (≤14)' : 'Child (≤14)'}
                    </button>
                  </div>
                </div>

                {/* Child Info (if child selected) */}
                {gender === 'child' && (
                  <div className="glass rounded-lg p-4 space-y-4">
                    <h4 className="text-white font-semibold">
                      {i18n.language === 'tr' ? 'Çocuk Bilgileri' : 'Child Information'}
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          {i18n.language === 'tr' ? 'Yaş' : 'Age'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="14"
                          value={childAge}
                          onChange={(e) => setChildAge(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="0-14"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          {i18n.language === 'tr' ? 'Boy (cm)' : 'Height (cm)'}
                        </label>
                        <input
                          type="number"
                          value={childHeight}
                          onChange={(e) => setChildHeight(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="cm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          {i18n.language === 'tr' ? 'Kilo (kg)' : 'Weight (kg)'}
                        </label>
                        <input
                          type="number"
                          value={childWeight}
                          onChange={(e) => setChildWeight(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="kg"
                        />
                      </div>
                    </div>
                    {childAge && childHeight && childWeight && (
                      <p className="text-green-400 text-sm">
                        {i18n.language === 'tr' ? '✓ Ölçüler otomatik hesaplandı' : '✓ Measurements auto-calculated'}
                      </p>
                    )}
                  </div>
                )}

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
                        disabled={gender === 'child' && !!childAge && !!childHeight && !!childWeight}
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
                        disabled={gender === 'child' && !!childAge && !!childHeight && !!childWeight}
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
                        disabled={gender === 'child' && !!childAge && !!childHeight && !!childWeight}
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
              <div className="space-y-6">
                <p className="text-gray-300">
                  {i18n.language === 'tr'
                    ? 'Aile üyeleriniz için ayrı ayrı ölçü ve beden bilgilerini girin.'
                    : 'Enter size and measurement information for each family member.'}
                </p>

                {familyMembers.map((member, index) => (
                  <div key={member.id} className="glass rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">
                        {i18n.language === 'tr' ? `Aile Üyesi ${index + 1}` : `Family Member ${index + 1}`}
                      </h4>
                      {familyMembers.length > 1 && (
                        <button
                          onClick={() => removeFamilyMember(member.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          {i18n.language === 'tr' ? 'Kaldır' : 'Remove'}
                        </button>
                      )}
                    </div>

                    {/* Gender for each member */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {i18n.language === 'tr' ? 'Cinsiyet' : 'Gender'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => updateFamilyMember(member.id, 'gender', 'male')}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            member.gender === 'male'
                              ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                              : 'border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {i18n.language === 'tr' ? 'Erkek' : 'Male'}
                        </button>
                        <button
                          onClick={() => updateFamilyMember(member.id, 'gender', 'female')}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            member.gender === 'female'
                              ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                              : 'border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {i18n.language === 'tr' ? 'Kadın' : 'Female'}
                        </button>
                        <button
                          onClick={() => updateFamilyMember(member.id, 'gender', 'child')}
                          className={`p-2 rounded-lg border-2 transition-all text-sm ${
                            member.gender === 'child'
                              ? 'border-mea-gold bg-mea-gold bg-opacity-10 text-white'
                              : 'border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {i18n.language === 'tr' ? 'Çocuk' : 'Child'}
                        </button>
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-gray-300 text-sm mb-2">
                        {i18n.language === 'tr' ? 'Beden' : 'Size'}
                      </label>
                      <select
                        value={member.size}
                        onChange={(e) => updateFamilyMember(member.id, 'size', e.target.value)}
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

                    {/* Measurements */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          {i18n.language === 'tr' ? 'Gömlek (cm)' : 'Shirt (cm)'}
                        </label>
                        <input
                          type="number"
                          value={member.shirtLength}
                          onChange={(e) => updateFamilyMember(member.id, 'shirtLength', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="cm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          {i18n.language === 'tr' ? 'Kol (cm)' : 'Sleeve (cm)'}
                        </label>
                        <input
                          type="number"
                          value={member.sleeveLength}
                          onChange={(e) => updateFamilyMember(member.id, 'sleeveLength', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="cm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">
                          {i18n.language === 'tr' ? 'Pijama (cm)' : 'Pajama (cm)'}
                        </label>
                        <input
                          type="number"
                          value={member.pajamaLength}
                          onChange={(e) => updateFamilyMember(member.id, 'pajamaLength', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-gray-600 rounded-lg text-white focus:border-mea-gold focus:outline-none"
                          placeholder="cm"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addFamilyMember}
                  className="w-full p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-mea-gold hover:text-mea-gold transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  {i18n.language === 'tr' ? 'Aile Üyesi Ekle' : 'Add Family Member'}
                </button>
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
