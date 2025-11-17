// Currency conversion rates (USD and EUR to TRY)
// Güncel kurlar (Kasım 2024): 1 USD ≈ 42.35 TRY, 1 EUR ≈ 44.20 TRY
const EXCHANGE_RATES = {
  USD: 42.35, // 1 USD = 42.35 TRY
  EUR: 44.20, // 1 EUR = 44.20 TRY
};

export function formatPrice(priceInTRY: number, language: string = 'tr'): string {
  if (language === 'en') {
    // Show in USD for English
    const priceInUSD = priceInTRY / EXCHANGE_RATES.USD;
    return `$${priceInUSD.toFixed(2)}`;
  }

  // Default to TRY for Turkish
  return `₺${priceInTRY.toFixed(2)}`;
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
