import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CalendarDays, MessageSquare, Building2, Plus, Menu, Calendar, CreditCard, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileBottomNav from '@/components/MobileBottomNav';
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

  const menuItems = [
    { title: 'Reservations', url: '/host', icon: CalendarDays },
    { title: 'Calendar', url: '/host/calendar', icon: Calendar },
    { title: 'Listings', url: '/host/listings', icon: Building2 },
    { title: 'Messages', url: '/host/messages', icon: MessageSquare },
    { title: 'Payouts & Settings', url: '/host/payouts', icon: CreditCard },
  ];

  if (isMobile) {
    return (
      <>
        {/* Mobile App Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
              alt="Holibayt" 
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-foreground">Holibayt</h1>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col h-full">
                {/* Drawer Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/bd206675-bfd0-4aee-936b-479f6c1240ca.png" 
                      alt="Holibayt" 
                      className="h-8 w-auto"
                    />
                    <span className="font-semibold text-lg">Holibayt</span>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="px-4 pt-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Quick Actions
                  </h3>
                  <Button 
                    onClick={() => navigate('/publish-property')} 
                    className="w-full justify-start bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Publish Property
                  </Button>
                </div>

                {/* Host Dashboard Section */}
                <div className="px-4 pt-6 flex-1">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Host Dashboard
                  </h3>
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <Button
                        key={item.title}
                        variant="ghost"
                        onClick={() => navigate(item.url)}
                        className={cn(
                          "w-full justify-start",
                          location.pathname === item.url && "bg-primary text-primary-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.title}
                      </Button>
                    ))}
                  </nav>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mb-2"
                    onClick={() => navigate('/')}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Back to Home
                  </Button>
                  <div className="text-xs text-muted-foreground px-3">
                    Logged in as {user?.name}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Mobile App Content */}
        <main className="pt-16 pb-20 px-4 min-h-screen bg-background">
          <div className="space-y-6 py-6">
            {/* Hero Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-lg text-muted-foreground">
                Welcome to your host space
              </p>
            </div>

            {/* Stats Cards */}
            <div className="space-y-4">
              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Active properties</p>
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-4xl font-bold text-foreground">
                    {properties.filter(p => p.status === 'active').length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Messages received</p>
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-4xl font-bold text-foreground mb-1">-</p>
                  <p className="text-sm text-muted-foreground">Check your messages</p>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-muted-foreground">Revenue this month</p>
                    <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-4xl font-bold text-foreground">{formatPrice(0)}</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Properties */}
            {properties.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">Recent Properties</h3>
                {properties.slice(0, 3).map((property) => (
                  <Card key={property.id} className="bg-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground mb-1">{property.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {property.city} • Published {formatDate(property.created_at)}
                          </p>
                        </div>
                        <Badge 
                          variant={property.status === 'active' ? 'default' : 'secondary'}
                          className="ml-2 shrink-0"
                        >
                          {property.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <MobileBottomNav />
      </>
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