import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MessageSquare, Building2, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  images: string[];
}

export default function HostDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHostProperties();
  }, [user]);

  const fetchHostProperties = async () => {
    if (!user) {
      console.log('No user found, skipping fetch');
      setLoading(false);
      return;
    }
    
    console.log('Fetching properties for user:', user.id);
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        setError(`Failed to load properties: ${error.message}`);
      } else {
        console.log('Properties loaded:', data?.length || 0);
        setProperties(data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError('An unexpected error occurred while loading properties');
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

  // Mobile Loading State
  if (loading && isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Mobile Error State
  if (error && isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="text-destructive text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Unable to Load Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => {
            setError(null);
            setLoading(true);
            fetchHostProperties();
          }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Desktop Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Desktop Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <div className="text-destructive text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Unable to Load Dashboard</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => {
            setError(null);
            setLoading(true);
            fetchHostProperties();
          }}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-lg text-muted-foreground">
            Welcome to your host space
          </p>
        </div>

        {/* Stats Cards - 2 per row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">Active properties</p>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {properties.filter(p => p.status === 'active').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">Messages</p>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">-</p>
            </CardContent>
          </Card>

          <Card className="bg-card col-span-2">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">Revenue this month</p>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{formatPrice(0)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties */}
        {properties.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Recent Properties</h3>
            <div className="grid grid-cols-2 gap-3">
              {properties.slice(0, 4).map((property) => {
                const propertyImages = Array.isArray(property.images) ? property.images : [];
                const imageUrl = propertyImages.length > 0 ? propertyImages[0] : '/placeholder.svg';
                
                return (
                  <Card key={property.id} className="bg-card overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <img 
                          src={imageUrl}
                          alt={property.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-white text-sm font-medium line-clamp-2 mb-1">{property.title}</p>
                          <p className="text-white/80 text-xs">{property.city}</p>
                        </div>
                        <Badge 
                          variant={property.status === 'active' ? 'default' : 'secondary'}
                          className="absolute top-2 right-2 text-xs"
                        >
                          {property.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop Layout
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

      {/* Recent Properties */}
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
    </div>
  );
}