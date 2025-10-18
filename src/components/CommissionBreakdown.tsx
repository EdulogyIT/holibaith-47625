import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TrendingUp, DollarSign, Percent } from "lucide-react";

interface CommissionBreakdownProps {
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  hostAmount: number;
  currency?: string;
}

const CommissionBreakdown = ({
  totalAmount,
  commissionRate,
  commissionAmount,
  hostAmount,
  currency = 'DZD'
}: CommissionBreakdownProps) => {
  const { formatPrice } = useCurrency();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-playfair flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Earnings Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Amount */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-inter text-muted-foreground">Total Booking Amount</span>
          </div>
          <span className="font-inter font-semibold text-foreground">
            {formatPrice(totalAmount, currency)}
          </span>
        </div>

        <Separator />

        {/* Commission */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-accent" />
            <span className="text-sm font-inter text-muted-foreground">
              Platform Fee ({(commissionRate * 100).toFixed(0)}%)
            </span>
          </div>
          <span className="font-inter font-medium text-accent">
            - {formatPrice(commissionAmount, currency)}
          </span>
        </div>

        <Separator />

        {/* Host Amount */}
        <div className="flex items-center justify-between bg-primary/10 p-3 rounded-lg">
          <span className="text-base font-inter font-semibold text-foreground">
            Your Earnings
          </span>
          <span className="text-lg font-playfair font-bold text-primary">
            {formatPrice(hostAmount, currency)}
          </span>
        </div>

        {/* Info Note */}
        <p className="text-xs text-muted-foreground font-inter mt-2">
          * Payment will be released automatically 24 hours after guest check-out
        </p>
      </CardContent>
    </Card>
  );
};

export default CommissionBreakdown;
