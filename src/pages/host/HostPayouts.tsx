import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { format } from 'date-fns';

interface CommissionTransaction {
  id: string;
  total_amount: number;
  commission_rate: number;
  commission_amount: number;
  host_amount: number;
  status: string;
  created_at: string;
  properties: {
    title: string;
    property_type: string;
  } | null;
  payments: {
    description: string;
  } | null;
}

interface HostPaymentAccount {
  id: string;
  stripe_account_id: string | null;
  is_verified: boolean;
  is_active: boolean;
}

export default function HostPayouts() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const isMobile = useIsMobile();
  const [commissionTransactions, setCommissionTransactions] = useState<CommissionTransaction[]>([]);
  const [paymentAccount, setPaymentAccount] = useState<HostPaymentAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch commission transactions
      const { data: transData, error: transError } = await supabase
        .from('commission_transactions')
        .select(`
          *,
          properties(title, property_type),
          payments(description)
        `)
        .eq('host_user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transError) throw transError;
      setCommissionTransactions(transData || []);

      // Fetch payment account
      const { data: accountData, error: accountError } = await supabase
        .from('host_payment_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .maybeSingle();

      if (!accountError && accountData) {
        setPaymentAccount(accountData);
      }
    } catch (error) {
      console.error('Error fetching payout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = () => {
    // Navigate to payment settings to connect Stripe
    window.location.href = '/host/payment-settings';
  };

  // Calculate earnings
  const completedEarnings = commissionTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.host_amount, 0);

  const pendingEarnings = commissionTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.host_amount, 0);

  const totalTransactions = commissionTransactions.length;

  const isStripeConnected = paymentAccount?.stripe_account_id && paymentAccount?.is_verified;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading Earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Payouts & Earnings</h1>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
          Automatic payouts via Stripe Connect
        </p>
      </div>

      {/* Stripe Connection Status */}
      {isStripeConnected ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Stripe Connected</strong> - Your payouts are automatic. Funds are transferred when bookings are completed.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Connect Stripe to receive payouts</strong> - Set up your Stripe account to start earning.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={handleConnectStripe}
            >
              Connect Stripe
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Earnings Overview */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2 p-4' : 'pb-2'}`}>
            <CardTitle className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>Total Earnings</CardTitle>
            <DollarSign className={`text-muted-foreground ${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-2xl' : 'text-2xl'}`}>{formatPrice(completedEarnings, '', 'DZD')}</div>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>Completed bookings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2 p-4' : 'pb-2'}`}>
            <CardTitle className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>Pending Earnings</CardTitle>
            <Clock className={`text-amber-600 ${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className={`font-bold text-amber-600 ${isMobile ? 'text-2xl' : 'text-2xl'}`}>{formatPrice(pendingEarnings, '', 'DZD')}</div>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>In active bookings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-2 p-4' : 'pb-2'}`}>
            <CardTitle className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>Payout Method</CardTitle>
            <CheckCircle className={`${isStripeConnected ? 'text-green-600' : 'text-muted-foreground'} ${isMobile ? 'h-4 w-4' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-2xl' : 'text-2xl'}`}>
              {isStripeConnected ? 'Active' : 'Not Set'}
            </div>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {isStripeConnected ? 'Automatic via Stripe' : 'Connect Stripe account'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History & Payout Information Tabs */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="info">Payout Information</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {commissionTransactions.length === 0 
                  ? 'No transactions yet' 
                  : `${totalTransactions} total transactions`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commissionTransactions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No transactions yet. Start hosting to earn!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {commissionTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border rounded-lg gap-3"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="font-medium">
                          {transaction.properties?.title || 'Property'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.created_at), 'dd/MM/yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Total: {formatPrice(transaction.total_amount, '', 'DZD')} • Commission: {Math.round(transaction.commission_rate * 100)}%
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-foreground">
                            {formatPrice(transaction.host_amount, '', 'DZD')}
                          </p>
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How Payouts Work</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Automatic Payments</h3>
                <p className="text-sm text-muted-foreground">
                  When a guest completes a booking, the platform automatically:
                </p>
                <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Deducts the platform commission (typically 15%)</li>
                  <li>Transfers your earnings directly to your Stripe account</li>
                  <li>Makes funds available within 2 business days</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Payout Schedule</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Standard payouts: 2 business days after booking completion</li>
                  <li>• Instant payouts: Available for eligible accounts (fees apply)</li>
                  <li>• Monthly statements available in your Stripe Dashboard</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Tax & Reporting</h3>
                <p className="text-sm text-muted-foreground">
                  All transactions are recorded in your Stripe Dashboard. You can download detailed reports for tax purposes at any time.
                </p>
              </div>

              {isStripeConnected && (
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                    Open Stripe Dashboard
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
