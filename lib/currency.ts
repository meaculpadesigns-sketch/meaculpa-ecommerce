// Currency conversion rates (USD and EUR to TRY)
// Bu kurlar günlük otomatik güncellenir
let EXCHANGE_RATES = {
  USD: 42.35, // 1 USD = 42.35 TRY
  EUR: 44.20, // 1 EUR = 44.20 TRY
  lastUpdated: new Date().toDateString(),
};

// Kuru otomatik güncelleyen fonksiyon
async function updateExchangeRates() {
  try {
    // exchangerate-api.com ücretsiz API kullanıyoruz
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/TRY');
    const data = await response.json();

    if (data.rates) {
      EXCHANGE_RATES = {
        USD: 1 / data.rates.USD, // TRY to USD
        EUR: 1 / data.rates.EUR, // TRY to EUR
        lastUpdated: new Date().toDateString(),
      };
    }
  } catch (error) {
    console.warn('Kur güncellenemedi, varsayılan kurlar kullanılıyor:', error);
  }
}

// Her sayfa yüklendiğinde kurları güncelle
if (typeof window !== 'undefined') {
  const today = new Date().toDateString();
  if (EXCHANGE_RATES.lastUpdated !== today) {
    updateExchangeRates();
  }
}

export function formatPrice(priceInTRY: number, language: string = 'tr'): string {
  if (language === 'en') {
    // Show in USD for English with comma separator
    const priceInUSD = priceInTRY / EXCHANGE_RATES.USD;
    return `$${priceInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  // Default to TRY for Turkish with dot separator (21.000,00 format)
  return `₺${priceInTRY.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getCurrencySymbol(language: string = 'tr'): string {
  return language === 'en' ? '$' : '₺';
}

// Get current exchange rates
export function getExchangeRates() {
  return EXCHANGE_RATES;
}

// Convert TRY to other currencies
export function convertCurrency(priceInTRY: number, toCurrency: 'USD' | 'EUR'): number {
  return priceInTRY / EXCHANGE_RATES[toCurrency];
}

// Shipping calculation utility
export interface ShippingCalculationParams {
  subtotal: number; // Always in TRY
  isDomestic: boolean; // Turkey = true, International = false
  language: string; // 'tr' or 'en'
  settings: {
    domestic: {
      thresholdTRY: number;
      thresholdEUR: number;
      feeTRY: number;
      feeEUR: number;
    };
    international: {
      thresholdTRY: number;
      thresholdEUR: number;
      feeTRY: number;
      feeEUR: number;
    };
  };
  freeShippingOverride?: boolean; // Coupon free shipping
}

export function calculateShippingCost(params: ShippingCalculationParams): number {
  const { subtotal, isDomestic, settings, freeShippingOverride } = params;

  // If coupon provides free shipping, return 0
  if (freeShippingOverride) {
    return 0;
  }

  const config = isDomestic ? settings.domestic : settings.international;

  // Check threshold (always compare in TRY)
  if (subtotal >= config.thresholdTRY) {
    return 0; // Free shipping threshold reached
  }

  // Return shipping fee in TRY
  return config.feeTRY;
}

// Get shipping threshold info for display
export function getShippingThresholdInfo(params: ShippingCalculationParams): {
  remaining: number; // Amount remaining to get free shipping (in TRY)
  threshold: number; // Free shipping threshold (in TRY)
  fee: number; // Shipping fee (in TRY)
} {
  const { subtotal, isDomestic, settings } = params;
  const config = isDomestic ? settings.domestic : settings.international;

  return {
    remaining: Math.max(0, config.thresholdTRY - subtotal),
    threshold: config.thresholdTRY,
    fee: config.feeTRY,
  };
}
