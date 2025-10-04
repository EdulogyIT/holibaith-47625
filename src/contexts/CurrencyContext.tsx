import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getExchangeRates } from '@/services/exchangeRateService';

export type Currency = 'USD' | 'DZD' | 'EUR';

interface CurrencyContextType {
  currentCurrency: Currency;
  formatPrice: (amount: string | number, priceType?: string) => string;
  getCurrencySymbol: () => string;
  setCurrency: (currency: Currency) => void;
  exchangeRates: { DZD: number; USD: number; EUR: number };
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

// Default rates (will be updated from API)
const DEFAULT_RATES = {
  DZD: 1,
  USD: 1 / 129.43, // 1 DZD = 0.00773 USD (1 USD = 129.43 DZD)
  EUR: 1 / 145     // 1 DZD = 0.00690 EUR (1 EUR = 145 DZD)
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  // Default to DZD as the base currency
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('selectedCurrency');
      return (saved as Currency) || 'DZD';
    } catch {
      return 'DZD';
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

  const formatPrice = (amount: string | number, priceType?: string): string => {
    let numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '0';

    // Assume property prices are stored in DZD (base currency)
    // Convert to target currency if different
    let convertedAmount = numAmount;
    if (currentCurrency !== 'DZD') {
      // Convert from DZD to target currency
      convertedAmount = numAmount * exchangeRates[currentCurrency];
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