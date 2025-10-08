import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  Calendar, 
  User, 
  Phone, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  status: string;
  total_amount: number;
  booking_fee: number;
  contact_phone: string;
  created_at: string;
  property: {
    id: string;
    title: string;
    city: string;
    images: string[];
  };
  profile: {
    name: string;
    email: string;
    avatar_url: string;
  };
}

const HostBookings = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // First get properties owned by the host
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id')
        .eq('user_id', user?.id);

      if (propertiesError) {
        console.error('Error fetching properties:', propertiesError);
        return;
      }

      const propertyIds = properties?.map(p => p.id) || [];

      if (propertyIds.length === 0) {
        setBookings([]);
        return;
      }

      // Fetch bookings for these properties
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          guests_count,
          status,
          total_amount,
          booking_fee,
          contact_phone,
          created_at,
          user_id,
          property_id
        `)
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      // Fetch related data
      const bookingsWithDetails = await Promise.all(
        (data || []).map(async (booking) => {
          const [propertyData, profileData] = await Promise.all([
            supabase
              .from('properties')
              .select('id, title, city, images')
              .eq('id', booking.property_id)
              .single(),
            supabase
              .from('profiles')
              .select('name, email, avatar_url')
              .eq('id', booking.user_id)
              .single()
          ]);

          return {
            ...booking,
            property: propertyData.data || { id: '', title: '', city: '', images: [] },
            profile: profileData.data || { name: '', email: '', avatar_url: '' }
          };
        })
      );

      setBookings(bookingsWithDetails);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: any; icon: any }> = {
      confirmed: { variant: 'default', icon: CheckCircle },
      pending: { variant: 'secondary', icon: Clock },
      cancelled: { variant: 'destructive', icon: XCircle },
      completed: { variant: 'outline', icon: CheckCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings;
    return bookings.filter((booking) => booking.status === status);
  };

  const filteredBookings = filterBookings(activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Your Property Reservations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No Bookings Found</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {booking.property.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.property.city}
                        </p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{booking.profile.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(booking.check_in_date), 'MMM dd')} -{' '}
                          {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{booking.guests_count} {booking.guests_count > 1 ? 'Guests' : 'Guest'}</span>
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>{booking.total_amount.toLocaleString()} DZD</span>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/property/${booking.property.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Property
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Manage Your Property Reservations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({bookings.filter((b) => b.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({bookings.filter((b) => b.status === 'completed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground">No Bookings Found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bookings Will Appear Here Once Guests Make Reservations
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={booking.property.images[0] || '/placeholder.svg'}
                          alt={booking.property.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">
                              {booking.property.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {booking.property.city}
                            </p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Guest</p>
                              <p className="font-medium text-foreground">{booking.profile.name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Check-In / Check-Out</p>
                              <p className="font-medium text-foreground">
                                {format(new Date(booking.check_in_date), 'MMM dd')} -{' '}
                                {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Guests</p>
                              <p className="font-medium text-foreground">
                                {booking.guests_count} {booking.guests_count > 1 ? 'Guests' : 'Guest'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Total Amount</p>
                              <p className="font-semibold text-foreground">
                                {booking.total_amount.toLocaleString()} DZD
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/property/${booking.property.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Property
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HostBookings;
