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
