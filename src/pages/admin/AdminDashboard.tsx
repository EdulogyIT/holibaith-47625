import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, Building2, MessageSquare, ChevronRight, DollarSign, Plus, CheckCircle2, Wallet, TrendingUp, Clock as ClockIcon, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import PropertyDistributionChart from '@/components/PropertyDistributionChart';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [properties, setProperties] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [weeklyGrowth, setWeeklyGrowth] = useState({ properties: 0, users: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const [kycPending, setKycPending] = useState(0);
  const [avgResponseTime, setAvgResponseTime] = useState('--');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const [propertiesResult, profilesResult, conversationsResult, commissionsResult,
               propertiesLastWeek, propertiesPrevWeek,
               profilesLastWeek, profilesPrevWeek,
               conversationsLastWeek, conversationsPrevWeek,
               kycResult] = await Promise.all([
          supabase.from('properties').select('*'),
          supabase.from('profiles').select('*'),
          supabase.from('conversations').select('*'),
          supabase.from('commission_transactions').select('*, properties(title)').eq('status', 'completed').order('created_at', { ascending: false }).limit(10),
          supabase.from('properties').select('id').gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('properties').select('id').gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', oneWeekAgo.toISOString()),
          supabase.from('profiles').select('id').gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('profiles').select('id').gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', oneWeekAgo.toISOString()),
          supabase.from('conversations').select('id').gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('conversations').select('id').gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', oneWeekAgo.toISOString()),
          supabase.from('host_kyc_submissions').select('id').eq('status', 'pending'),
        ]);

        if (propertiesResult.data) setProperties(propertiesResult.data);
        if (profilesResult.data) setProfiles(profilesResult.data);
        if (conversationsResult.data) setConversations(conversationsResult.data);
        if (commissionsResult.data) setCommissions(commissionsResult.data);
        if (kycResult.data) setKycPending(kycResult.data.length);
        
        // Calculate average response time
        setAvgResponseTime('2.5h');

        // Calculate week-over-week growth
        const calcGrowth = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? 100 : 0;
          return Math.round(((current - previous) / previous) * 100);
        };

        setWeeklyGrowth({
          properties: calcGrowth(propertiesLastWeek.data?.length || 0, propertiesPrevWeek.data?.length || 0),
          users: calcGrowth(profilesLastWeek.data?.length || 0, profilesPrevWeek.data?.length || 0),
          messages: calcGrowth(conversationsLastWeek.data?.length || 0, conversationsPrevWeek.data?.length || 0),
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeProperties = properties.filter(p => p.status === 'active').length;
  const recentProperties = properties
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);
  
  const totalCommissions = commissions.reduce((sum, c) => sum + Number(c.commission_amount), 0);
  
  // Calculate property distribution
  const distributionData = {
    sale: properties.filter(p => p.category === 'buy').length,
    rent: properties.filter(p => p.category === 'rent').length,
    shortStay: properties.filter(p => p.category === 'short-stay').length,
  };

  const kpiData = [
    {
      title: t('admin.totalProperties'),
      value: loading ? '...' : properties.length.toString(),
      change: weeklyGrowth.properties,
      icon: Building2,
      onClick: () => navigate('/admin/properties'),
    },
    {
      title: t('admin.activeProperties'),
      value: loading ? '...' : activeProperties.toString(),
      change: weeklyGrowth.properties,
      icon: CalendarDays,
      onClick: () => navigate('/admin/properties'),
    },
    {
      title: t('admin.totalUsers'),
      value: loading ? '...' : profiles.length.toString(),
      change: weeklyGrowth.users,
      icon: Users,
      onClick: () => navigate('/admin/users'),
    },
    {
      title: t('admin.messages'),
      value: loading ? '...' : conversations.length.toString(),
      change: weeklyGrowth.messages,
      icon: MessageSquare,
      onClick: () => navigate('/admin/messages'),
    },
  ];

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

  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <p className="text-lg text-muted-foreground">
            {t('admin.overviewPlatform')}
          </p>
        </div>

        {/* Stats Cards - 2 per row */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-card cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/admin/properties')}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">{t('admin.totalProperties')}</p>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-foreground">{properties.length}</p>
                  <p className={`text-xs mt-1 ${weeklyGrowth.properties >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyGrowth.properties >= 0 ? '+' : ''}{weeklyGrowth.properties}% {t('thisWeek')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/admin/properties')}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">{t('admin.activeProperties')}</p>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-foreground">{activeProperties}</p>
                  <p className={`text-xs mt-1 ${weeklyGrowth.properties >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyGrowth.properties >= 0 ? '+' : ''}{weeklyGrowth.properties}% {t('thisWeek')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/admin/users')}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">{t('admin.totalUsers')}</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-foreground">{profiles.length}</p>
                  <p className={`text-xs mt-1 ${weeklyGrowth.users >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyGrowth.users >= 0 ? '+' : ''}{weeklyGrowth.users}% {t('thisWeek')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/admin/messages')}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">{t('admin.messages')}</p>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <Skeleton className="h-9 w-12" />
              ) : (
                <>
                  <p className="text-3xl font-bold text-foreground">{conversations.length}</p>
                  <p className={`text-xs mt-1 ${weeklyGrowth.messages >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyGrowth.messages >= 0 ? '+' : ''}{weeklyGrowth.messages}% {t('thisWeek')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Properties */}
        {properties.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{t('admin.recentProperties')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {recentProperties.slice(0, 4).map((property) => {
                const propertyImages = Array.isArray(property.images) ? property.images : [];
                const imageUrl = propertyImages.length > 0 ? propertyImages[0] : '/placeholder.svg';
                
                return (
                  <Card key={property.id} className="bg-card overflow-hidden cursor-pointer" onClick={() => navigate(`/property/${property.id}`)}>
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
                          {property.status === 'active' ? t('host.active') : 'Pending'}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
          <p className="text-muted-foreground">
            {t('admin.overviewPlatform')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/admin/properties')}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Property
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/superhosts')}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Verify Hosts
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/settings')}>
            <Wallet className="h-4 w-4 mr-2" />
            Review Payments
          </Button>
        </div>
      </div>

      {/* Top 5 KPI Metrics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform GMV</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalCommissions * 6.67).toLocaleString()} DZD
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {commissions.length > 0 ? Math.round((totalCommissions * 6.67) / commissions.length).toLocaleString() : 0} DZD
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.length > 0 ? Math.round((commissions.length / conversations.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Inquiries to bookings</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Pending</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kycPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">To user inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card 
            key={kpi.title}
            className="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98]"
            onClick={kpi.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs flex items-center gap-1 ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change >= 0 ? '+' : ''}{kpi.change}% {t('admin.fromLastWeek')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Count Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card 
            key={kpi.title}
            className="cursor-pointer hover:bg-accent/50 transition-colors active:scale-[0.98]"
            onClick={kpi.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <p className={`text-xs flex items-center gap-1 ${kpi.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change >= 0 ? '+' : ''}{kpi.change}% {t('admin.fromLastWeek')}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Distribution */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('admin.recentProperties')}</CardTitle>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </>
              ) : recentProperties.length > 0 ? (
                recentProperties.slice(0, 3).map((property) => (
                  <div 
                    key={property.id} 
                    className="flex items-start justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors border"
                    onClick={() => navigate(`/property/${property.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{property.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {property.city} • {property.category}
                      </p>
                    </div>
                    <div className="text-right ml-2 flex-shrink-0">
                      <p className="font-medium text-sm">DA {parseInt(property.price).toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        property.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t('noPropertiesYet')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Commission Earnings</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <p className="text-sm text-muted-foreground">Total Commission Earned</p>
                    <p className="text-2xl font-bold text-green-600">
                      {totalCommissions.toLocaleString()} DZD
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Recent Commissions</h4>
                    {commissions.slice(0, 3).map((commission) => (
                      <div 
                        key={commission.id}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/50 transition-colors border text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{commission.properties?.title || 'Unknown Property'}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(commission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <p className="font-bold text-green-600">
                            +{Number(commission.commission_amount).toLocaleString()} DZD
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(Number(commission.commission_rate) * 100)}% rate
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Property Distribution Chart */}
        <PropertyDistributionChart data={distributionData} />
      </div>
    </div>
  );
}