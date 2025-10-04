import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, Building2, MessageSquare, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [weeklyGrowth, setWeeklyGrowth] = useState({ properties: 0, users: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const [propertiesResult, profilesResult, conversationsResult, 
               propertiesLastWeek, propertiesPrevWeek,
               profilesLastWeek, profilesPrevWeek,
               conversationsLastWeek, conversationsPrevWeek] = await Promise.all([
          supabase.from('properties').select('*'),
          supabase.from('profiles').select('*'),
          supabase.from('conversations').select('*'),
          supabase.from('properties').select('id').gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('properties').select('id').gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', oneWeekAgo.toISOString()),
          supabase.from('profiles').select('id').gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('profiles').select('id').gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', oneWeekAgo.toISOString()),
          supabase.from('conversations').select('id').gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('conversations').select('id').gte('created_at', twoWeeksAgo.toISOString()).lt('created_at', oneWeekAgo.toISOString()),
        ]);

        if (propertiesResult.data) setProperties(propertiesResult.data);
        if (profilesResult.data) setProfiles(profilesResult.data);
        if (conversationsResult.data) setConversations(conversationsResult.data);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('admin.dashboard')}</h1>
        <p className="text-muted-foreground">
          {t('admin.overviewPlatform')}
        </p>
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

      {/* Recent Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
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
                  <p>No properties yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('admin.propertyDistribution')}</CardTitle>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              ) : (
                <>
                  {[
                    { label: 'Sale', value: 'sale' },
                    { label: 'Rent', value: 'rent' },
                    { label: 'Short Stay', value: 'short-stay' }
                  ].map((category) => {
                    const count = properties.filter(p => 
                      p.category.toLowerCase() === category.value.toLowerCase()
                    ).length;
                    const percentage = properties.length > 0 ? Math.round((count / properties.length) * 100) : 0;
                    
                    return (
                      <div 
                        key={category.value} 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors border"
                        onClick={() => navigate('/admin/properties')}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{category.label}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-right ml-4 flex-shrink-0">
                          <p className="font-bold text-lg">{percentage}%</p>
                          <p className="text-xs text-muted-foreground">{count} properties</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}