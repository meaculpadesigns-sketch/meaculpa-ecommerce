// Currency conversion rates (USD and EUR to TRY)
const EXCHANGE_RATES = {
  USD: 34.50, // 1 USD = 34.50 TRY (güncel kuru buradan güncelleyin)
  EUR: 37.20, // 1 EUR = 37.20 TRY (güncel kuru buradan güncelleyin)
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
