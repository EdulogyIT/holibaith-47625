// Exchange Rate Service
// Fetches and caches real-time exchange rates

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_TIMESTAMP_KEY = 'exchange_rates_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Fallback rates (October 2025) - EUR as base
const FALLBACK_RATES = {
  EUR: 1,
  USD: 1.17,      // 1 EUR = 1.17 USD
  DZD: 151.44     // 1 EUR = 151.44 DZD
};

interface ExchangeRates {
  EUR: number;
  USD: number;
  DZD: number;
}

export const getExchangeRates = async (): Promise<ExchangeRates> => {
  try {
    // Check cache first
    const cachedRates = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    
    if (cachedRates && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp, 10);
      const now = Date.now();
      
      // If cache is still valid, return cached rates
      if (now - timestamp < CACHE_DURATION) {
        return JSON.parse(cachedRates);
      }
    }

    // Fetch fresh rates from API (using EUR as base)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    
    // Extract rates we need
    const rates: ExchangeRates = {
      EUR: 1,
      USD: data.rates.USD || FALLBACK_RATES.USD,
      DZD: data.rates.DZD || FALLBACK_RATES.DZD
    };

    // Cache the rates
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());

    return rates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates, using fallback:', error);
    
    // Return fallback rates if API fails
    return FALLBACK_RATES;
  }
};

export const getCachedTimestamp = (): number | null => {
  const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
  return timestamp ? parseInt(timestamp, 10) : null;
};

export const clearCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
};
