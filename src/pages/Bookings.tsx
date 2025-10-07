import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingMapButton from "@/components/FloatingMapButton";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, Star, MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";
import { CancelBookingButton } from "@/components/CancelBookingButton";
import { RateStayDialog } from "@/components/RateStayDialog";

interface BookingWithProperty {
  id: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  status: string;
  booking_fee: number;
  security_deposit: number;
  total_amount: number;
  contact_phone?: string;
  special_requests?: string;
  created_at: string;
  properties: {
    id: string;
    title: string;
    images: string[];
    city: string;
    location: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    user_id: string;
  };
}

const Bookings = () => {
  useScrollToTop();
  
  const { user, isAuthenticated } = useAuth();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<BookingWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithProperty | null>(null);

  // Fetch user's bookings with property details
  const fetchBookings = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in_date,
          check_out_date,
          guests_count,
          status,
          booking_fee,
          security_deposit,
          total_amount,
          contact_phone,
          special_requests,
          created_at,
          properties:property_id (
            id,
            title,
            images,
            city,
            location,
            contact_name,
            contact_email,
            contact_phone,
            user_id
          )
        `)
        .eq('user_id', user.id)
        .neq('status', 'cancelled')
        .order('check_in_date', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setBookings(data as BookingWithProperty[] || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
      toast({
        title: "Error",
        description: "Failed to load your bookings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBookings();
    }
  }, [user, isAuthenticated]);

  // Separate bookings into upcoming and past using Algerian timezone
  const algerianTZ = "Africa/Algiers";
  const nowInAlgeria = toZonedTime(new Date(), algerianTZ);
  nowInAlgeria.setHours(0, 0, 0, 0);
  
  const upcomingBookings = bookings.filter(booking => {
    const checkoutDate = toZonedTime(new Date(booking.check_out_date), algerianTZ);
    checkoutDate.setHours(0, 0, 0, 0);
    return checkoutDate > nowInAlgeria && booking.status !== 'completed';
  });
  
  const pastBookings = bookings.filter(booking => {
    const checkoutDate = toZonedTime(new Date(booking.check_out_date), algerianTZ);
    checkoutDate.setHours(0, 0, 0, 0);
    return checkoutDate <= nowInAlgeria || booking.status === 'completed';
  });

  // Update booking status to completed for past bookings that are still confirmed
  useEffect(() => {
    const updateCompletedBookings = async () => {
      const bookingsToComplete = bookings.filter(booking => {
        const checkoutDate = toZonedTime(new Date(booking.check_out_date), algerianTZ);
        checkoutDate.setHours(0, 0, 0, 0);
        return checkoutDate <= nowInAlgeria && booking.status === 'confirmed';
      });

      for (const booking of bookingsToComplete) {
        try {
          await supabase
            .from('bookings')
            .update({ status: 'completed' })
            .eq('id', booking.id);
        } catch (error) {
          console.error('Error updating booking status:', error);
        }
      }

      if (bookingsToComplete.length > 0) {
        fetchBookings();
      }
    };

    if (bookings.length > 0) {
      updateCompletedBookings();
    }
  }, [bookings.length]);

  const handleRateStay = (booking: BookingWithProperty) => {
    setSelectedBooking(booking);
    setRateDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleMessageHost = (hostEmail: string, propertyTitle: string) => {
    const subject = encodeURIComponent(`Inquiry about ${propertyTitle}`);
    const body = encodeURIComponent(`Hello,\n\nI have a question about my booking for ${propertyTitle}.\n\nBest regards`);
    window.open(`mailto:${hostEmail}?subject=${subject}&body=${body}`);
  };

  const handleBookingCancelled = () => {
    // Refresh bookings after cancellation
    fetchBookings();
  };

  const BookingCard = ({ booking, isPast = false }: { booking: BookingWithProperty; isPast?: boolean }) => {
    const property = booking.properties;
    const primaryImage = property?.images?.[0];
    
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex flex-col">
          <div className="w-full">
            {primaryImage ? (
              <img 
                src={primaryImage} 
                alt={property?.title || 'Property'}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-full h-40 bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs">No image available</span>
              </div>
            )}
          </div>
          <div className="p-3">
            <CardHeader className="p-0 mb-2">
              <div className="flex justify-between items-start mb-1">
                <CardTitle className="text-sm font-semibold line-clamp-1">
                  {property?.title || 'Property'}
                </CardTitle>
                <Badge className={`${getStatusColor(booking.status)} text-xs px-1.5 py-0`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </Badge>
              </div>
              <CardDescription className="flex items-center text-muted-foreground text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {property?.city && property?.location ? `${property.city}, ${property.location}` : 'Location not available'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(booking.check_in_date), 'MMM dd')} - {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                {booking.guests_count} {booking.guests_count === 1 ? 'Guest' : 'Guests'}
              </div>

              <div className="text-xs">
                <span className="text-muted-foreground">Host: </span>
                <span className="font-medium">{property?.contact_name || 'N/A'}</span>
              </div>

              <div className="text-xs">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-semibold">{formatPrice(booking.total_amount)}</span>
              </div>

              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex gap-1.5">
                  {!isPast && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => window.open(`/property/${booking.properties.id}`, '_blank')}
                    >
                      View
                    </Button>
                  )}
                  {property?.contact_email && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1 text-xs h-8"
                      onClick={() => handleMessageHost(property.contact_email, property.title)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                  )}
                </div>
                {!isPast && (booking.status === 'confirmed' || booking.status === 'pending') && (
                  <CancelBookingButton
                    bookingId={booking.id}
                    totalAmount={booking.total_amount}
                    onCancelSuccess={handleBookingCancelled}
                  />
                )}
                {isPast && booking.status === 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-8"
                    onClick={() => handleRateStay(booking)}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Rate Stay
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <main className="pt-16 pb-20">
          <div className="px-4 py-8">
            <Card className="text-center py-12">
              <CardContent>
                <h1 className="text-2xl font-bold mb-4">Please log in</h1>
                <p className="text-muted-foreground mb-4">
                  Sign in to view your bookings
                </p>
                <Button onClick={() => window.location.href = '/login'}>
                  Log In
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      <main className="pt-16 pb-20">
        <div className="px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Trips</h1>
            <p className="text-muted-foreground">
              Manage your reservations and past stays
            </p>
          </div>

          {loading ? (
            <Card className="text-center py-12">
              <CardContent>
                <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold mb-2">Loading your bookings...</h3>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold mb-2 text-destructive">Error loading bookings</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={fetchBookings}>Try Again</Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4">
                {upcomingBookings.length > 0 ? (
                  upcomingBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No upcoming trips</h3>
                      <p className="text-muted-foreground mb-4">
                        Ready to start planning your next adventure?
                      </p>
                      <Button onClick={() => window.location.href = '/rent'}>Browse Properties</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4">
                {pastBookings.length > 0 ? (
                  pastBookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} isPast />
                  ))
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No past stays yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Your completed bookings will appear here
                      </p>
                      <Button onClick={() => window.location.href = '/rent'}>Start Exploring</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <MobileBottomNav />
      <FloatingMapButton />
      
      {selectedBooking && (
        <RateStayDialog
          open={rateDialogOpen}
          onOpenChange={setRateDialogOpen}
          bookingId={selectedBooking.id}
          propertyId={selectedBooking.properties.id}
          propertyTitle={selectedBooking.properties.title}
          userId={user?.id || ''}
        />
      )}
    </div>
  );
};

export default Bookings;