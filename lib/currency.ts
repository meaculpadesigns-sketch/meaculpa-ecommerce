// Currency utilities for multi-currency support

export type Currency = 'TRY' | 'USD' | 'EUR';

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
};

export const CURRENCY_NAMES: Record<Currency, { tr: string; en: string }> = {
  TRY: { tr: 'Türk Lirası', en: 'Turkish Lira' },
  USD: { tr: 'ABD Doları', en: 'US Dollar' },
  EUR: { tr: 'Euro', en: 'Euro' },
};

// Approximate exchange rates (should be updated from an API in production)
export const EXCHANGE_RATES: Record<Currency, number> = {
  TRY: 1,
  USD: 0.031, // 1 TRY = ~0.031 USD
  EUR: 0.029, // 1 TRY = ~0.029 EUR
};

/**
 * Convert price from TRY to target currency
 */
export function convertCurrency(
  priceInTRY: number,
  targetCurrency: Currency
): number {
  if (targetCurrency === 'TRY') return priceInTRY;
  return Math.round(priceInTRY * EXCHANGE_RATES[targetCurrency] * 100) / 100;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  price: number,
  currency: Currency,
  locale?: string
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formattedNumber = price.toLocaleString(locale || 'tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (currency === 'TRY') {
    return `${symbol}${formattedNumber}`;
  }
  return `${symbol}${formattedNumber}`;
}

/**
 * Get price in specified currency
 * If product has specific price for currency, use that
 * Otherwise convert from TRY
 */
export function getProductPrice(
  product: {
    price: number;
    priceUSD?: number;
    priceEUR?: number;
  },
  currency: Currency
): number {
  switch (currency) {
    case 'USD':
      return product.priceUSD || convertCurrency(product.price, 'USD');
    case 'EUR':
      return product.priceEUR || convertCurrency(product.price, 'EUR');
    case 'TRY':
    default:
      return product.price;
  }
}

/**
 * Get currency based on language
 */
export function getCurrencyForLanguage(language: string): Currency {
  switch (language) {
    case 'en':
      return 'USD';
    case 'tr':
    default:
      return 'TRY';
  }
}
