import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
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
  } | null;
  payments: {
    description: string;
  } | null;
}

export default function HostPayouts() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const isMobile = useIsMobile();
  const [commissionTransactions, setCommissionTransactions] = useState<CommissionTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCommissionTransactions();
    }
  }, [user]);

  const fetchCommissionTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('commission_transactions')
        .select(`
          *,
          properties(title),
          payments(description)
        `)
        .eq('host_user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setCommissionTransactions(data || []);
    } catch (error) {
      console.error('Error fetching commission transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stripe transfers automatically - calculate earnings
  const completedEarnings = commissionTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.host_amount, 0);

  const pendingEarnings = commissionTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.host_amount, 0);

  const totalTransactions = commissionTransactions.length;

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
        <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>Earnings</h1>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
          View Your Earnings History - Payments Automatically Transferred Via Stripe
        </p>
      </div>

      {/* Earnings Overview */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'md:grid-cols-3'}`}>
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1 p-4' : 'pb-2'}`}>
            <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Total Earnings</CardTitle>
            <DollarSign className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{formatPrice(completedEarnings, '', 'DZD')}</div>
            <p className={`text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Completed Transfers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1 p-4' : 'pb-2'}`}>
            <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Pending</CardTitle>
            <Clock className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{formatPrice(pendingEarnings, '', 'DZD')}</div>
            <p className={`text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Being Processed By Stripe</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${isMobile ? 'pb-1 p-4' : 'pb-2'}`}>
            <CardTitle className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>Total Transactions</CardTitle>
            <TrendingUp className={`text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{totalTransactions}</div>
            <p className={`text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>All Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
          <CardDescription>
            Your Earnings Are Automatically Transferred To Your Stripe Connected Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {commissionTransactions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No Transactions Yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {commissionTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      Property: {transaction.properties?.title || 'Unknown Property'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), 'PPP')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {transaction.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {transaction.status === 'pending' && (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-bold text-green-600">
                      +{formatPrice(transaction.host_amount, '', 'DZD')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total: {formatPrice(transaction.total_amount, '', 'DZD')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Commission: {formatPrice(transaction.commission_amount, '', 'DZD')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
