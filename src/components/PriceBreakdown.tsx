import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PriceBreakdownProps {
  basePrice: number;
  nights: number;
  priceType: string;
  category: string;
  propertyId: string;
}

export const PriceBreakdown = ({ basePrice, nights, priceType, category, propertyId }: PriceBreakdownProps) => {
  const { formatPrice, currentCurrency } = useCurrency();
  const [commissionRate, setCommissionRate] = useState(0.15); // Default 15%

  useEffect(() => {
    const fetchCommissionRate = async () => {
      try {
        // Determine setting key based on category
        let settingKey = 'short_stay_commission_rate';
        if (category === 'rent') {
          settingKey = 'rent_commission_rate';
        } else if (category === 'buy') {
          settingKey = 'buy_commission_rate';
        }

        // Fetch from platform_settings
        const { data: settings } = await supabase
          .from('platform_settings')
          .select('setting_value')
          .eq('setting_key', settingKey)
          .maybeSingle();

        if (settings?.setting_value && typeof settings.setting_value === 'object' && 'rate' in settings.setting_value) {
          setCommissionRate(Number(settings.setting_value.rate));
        } else {
          // Fallback: Try to get commission_rate from the property
          const { data: property } = await supabase
            .from('properties')
            .select('commission_rate')
            .eq('id', propertyId)
            .maybeSingle();

          if (property?.commission_rate) {
            setCommissionRate(property.commission_rate);
          }
        }
      } catch (error) {
        console.error('Error fetching commission rate:', error);
      }
    };

    fetchCommissionRate();
  }, [propertyId, category]);

  // Calculate nightly price if needed
  let nightlyPrice = basePrice;
  if (priceType === 'monthly' && category === 'short-stay') {
    nightlyPrice = basePrice / 30.44;
  } else if (priceType === 'weekly' && category === 'short-stay') {
    nightlyPrice = basePrice / 7;
  }

  const subtotal = nightlyPrice * nights;
  const taxes = subtotal * 0.15; // 15% taxes
  const total = subtotal + taxes;
  const hostEarnings = subtotal * (1 - commissionRate);
  const platformCommission = subtotal * commissionRate;

  return (
    <Card className="border-accent/20">
      <CardHeader className="p-4">
        <CardTitle className="text-base">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {nights} night{nights !== 1 ? 's' : ''} × {formatPrice(nightlyPrice, 'daily', currentCurrency as any)}
            </span>
            <span>{formatPrice(subtotal, '', currentCurrency as any)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Taxes</span>
            <span>{formatPrice(taxes, '', currentCurrency as any)}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total, '', currentCurrency as any)}</span>
        </div>

      </CardContent>
    </Card>
  );
};
