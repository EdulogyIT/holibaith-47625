// Exchange Rate Service
// Fetches and caches real-time exchange rates

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_TIMESTAMP_KEY = 'exchange_rates_timestamp';
const CACHE_VERSION_KEY = 'exchange_rates_version';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_VERSION = 'v3'; // Increment when rate structure changes

// Fallback rates (October 2025) - EUR as base
const FALLBACK_RATES = {
  EUR: 1,
  USD: 1.08,      // 1 EUR = 1.08 USD
  DZD: 145        // 1 EUR = 145 DZD
};

interface ExchangeRates {
  EUR: number;
  USD: number;
  DZD: number;
}

export const getExchangeRates = async (): Promise<ExchangeRates> => {
  try {
    // Check cache version first
    const cachedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    
    // If version doesn't match, clear old cache
    if (cachedVersion !== CACHE_VERSION) {
      clearCache();
    }
    
    // Always use hardcoded rates (no API fetch)
    // This ensures consistent conversions as per business requirements:
    // 1 EUR = 1.08 USD
    // 1 EUR = 145 DZD
    const rates: ExchangeRates = FALLBACK_RATES;

    // Cache the rates with version
    localStorage.setItem(CACHE_KEY, JSON.stringify(rates));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
    localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION);

    return rates;
  } catch (error) {
    console.warn('Error setting exchange rates, using fallback:', error);
    
    // Return fallback rates if anything fails
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
  localStorage.removeItem(CACHE_VERSION_KEY);
};
