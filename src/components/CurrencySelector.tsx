import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCachedTimestamp } from "@/services/exchangeRateService";
import { formatDistanceToNow } from "date-fns";

const CurrencySelector = () => {
  const { currentCurrency, setCurrency, exchangeRates } = useCurrency();
  const { t } = useLanguage();
  
  const currencies = [
    { code: "USD" as Currency, name: "US Dollar", symbol: "$" },
    { code: "EUR" as Currency, name: "Euro", symbol: "€" },
    { code: "DZD" as Currency, name: "Algerian Dinar", symbol: "DA" }
  ];

  const currentCurrencyInfo = currencies.find(c => c.code === currentCurrency);
  const lastUpdated = getCachedTimestamp();

  const getExchangeRateText = (code: Currency) => {
    if (code === 'DZD') return null;
    const rate = 1 / exchangeRates[code]; // Invert to show 1 USD/EUR = X DZD
    return `1 ${code} = ${rate.toFixed(2)} DA`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="font-inter">
          <DollarSign className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border z-50 min-w-[240px]">
        <div className="px-3 py-2 text-sm font-medium text-foreground border-b">
          {t('selectCurrency') || 'Select Currency'}
        </div>
        {currencies.map((currency) => (
          <button
            key={currency.code}
            onClick={() => setCurrency(currency.code)}
            className={`w-full px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground ${
              currentCurrency === currency.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{currency.name}</span>
              <span className="text-xs text-muted-foreground">{currency.symbol}</span>
            </div>
            {getExchangeRateText(currency.code) && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {getExchangeRateText(currency.code)}
              </div>
            )}
          </button>
        ))}
        {lastUpdated && (
          <div className="px-3 py-2 text-xs text-muted-foreground border-t">
            Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;