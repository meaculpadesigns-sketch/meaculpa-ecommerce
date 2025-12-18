'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/lib/cart-context';
import { auth } from '@/lib/firebase';
import { getUserById, createOrder, getCouponByCode, useCoupon, getShippingSettings } from '@/lib/firebase-helpers';
import { Address, User, Coupon, ShippingSettings } from '@/types';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, CheckCircle, Tag } from 'lucide-react';
import { formatPrice, calculateShippingCost } from '@/lib/currency';

export default function CheckoutPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
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

  // Set background gradient
  useEffect(() => {
    document.body.className = 'bg-home text-dark-page';
    return () => {
      document.body.className = '';
    };
  }, []);

  // Card Info (for iyzico)
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
      return;
    }

    // Load shipping settings
    const loadSettings = async () => {
      const settings = await getShippingSettings();
      setShippingSettings(settings);
    };
    loadSettings();

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

  // Calculate shipping based on country
  const calculateShipping = () => {
    if (!shippingSettings) {
      // Fallback to hardcoded values if settings not loaded
      const isTurkey = shippingAddress.country === 'Türkiye' || shippingAddress.country === 'Turkey';
      if (isTurkey) {
        return subtotal >= 4500 ? 0 : 175;
      } else {
        return subtotal >= 7000 ? 0 : 1225;
      }
    }

    const isTurkey = shippingAddress.country === 'Türkiye' || shippingAddress.country === 'Turkey';

    return calculateShippingCost({
      subtotal,
      isDomestic: isTurkey,
      language: i18n.language,
      settings: {
        domestic: shippingSettings.domestic,
        international: shippingSettings.international,
      },
      freeShippingOverride: appliedCoupon?.freeShipping || false,
    });
  };

  const shipping = calculateShipping();

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
      setCouponError(t('checkout.enterCoupon'));
      return;
    }

    setCheckingCoupon(true);
    setCouponError('');

    try {
      const coupon = await getCouponByCode(couponCode.trim().toUpperCase());

      if (!coupon) {
        setCouponError(t('checkout.invalidCoupon'));
        setCheckingCoupon(false);
        return;
      }

      // Check if coupon is expired
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        setCouponError(t('checkout.expiredCoupon'));
        setCheckingCoupon(false);
        return;
      }

      // Check usage limit
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        setCouponError(t('checkout.usageLimitReached'));
        setCheckingCoupon(false);
        return;
      }

      // Check minimum purchase
      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        setCouponError(`${t('checkout.minPurchaseRequired')} ${formatPrice(coupon.minPurchase, i18n.language)} ${t('checkout.minPurchaseRequired2')}`);
        setCheckingCoupon(false);
        return;
      }

      // Check if user-specific
      if (coupon.userSpecific && user && coupon.userSpecific !== user.id) {
        setCouponError(t('checkout.couponNotValid'));
        setCheckingCoupon(false);
        return;
      }

      setAppliedCoupon(coupon);
      setCouponError('');
      setCouponCode('');
    } catch (error) {
      console.error('Coupon error:', error);
      setCouponError(t('checkout.couponError'));
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
        alert(t('checkout.fillRequired'));
        setLoading(false);
        return;
      }

      if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.zipCode) {
        alert(t('checkout.fillAddress'));
        setLoading(false);
        return;
      }

      // Validate card info for card payments
      if (paymentMethod === 'card') {
        if (!cardHolderName || !cardNumber || !cardExpiry || !cardCvv) {
          alert('Lütfen kart bilgilerini eksiksiz doldurun');
          setLoading(false);
          return;
        }

        // Parse expiry date (MM/YY format)
        const [expireMonth, expireYear] = cardExpiry.split('/').map(s => s.trim());
        if (!expireMonth || !expireYear || expireMonth.length !== 2 || expireYear.length !== 2) {
          alert('Geçerli bir son kullanma tarihi girin (AA/YY)');
          setLoading(false);
          return;
        }

        // Call iyzico payment API
        try {
          const buyerData = {
            id: user?.id || `guest_${Date.now()}`,
            name: firstName || shippingAddress.firstName,
            surname: lastName || shippingAddress.lastName,
            email: email || user?.email,
            phone: phone || shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            zipCode: shippingAddress.zipCode,
          };

          console.log('Buyer data being sent:', buyerData);

          const paymentResponse = await fetch('/api/iyzico/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cardHolderName,
              cardNumber,
              expireMonth,
              expireYear: `20${expireYear}`, // YY -> YYYY
              cvc: cardCvv,
              total,
              buyer: buyerData,
              shippingAddress,
              billingAddress: sameAsBilling ? shippingAddress : billingAddress,
              basketItems: [
                ...cart.map(item => ({
                  id: item.productId,
                  name: item.product.name,
                  category1: item.product.category,
                  category2: item.product.subcategory || '',
                  price: item.product.price * item.quantity,
                })),
                // Add shipping as separate line item
                ...(shipping > 0 ? [{
                  id: 'SHIPPING',
                  name: 'Kargo Ücreti',
                  category1: 'Shipping',
                  category2: 'Delivery',
                  price: shipping,
                }] : []),
              ],
              discount, // Send discount separately for paidPrice calculation
            }),
          });

          const paymentResult = await paymentResponse.json();

          if (paymentResult.status !== 'success') {
            // Payment failed
            alert(paymentResult.errorMessage || 'Ödeme işlemi başarısız oldu');
            setLoading(false);
            return;
          }

          // Payment successful - create order
          const orderNumber = `MEA${Date.now()}`;
          const orderId = await createOrder({
            userId: user?.id,
            orderNumber,
            items: cart,
            subtotal,
            discount,
            shipping,
            total,
            status: 'processing', // Payment confirmed
            paymentMethod,
            paymentStatus: 'paid', // Payment successful
            shippingAddress: shippingAddress as Address,
            billingAddress: sameAsBilling ? (shippingAddress as Address) : (billingAddress as Address),
            guestEmail: isGuest ? email : undefined,
            guestPhone: isGuest ? phone : undefined,
            iyzicoPaymentId: paymentResult.paymentId,
            iyzicoConversationId: paymentResult.conversationId,
            iyzicoPaymentStatus: paymentResult.paymentStatus,
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
        } catch (paymentError: any) {
          console.error('Payment error:', paymentError);
          alert('Ödeme işlemi sırasında bir hata oluştu');
          setLoading(false);
          return;
        }
      } else {
        // For crypto/googlepay - create order without payment (will be processed later)
        const orderNumber = `MEA${Date.now()}`;
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
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(t('common.error'));
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
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{t('checkout.title')}</h1>
          <p className="text-gray-700 dark:text-gray-400">{t('checkout.subtitle')}</p>
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
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('checkout.memberInfo')}</h2>
                <div className="flex gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsGuest(true)}
                    className={`flex-1 py-3 rounded-lg font-medium ${
                      isGuest ? 'bg-mea-gold text-black' : 'glass text-black dark:text-white'
                    }`}
                  >
                    {t('checkout.guestCheckout')}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="flex-1 py-3 rounded-lg glass text-black dark:text-white font-medium"
                  >
                    {t('checkout.memberLogin')}
                  </button>
                </div>

                {isGuest && (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t('checkout.firstName')}
                      className="input-field"
                      required
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t('checkout.lastName')}
                      className="input-field"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('checkout.email')}
                      className="input-field"
                      required
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('checkout.phone')}
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
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('checkout.shippingAddress')}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={shippingAddress.firstName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                    placeholder={t('checkout.firstName')}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    value={shippingAddress.lastName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                    placeholder={t('checkout.lastName')}
                    className="input-field"
                    required
                  />
                </div>
                <textarea
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                  placeholder={t('checkout.address')}
                  className="input-field"
                  rows={3}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    placeholder={t('checkout.city')}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    placeholder={t('checkout.district')}
                    className="input-field"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    placeholder={t('checkout.zipCode')}
                    className="input-field"
                    required
                  />
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="Türkiye">{i18n.language === 'tr' ? 'Türkiye' : 'Turkey'}</option>
                    <option value="United States">{i18n.language === 'tr' ? 'Amerika Birleşik Devletleri' : 'United States'}</option>
                    <option value="United Kingdom">{i18n.language === 'tr' ? 'İngiltere' : 'United Kingdom'}</option>
                    <option value="Germany">{i18n.language === 'tr' ? 'Almanya' : 'Germany'}</option>
                    <option value="France">{i18n.language === 'tr' ? 'Fransa' : 'France'}</option>
                    <option value="Italy">{i18n.language === 'tr' ? 'İtalya' : 'Italy'}</option>
                    <option value="Spain">{i18n.language === 'tr' ? 'İspanya' : 'Spain'}</option>
                    <option value="Netherlands">{i18n.language === 'tr' ? 'Hollanda' : 'Netherlands'}</option>
                    <option value="Belgium">{i18n.language === 'tr' ? 'Belçika' : 'Belgium'}</option>
                    <option value="Austria">{i18n.language === 'tr' ? 'Avusturya' : 'Austria'}</option>
                    <option value="Switzerland">{i18n.language === 'tr' ? 'İsviçre' : 'Switzerland'}</option>
                    <option value="Canada">{i18n.language === 'tr' ? 'Kanada' : 'Canada'}</option>
                    <option value="Australia">{i18n.language === 'tr' ? 'Avustralya' : 'Australia'}</option>
                    <option value="Other">{i18n.language === 'tr' ? 'Diğer' : 'Other'}</option>
                  </select>
                </div>
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                  placeholder={t('checkout.phone')}
                  className="input-field"
                  required
                />
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('checkout.paymentMethod')}</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    paymentMethod === 'card' ? 'bg-mea-gold text-black' : 'glass text-black dark:text-white'
                  }`}
                >
                  <CreditCard size={32} />
                  <span className="text-sm font-medium">{t('checkout.creditCard')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('crypto')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    paymentMethod === 'crypto' ? 'bg-mea-gold text-black' : 'glass text-black dark:text-white'
                  }`}
                >
                  <Wallet size={32} />
                  <span className="text-sm font-medium">{t('checkout.crypto')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    paymentMethod === 'googlepay' ? 'bg-mea-gold text-black' : 'glass text-black dark:text-white'
                  }`}
                >
                  <CheckCircle size={32} />
                  <span className="text-sm font-medium">{t('checkout.googlePay')}</span>
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
                        <p className="text-black dark:text-white text-sm font-medium">{t('checkout.securePayment')}</p>
                        <p className="text-gray-700 dark:text-gray-400 text-xs">{t('checkout.sslEncryption')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Visa & Mastercard */}
                      <div className="bg-white px-3 py-1.5 rounded flex items-center">
                        <span className="font-bold text-blue-800 text-sm tracking-wide">VISA</span>
                      </div>
                      <div className="bg-white px-2 py-1 rounded">
                        <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none">
                          <circle cx="19" cy="16" r="11" fill="#EB001B"/>
                          <circle cx="29" cy="16" r="11" fill="#F79E1B"/>
                          <path d="M24 8a10.97 10.97 0 00-5 8 10.97 10.97 0 005 8 10.97 10.97 0 005-8 10.97 10.97 0 00-5-8z" fill="#FF5F00"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    placeholder="Kart Üzerindeki İsim"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder={t('checkout.cardNumber')}
                    className="input-field"
                    maxLength={19}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder={t('checkout.expiry')}
                      className="input-field"
                      maxLength={5}
                    />
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder={t('checkout.cvv')}
                      className="input-field"
                      maxLength={3}
                    />
                  </div>

                  {/* Powered by iyzico */}
                  <div className="flex items-center justify-center gap-2 p-3 bg-white bg-opacity-5 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-400 text-xs">{t('checkout.poweredBy')}</span>
                    <div className="bg-white px-3 py-1.5 rounded">
                      <span className="text-[#1d3557] font-bold text-sm">iyzico</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'crypto' && (
                <div className="p-4 bg-mea-gold bg-opacity-20 rounded-lg">
                  <p className="text-mea-gold text-sm">
                    {t('checkout.cryptoNote')}
                  </p>
                </div>
              )}

              {paymentMethod === 'googlepay' && (
                <div className="p-4 bg-mea-gold bg-opacity-20 rounded-lg">
                  <p className="text-mea-gold text-sm">
                    {t('checkout.googlePayNote')}
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
              <h2 className="text-2xl font-bold text-black dark:text-white mb-6">{t('checkout.orderSummary')}</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item) => {
                  const itemName = i18n.language === 'tr' ? item.product.name : item.product.nameEn;
                  return (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="text-black dark:text-white text-sm font-medium line-clamp-1">
                          {itemName}
                        </p>
                        <p className="text-gray-700 dark:text-gray-400 text-xs">
                          {item.size} × {item.quantity}
                        </p>
                        <p className="text-mea-gold text-sm font-medium">
                          {formatPrice(item.product.price * item.quantity, i18n.language)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code */}
              <div className="mb-6 pb-4 border-b border-white border-opacity-10">
                <label className="block text-black dark:text-white font-medium mb-2">{t('checkout.couponCode')}</label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={t('checkout.couponPlaceholder')}
                      className="input-field flex-grow"
                      disabled={checkingCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={checkingCoupon || !couponCode.trim()}
                      className="btn-secondary px-6 whitespace-nowrap"
                    >
                      {checkingCoupon ? t('checkout.checkingCoupon') : t('checkout.applyCoupon')}
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
                            ? `%${appliedCoupon.value} ${t('checkout.discount')}`
                            : `${formatPrice(appliedCoupon.value, i18n.language)} ${t('checkout.discount')}`}
                        </p>
                        {appliedCoupon.freeShipping && (
                          <p className="text-green-400 text-xs mt-1">
                            + {i18n.language === 'tr' ? 'Ücretsiz Kargo' : 'Free Shipping'}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-green-400 hover:text-green-300 text-sm underline"
                    >
                      {t('checkout.removeCoupon')}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pt-4 border-t border-white border-opacity-10">
                <div className="flex justify-between text-gray-700 dark:text-gray-400">
                  <span>{t('checkout.subtotal')}</span>
                  <span>{formatPrice(subtotal, i18n.language)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>{t('checkout.discount')}</span>
                    <span>-{formatPrice(discount, i18n.language)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700 dark:text-gray-400">
                  <span>{t('cart.shipping')}</span>
                  <span>{shipping === 0 ? t('checkout.shippingFree') : formatPrice(shipping, i18n.language)}</span>
                </div>

                {/* Free Shipping Info */}
                {(() => {
                  const isTurkey = shippingAddress.country === 'Türkiye' || shippingAddress.country === 'Turkey';

                  // Show coupon free shipping message
                  if (appliedCoupon?.freeShipping) {
                    return (
                      <div className="p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                        <p className="text-green-500 text-sm">
                          {i18n.language === 'tr'
                            ? '✓ Kupon ile ücretsiz kargo!'
                            : '✓ Free shipping with coupon!'}
                        </p>
                      </div>
                    );
                  }

                  if (!shippingSettings) return null;

                  const config = isTurkey ? shippingSettings.domestic : shippingSettings.international;
                  const threshold = config.thresholdTRY;
                  const remainingForFreeShipping = threshold - subtotal;

                  if (shipping === 0) {
                    return (
                      <div className="p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg">
                        <p className="text-green-500 text-sm">
                          {i18n.language === 'tr' ? '✓ Ücretsiz kargo kazandınız!' : '✓ You earned free shipping!'}
                        </p>
                      </div>
                    );
                  } else if (remainingForFreeShipping > 0) {
                    return (
                      <div className="p-3 bg-mea-gold bg-opacity-20 border border-mea-gold rounded-lg">
                        <p className="text-black dark:text-white text-sm">
                          {i18n.language === 'tr'
                            ? `${formatPrice(remainingForFreeShipping, i18n.language)} daha alışveriş yapın, kargo ücretsiz olsun!`
                            : `Add ${formatPrice(remainingForFreeShipping, i18n.language)} more for free shipping!`}
                        </p>
                        {!isTurkey && (
                          <p className="text-gray-700 dark:text-gray-400 text-xs mt-1">
                            {i18n.language === 'tr'
                              ? `(${config.thresholdEUR} Euro üzeri yurt dışı kargolar ücretsizdir)`
                              : `(International orders over ${config.thresholdEUR} Euro get free shipping)`}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="flex justify-between text-black dark:text-white font-bold text-lg pt-3 border-t border-white border-opacity-10">
                  <span>{t('cart.total')}</span>
                  <span className="text-mea-gold">{formatPrice(total, i18n.language)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
              >
                {loading ? t('checkout.processing') : t('checkout.completeOrder')}
              </button>

              <p className="text-gray-700 dark:text-gray-400 text-xs text-center mt-4">
                {t('checkout.privacyAgreement')}{' '}
                <a href="/privacy" className="text-mea-gold hover:underline">
                  {t('checkout.privacyPolicy')}
                </a>
                {t('checkout.privacyAccept')}
              </p>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
