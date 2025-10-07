// Exchange Rate Service
// Fetches and caches real-time exchange rates

import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_TIMESTAMP_KEY = 'exchange_rates_timestamp';
const CACHE_VERSION_KEY = 'exchange_rates_version';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_VERSION = 'v4'; // Increment when rate structure changes

// Fallback rates (October 2025) - EUR as base
const FALLBACK_RATES = {
  EUR: 1,
  USD: 1.08,      // 1 EUR = 1.08 USD
  DZD: 145        // 1 EUR = 145 DZD (will be fetched from admin settings)
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
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const now = Date.now();
    
    // If version doesn't match, clear old cache
    if (cachedVersion !== CACHE_VERSION) {
      clearCache();
    }
    
    // Check if cache is still valid
    if (cachedTimestamp && (now - parseInt(cachedTimestamp)) < CACHE_DURATION) {
      const cachedRates = localStorage.getItem(CACHE_KEY);
      if (cachedRates) {
        return JSON.parse(cachedRates);
      }
    }
    
    // Fetch DZD to EUR rate from admin settings
    let dzdToEurRate = FALLBACK_RATES.DZD;
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('setting_value')
        .eq('setting_key', 'dzd_to_eur_rate')
        .maybeSingle();
      
      if (!error && data?.setting_value && typeof data.setting_value === 'object' && 'rate' in data.setting_value) {
        // Convert DZD to EUR rate to EUR to DZD (1 EUR = X DZD)
        dzdToEurRate = Math.round(1 / (data.setting_value.rate as number));
      }
    } catch (error) {
      console.warn('Could not fetch DZD rate from settings, using fallback:', error);
    }
    
    // Build rates object
    const rates: ExchangeRates = {
      EUR: 1,
      USD: 1.08,      // Fixed: 1 EUR = 1.08 USD
      DZD: dzdToEurRate // From admin settings or fallback
    };

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
