import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getExchangeRates } from '@/services/exchangeRateService';

export type Currency = 'USD' | 'DZD' | 'EUR';

interface CurrencyContextType {
  currentCurrency: Currency;
  formatPrice: (amount: string | number, priceType?: string, sourceCurrency?: Currency) => string;
  getCurrencySymbol: () => string;
  setCurrency: (currency: Currency) => void;
  exchangeRates: { EUR: number; USD: number; DZD: number };
}

const currencyConfig = {
  USD: {
    symbol: '$',
    code: 'USD',
    name: 'US Dollar',
    position: 'before' as const // $100
  },
  DZD: {
    symbol: 'DA',
    code: 'DZD', 
    name: 'Algerian Dinar',
    position: 'after' as const // 100 DA
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro',
    position: 'before' as const // €100
  }
};

// Default rates (will be updated from API) - EUR as base
const DEFAULT_RATES = {
  EUR: 1,
  USD: 1.08,      // 1 EUR = 1.08 USD
  DZD: 145        // 1 EUR = 145 DZD
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  // Default to EUR as the base currency for accurate conversions
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('selectedCurrency');
      return (saved as Currency) || 'EUR';
    } catch {
      return 'EUR';
    }
  });

  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);

  // Fetch exchange rates on mount
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await getExchangeRates();
        setExchangeRates(rates);
      } catch (error) {
        console.warn('Using default exchange rates');
      }
    };
    
    fetchRates();
  }, []);

  const setCurrency = (currency: Currency) => {
    setCurrentCurrency(currency);
    try {
      localStorage.setItem('selectedCurrency', currency);
    } catch {
      // Handle localStorage errors gracefully
    }
  };

  const formatPrice = (amount: string | number, priceType?: string, sourceCurrency: Currency = 'EUR'): string => {
    let numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '0';

    // Convert from source currency to target currency
    let convertedAmount = numAmount;
    
    // First convert to EUR if source is not EUR
    if (sourceCurrency !== 'EUR') {
      // Convert source to EUR first (divide by the rate to get EUR)
      convertedAmount = numAmount / exchangeRates[sourceCurrency];
    }
    
    // Then convert from EUR to target currency
    if (currentCurrency !== 'EUR') {
      convertedAmount = convertedAmount * exchangeRates[currentCurrency];
    }

    const config = currencyConfig[currentCurrency];
    const formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: currentCurrency === 'DZD' ? 0 : 2,
    }).format(convertedAmount);

    let result = '';
    if (config.position === 'before') {
      result = `${config.symbol}${formattedAmount}`;
    } else {
      result = `${formattedAmount} ${config.symbol}`;
    }

    // Add price type suffix if provided
    if (priceType === 'monthlyPrice' || priceType === 'monthly') {
      result += '/month';
    } else if (priceType === 'dailyPrice' || priceType === 'daily') {
      result += '/day';
    } else if (priceType === 'weeklyPrice' || priceType === 'weekly') {
      result += '/week';
    }

    return result;
  };

  const getCurrencySymbol = (): string => {
    return currencyConfig[currentCurrency].symbol;
  };

  const contextValue: CurrencyContextType = {
    currentCurrency,
    formatPrice,
    getCurrencySymbol,
    setCurrency,
    exchangeRates
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export { currencyConfig };