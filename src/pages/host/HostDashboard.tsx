import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MessageSquare, Phone, CheckCircle, Building2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyCalendar from '@/components/PropertyCalendar';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileHeader from '@/components/MobileHeader';
import MobileBottomNav from '@/components/MobileBottomNav';
import MobileFooter from '@/components/MobileFooter';
import FloatingMapButton from '@/components/FloatingMapButton';
import { cn } from '@/lib/utils';

interface Property {
  id: string;
  title: string;
  property_type: string;
  city: string;
  district: string;
  price: string;
  price_type: string;
  status: string;
  created_at: string;
  category: string;
}

export default function HostDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostProperties();
  }, [user]);

  const fetchHostProperties = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else {
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('host.loadingProperties')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isMobile && <MobileHeader />}
      <div className={cn("space-y-6", isMobile ? "pt-16 pb-24 px-4" : "")}>
        <div className={cn(isMobile && "text-center")}>
          <h1 className={cn("text-3xl font-bold", isMobile && "text-2xl")}>{t('host.dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('host.welcomeMessage')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "md:grid-cols-3")}>
          <Card>
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", isMobile ? "pb-1 p-3" : "pb-2")}>
              <CardTitle className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>{t('host.activeProperties')}</CardTitle>
              <Building2 className={cn("text-muted-foreground", isMobile ? "h-3 w-3" : "h-4 w-4")} />
            </CardHeader>
            <CardContent className={cn(isMobile && "p-3 pt-0")}>
              <div className={cn("font-bold", isMobile ? "text-lg" : "text-2xl")}>{properties.filter(p => p.status === 'active').length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", isMobile ? "pb-1 p-3" : "pb-2")}>
              <CardTitle className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>{t('host.messagesReceived')}</CardTitle>
              <MessageSquare className={cn("text-muted-foreground", isMobile ? "h-3 w-3" : "h-4 w-4")} />
            </CardHeader>
            <CardContent className={cn(isMobile && "p-3 pt-0")}>
              <div className={cn("font-bold", isMobile ? "text-lg" : "text-2xl")}>-</div>
              <p className={cn("text-muted-foreground", isMobile ? "text-[10px]" : "text-xs")}>{t('host.checkMessages')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", isMobile ? "pb-1 p-3" : "pb-2")}>
              <CardTitle className={cn("font-medium", isMobile ? "text-xs" : "text-sm")}>{t('host.monthlyRevenue')}</CardTitle>
              <CalendarDays className={cn("text-muted-foreground", isMobile ? "h-3 w-3" : "h-4 w-4")} />
            </CardHeader>
            <CardContent className={cn(isMobile && "p-3 pt-0")}>
              <div className={cn("font-bold", isMobile ? "text-lg" : "text-2xl")}>{formatPrice(0)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className={cn(isMobile && "p-3")}>
            <CardTitle className={cn(isMobile && "text-sm")}>{t('host.quickActions')}</CardTitle>
          </CardHeader>
          <CardContent className={cn(isMobile && "p-3 pt-0")}>
            <div className={cn("flex flex-col gap-2", isMobile ? "gap-2" : "sm:flex-row gap-4")}>
              <Button onClick={() => navigate('/publish-property')} className={cn("w-full", isMobile && "text-xs h-9")}>
                <Plus className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {t('host.publishProperty')}
              </Button>
              <Button variant="outline" onClick={() => navigate('/host/listings')} className={cn("w-full", isMobile && "text-xs h-9")}>
                <Building2 className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {t('host.viewListings')}
              </Button>
              <Button variant="outline" onClick={() => navigate('/host/messages')} className={cn("w-full", isMobile && "text-xs h-9")}>
                <MessageSquare className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                {t('host.messages')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity and Calendar */}
        <div className={cn("grid gap-4", isMobile ? "grid-cols-1" : "lg:grid-cols-2 gap-6")}>
          {properties.length > 0 && (
            <Card>
              <CardHeader className={cn(isMobile && "p-3")}>
                <CardTitle className={cn(isMobile && "text-sm")}>{t('host.recentProperties')}</CardTitle>
              </CardHeader>
              <CardContent className={cn(isMobile && "p-3 pt-0")}>
                <div className={cn("space-y-2", isMobile && "space-y-2")}>
                  {properties.slice(0, 3).map((property) => (
                    <div key={property.id} className={cn("flex items-center justify-between border rounded-lg", isMobile ? "p-2" : "p-3")}>
                      <div className="flex-1 min-w-0">
                        <p className={cn("font-medium truncate", isMobile && "text-xs")}>{property.title}</p>
                        <p className={cn("text-muted-foreground truncate", isMobile ? "text-[10px]" : "text-sm")}>
                          {property.city} • {t('host.publishedOn')} {formatDate(property.created_at)}
                        </p>
                      </div>
                      <Badge variant={property.status === 'active' ? 'default' : 'secondary'} className={cn("ml-2", isMobile && "text-[10px] px-1.5 py-0")}>
                        {property.status === 'active' ? t('host.active') : t('host.inactive')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Property Calendar */}
          <PropertyCalendar />
        </div>
      </div>
      {isMobile && (
        <>
          <MobileFooter />
          <MobileBottomNav />
          <FloatingMapButton />
        </>
      )}
    </>
  );
}