'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/lib/cart-context';
import { auth } from '@/lib/firebase';
import { getUserById, createOrder, getCouponByCode, useCoupon } from '@/lib/firebase-helpers';
import { Address, User, Coupon } from '@/types';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, CheckCircle, Tag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { cart, getCartTotal, clearCart } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | 'googlepay'>('card');
  const [loading, setLoading] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  // Guest/User Info
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Türkiye',
    phone: '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingAddress, setBillingAddress] = useState<Partial<Address>>({});

  // Card Info (for Stripe)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userData = await getUserById(authUser.uid);
        if (userData) {
          setUser(userData);
          setIsGuest(false);
          setEmail(userData.email);
          setPhone(userData.phone);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);

          // Pre-fill address if user has saved addresses
          if (userData.addresses && userData.addresses.length > 0) {
            const defaultAddress = userData.addresses.find(a => a.isDefault) || userData.addresses[0];
            setShippingAddress(defaultAddress);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [cart, router]);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;

  // Calculate discount
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === 'percentage') {
      const discount = (subtotal * appliedCoupon.value) / 100;
      return appliedCoupon.maxDiscount
        ? Math.min(discount, appliedCoupon.maxDiscount)
        : discount;
    } else {
      return appliedCoupon.value;
    }
  };

  const discount = calculateDiscount();
  const total = subtotal + shipping - discount;

  // Apply coupon function
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Lütfen bir kupon kodu girin');
      return;
    }

    setCheckingCoupon(true);
    setCouponError('');

    try {
      const coupon = await getCouponByCode(couponCode.trim().toUpperCase());

      if (!coupon) {
        setCouponError('Geçersiz kupon kodu');
        setCheckingCoupon(false);
        return;
      }

      // Check if coupon is expired
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        setCouponError('Bu kupon süresi dolmuş');
        setCheckingCoupon(false);
        return;
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        setCouponError('Bu kupon kullanım limitine ulaşmış');
        setCheckingCoupon(false);
        return;
      }

      // Check minimum purchase
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        setCouponError(`Bu kupon için minimum ${coupon.minPurchase}₺ alışveriş gerekli`);
        setCheckingCoupon(false);
        return;
      }

      // Check if user-specific
      if (coupon.userSpecific && user && coupon.userSpecific !== user.id) {
        setCouponError('Bu kupon sizin için geçerli değil');
        setCheckingCoupon(false);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError('');
      setCouponCode('');
    } catch (error) {
      console.error('Coupon error:', error);
      setCouponError('Kupon kontrolü sırasında hata oluştu');
    } finally {
      setCheckingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (isGuest && (!email || !phone || !firstName || !lastName)) {
        alert('Lütfen tüm zorunlu alanları doldurun');
        setLoading(false);
        return;
      }

      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
        alert('Lütfen teslimat adresini eksiksiz doldurun');
        setLoading(false);
        return;
      }

      // Generate order number
      const orderNumber = `MEA${Date.now()}`;

      // Create order
      const orderId = await createOrder({
        userId: user?.id,
        orderNumber,
        items: cart,
        subtotal,
        discount,
        shipping,
        total,
        status: 'pending',
        paymentMethod,
        paymentStatus: 'pending',
        shippingAddress: shippingAddress as Address,
        billingAddress: sameAsBilling ? (shippingAddress as Address) : (billingAddress as Address),
        guestEmail: isGuest ? email : undefined,
        guestPhone: isGuest ? phone : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // If coupon was used, increment usage count
      if (appliedCoupon) {
        await useCoupon(appliedCoupon.id);
      }

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push(`/order-success?orderNumber=${orderNumber}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Sipariş oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Ödeme</h1>
          <p className="text-gray-400">Siparişinizi tamamlayın</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest or Member */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4">Üye Bilgileri</h2>
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsGuest(true)}
                    className={`flex-1 py-3 rounded-lg font-medium ${
                      isGuest ? 'bg-mea-gold text-black' : 'glass text-white'
                    }`}
                  >
                    Misafir Alışveriş
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="flex-1 py-3 rounded-lg glass text-white font-medium"
                  >
                    Üye Girişi
                  </button>
                </div>

                {isGuest && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ad"
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Soyad"
                      className="input-field"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-posta"
                      className="input-field"
                      required
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Telefon"
                      className="input-field"
                      required
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Teslimat Adresi</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                    placeholder="Ad"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                    placeholder="Soyad"
                    className="input-field"
                    required
                  />
                </div>
                <textarea
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  placeholder="Adres"
                  className="input-field"
                  rows={3}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder="Şehir"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder="İlçe"
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    placeholder="Posta Kodu"
                    className="input-field"
                    required
                  />
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="Telefon"
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Ödeme Yöntemi</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    paymentMethod === 'card' ? 'bg-mea-gold text-black' : 'glass text-white'
                  }`}
                >
                  <CreditCard size={32} />
                  <span className="text-sm font-medium">Kredi Kartı</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    paymentMethod === 'crypto' ? 'bg-mea-gold text-black' : 'glass text-white'
                  }`}
                >
                  <Wallet size={32} />
                  <span className="text-sm font-medium">Kripto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    paymentMethod === 'googlepay' ? 'bg-mea-gold text-black' : 'glass text-white'
                  }`}
                >
                  <CheckCircle size={32} />
                  <span className="text-sm font-medium">Google Pay</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  {/* Payment Security Badge */}
                  <div className="flex items-center justify-between p-4 bg-white bg-opacity-5 rounded-xl mb-4">
                    <div className="flex items-center gap-3">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <p className="text-white text-sm font-medium">Güvenli Ödeme</p>
                        <p className="text-gray-400 text-xs">256-bit SSL Şifreleme</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Visa & Mastercard */}
                      <div className="bg-white px-2 py-1 rounded">
                        <svg className="h-4 w-auto" viewBox="0 0 48 16" fill="none">
                          <path d="M18.5 2.5L16 13.5h3l2.5-11h-3zm8.5 0l-4 11h3l.7-2h4l.3 2h3.5l-3-11h-4.5zm.5 3l1 5h-2.5l1.5-5zM11 2.5L7.5 10 7 7.5 6 3c-.2-.5-.5-.5-1-.5H0l.5.5c1 .2 2 .5 3 1l2.5 9.5h3L14 2.5h-3zm19 0c-.8 0-1.5.5-1.5 1.2 0 1.3 3 1.3 3 3.8 0 2.5-3.5 2.5-4.5 1.5l-.5 2c1 .5 2 .5 3 .5 2.5 0 4.5-1.2 4.5-3.5 0-1.5-3-1.5-3-3 0-1 2.5-1 3.5 0l.5-2c-1-.5-2-.5-3-.5z" fill="#1434CB"/>
                        </svg>
                      </div>
                      <div className="bg-white px-2 py-1 rounded">
                        <svg className="h-4 w-auto" viewBox="0 0 48 32" fill="none">
                          <circle cx="19" cy="16" r="11" fill="#EB001B"/>
                          <circle cx="29" cy="16" r="11" fill="#F79E1B"/>
                          <path d="M24 8a10.97 10.97 0 00-5 8 10.97 10.97 0 005 8 10.97 10.97 0 005-8 10.97 10.97 0 00-5-8z" fill="#FF5F00"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Kart Numarası"
                    className="input-field"
                    maxLength={19}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="AA/YY"
                      className="input-field"
                      maxLength={5}
                    />
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="CVV"
                      className="input-field"
                      maxLength={3}
                    />
                  </div>

                  {/* Powered by iyzico */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-white bg-opacity-5 rounded-lg">
                    <span className="text-gray-400 text-xs">Güvenli ödeme altyapısı:</span>
                    <div className="bg-white px-3 py-1.5 rounded">
                      <span className="text-[#1d3557] font-bold text-sm">iyzico</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="p-4 bg-mea-gold bg-opacity-20 rounded-lg">
                  <p className="text-mea-gold text-sm">
                    Kripto ödemesi için sonraki adımda cüzdan adresiniz gösterilecektir.
                  </p>
                </div>
              )}

              {paymentMethod === 'googlepay' && (
                <div className="p-4 bg-mea-gold bg-opacity-20 rounded-lg">
                  <p className="text-mea-gold text-sm">
                    Google Pay ile ödeme yapmak için sonraki adıma geçin.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Sipariş Özeti</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="text-white text-sm font-medium line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {item.size} × {item.quantity}
                      </p>
                      <p className="text-mea-gold text-sm font-medium">
                        ₺{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6 pb-4 border-b border-white border-opacity-10">
                <label className="block text-white font-medium mb-2">İndirim Kodu</label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="KUPON KODU"
                      className="input-field flex-grow"
                      disabled={checkingCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={checkingCoupon || !couponCode.trim()}
                      className="btn-secondary px-6 whitespace-nowrap"
                    >
                      {checkingCoupon ? 'Kontrol ediliyor...' : 'Uygula'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="text-green-500" size={16} />
                      <div>
                        <p className="text-green-500 font-medium text-sm">{appliedCoupon.code}</p>
                        <p className="text-green-400 text-xs">
                          {appliedCoupon.type === 'percentage'
                            ? `%${appliedCoupon.value} İndirim`
                            : `₺${appliedCoupon.value} İndirim`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-400 hover:text-green-300 text-sm underline"
                    >
                      Kaldır
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pt-4 border-t border-white border-opacity-10">
                <div className="flex justify-between text-gray-400">
                  <span>Ara Toplam</span>
                  <span>₺{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>İndirim</span>
                    <span>-₺{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Kargo</span>
                  <span>{shipping === 0 ? 'Ücretsiz' : `₺${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white border-opacity-10">
                  <span>Toplam</span>
                  <span className="text-mea-gold">₺{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
              >
                {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
              </button>

              <p className="text-gray-400 text-xs text-center mt-4">
                Siparişinizi tamamlayarak{' '}
                <a href="/privacy" className="text-mea-gold hover:underline">
                  Gizlilik Politikası
                </a>
                &apos;nı kabul etmiş olursunuz.
              </p>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
