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
        // Try to fetch from platform_settings first
        const { data: settings } = await supabase
          .from('platform_settings')
          .select('setting_value')
          .eq('setting_key', 'commission_rate')
          .single();

        if (settings?.setting_value && typeof settings.setting_value === 'object' && 'rate' in settings.setting_value) {
          setCommissionRate(Number(settings.setting_value.rate));
        } else {
          // Fallback: Try to get commission_rate from the property
          const { data: property } = await supabase
            .from('properties')
            .select('commission_rate')
            .eq('id', propertyId)
            .single();

          if (property?.commission_rate) {
            setCommissionRate(property.commission_rate);
          }
        }
      } catch (error) {
        console.error('Error fetching commission rate:', error);
      }
    };

    fetchCommissionRate();
  }, [propertyId]);

  // Calculate nightly price if needed
  let nightlyPrice = basePrice;
  if (priceType === 'monthly' && category === 'short-stay') {
    nightlyPrice = basePrice / 30.44;
  } else if (priceType === 'weekly' && category === 'short-stay') {
    nightlyPrice = basePrice / 7;
  }

  const subtotal = nightlyPrice * nights;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const cleaningFee = nightlyPrice * 0.1; // 10% cleaning fee
  const taxes = subtotal * 0.05; // 5% taxes
  const hostEarnings = subtotal * (1 - commissionRate);
  const platformCommission = subtotal * commissionRate;
  const total = subtotal + serviceFee + cleaningFee + taxes;

  return (
    <Card className="border-accent/20">
      <CardHeader className="p-4">
        <CardTitle className="text-base">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {formatPrice(nightlyPrice, 'daily', currentCurrency as any)} × {nights} night{nights !== 1 ? 's' : ''}
            </span>
            <span>{formatPrice(subtotal, '', currentCurrency as any)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Service fee (5%)</span>
            <span>{formatPrice(serviceFee, '', currentCurrency as any)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Cleaning fee</span>
            <span>{formatPrice(cleaningFee, '', currentCurrency as any)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Taxes (5%)</span>
            <span>{formatPrice(taxes, '', currentCurrency as any)}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total, '', currentCurrency as any)}</span>
        </div>

        <Separator className="my-2" />

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Host earnings ({(100 - commissionRate * 100).toFixed(0)}%)</span>
            <span>{formatPrice(hostEarnings, '', currentCurrency as any)}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform commission ({(commissionRate * 100).toFixed(0)}%)</span>
            <span>{formatPrice(platformCommission, '', currentCurrency as any)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
