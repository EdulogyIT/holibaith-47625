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
    if (isMobile) {
      return (
        <>
          <MobileHeader />
          <div className="flex items-center justify-center min-h-screen pt-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading...</p>
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('host.loadingProperties')}</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <>
        <MobileHeader />
        <div className="pt-16 pb-24 px-4 bg-background min-h-screen">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">{t('host.dashboard')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('host.welcomeMessage')}
            </p>
          </div>

          {/* Stats Grid - App Style */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <Building2 className="h-6 w-6 text-primary mb-2" />
              <div className="text-2xl font-bold mb-1">{properties.filter(p => p.status === 'active').length}</div>
              <div className="text-xs text-muted-foreground">{t('host.activeProperties')}</div>
            </div>
            
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <MessageSquare className="h-6 w-6 text-primary mb-2" />
              <div className="text-2xl font-bold mb-1">-</div>
              <div className="text-xs text-muted-foreground">{t('host.messagesReceived')}</div>
            </div>
            
            <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
              <CalendarDays className="h-6 w-6 text-primary mb-2" />
              <div className="text-2xl font-bold mb-1">{formatPrice(0)}</div>
              <div className="text-xs text-muted-foreground">{t('host.monthlyRevenue')}</div>
            </div>
          </div>

          {/* Quick Actions - App Style */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">{t('host.quickActions')}</h2>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/publish-property')} 
                className="w-full h-14 text-base rounded-xl shadow-sm"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                {t('host.publishProperty')}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/host/listings')} 
                  className="h-14 rounded-xl"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  {t('host.viewListings')}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/host/messages')} 
                  className="h-14 rounded-xl"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  {t('host.messages')}
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Properties - App Style */}
          {properties.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">{t('host.recentProperties')}</h2>
              <div className="space-y-3">
                {properties.slice(0, 3).map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-card rounded-xl p-4 border border-border shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base mb-1 truncate">{property.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {property.city}
                        </p>
                      </div>
                      <Badge 
                        variant={property.status === 'active' ? 'default' : 'secondary'} 
                        className="ml-2 shrink-0"
                      >
                        {property.status === 'active' ? t('host.active') : t('host.inactive')}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('host.publishedOn')} {formatDate(property.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Calendar */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Calendar</h2>
            <PropertyCalendar />
          </div>
        </div>
        <MobileFooter />
        <MobileBottomNav />
        <FloatingMapButton />
      </>
    );
  }

  // Desktop view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('host.dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('host.welcomeMessage')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('host.activeProperties')}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{properties.filter(p => p.status === 'active').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('host.messagesReceived')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">{t('host.checkMessages')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('host.monthlyRevenue')}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('host.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => navigate('/publish-property')} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t('host.publishProperty')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/host/listings')} className="w-full">
              <Building2 className="h-4 w-4 mr-2" />
              {t('host.viewListings')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/host/messages')} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('host.messages')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Calendar */}
      <div className="grid gap-6 lg:grid-cols-2">
        {properties.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{t('host.recentProperties')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {properties.slice(0, 3).map((property) => (
                  <div key={property.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{property.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {property.city} • {t('host.publishedOn')} {formatDate(property.created_at)}
                      </p>
                    </div>
                    <Badge variant={property.status === 'active' ? 'default' : 'secondary'} className="ml-2">
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
  );
}