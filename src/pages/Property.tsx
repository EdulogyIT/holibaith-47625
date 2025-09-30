import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingMapButton from "@/components/FloatingMapButton";
import MobileFooter from "@/components/MobileFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Bed, Bath, Square, Phone, Mail, Calendar, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import MapboxMap from "@/components/MapboxMap";
import PropertyDatePicker from "@/components/PropertyDatePicker";
import { PaymentButton } from "@/components/PaymentButton";
import { BookingModal } from "@/components/BookingModal";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import ScheduleVisitModal from "@/components/ScheduleVisitModal";
import MessageOwnerModal from "@/components/MessageOwnerModal";
import { cn } from "@/lib/utils";

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  district?: string;
  full_address?: string;
  price: string;
  price_type: string;
  category: string;
  bedrooms?: string;
  bathrooms?: string;
  area: string;
  images: string[];
  property_type: string;
  features?: any;
  description?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  created_at: string;
  user_id?: string;
}

const Property = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const isMobile = useIsMobile();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  useScrollToTop();

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching property:', error);
        setError('Property not found');
        return;
      }

      if (!data) {
        setError('Property not found');
        return;
      }

      // Check if user owns this property to show contact info
      const { data: { user } } = await supabase.auth.getUser();
      const isOwner = user && user.id === data.user_id;
      
      // For security, only show contact info if user owns the property
      if (!isOwner) {
        setProperty({
          ...data,
          contact_name: undefined,
          contact_email: undefined,
          contact_phone: undefined
        });
      } else {
        setProperty(data);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to load property');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove the old formatPrice function as we now use useCurrency hook

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {isMobile ? <MobileHeader /> : <Navigation />}
        <main className={cn(isMobile ? "pt-16" : "pt-20")}>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">{t('loading')}</span>
          </div>
        </main>
        {isMobile ? <MobileBottomNav /> : <Footer />}
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background">
        {isMobile ? <MobileHeader /> : <Navigation />}
        <main className={cn(isMobile ? "pt-16" : "pt-20")}>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">{t('propertyNotFound') || 'Property not found'}</h1>
            <p className="text-muted-foreground">{error || 'The requested property could not be found.'}</p>
          </div>
        </main>
        {isMobile ? <MobileBottomNav /> : <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      <main className={cn(isMobile ? "pt-16 pb-24" : "pt-20 pb-8")}>
        {isMobile ? (
          // Mobile App Layout
          <div className="space-y-4">
            {/* Property Images Gallery - Full Width */}
            <div className="space-y-2">
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img 
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 px-4">
                {property.images.slice(1, 4).map((image, index) => (
                  <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${property.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Info - Compact */}
            <div className="px-4 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h1 className="text-xl font-bold font-playfair mb-1">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="font-inter">{property.city}, {property.location}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-1 font-inter shrink-0">
                  {t(property.property_type) || property.property_type}
                </Badge>
              </div>
              
              <div className="text-2xl font-bold text-primary font-playfair">
                {formatPrice(property.price, property.price_type)}
              </div>

              {/* Property Stats */}
              <div className="flex items-center gap-4 py-3 px-4 bg-muted/50 rounded-lg">
                {property.bedrooms && (
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold">{property.bedrooms}</div>
                      <div className="text-[10px] text-muted-foreground">{t('chambers')}</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-primary" />
                    <div>
                      <div className="text-xs font-semibold">{property.bathrooms}</div>
                      <div className="text-[10px] text-muted-foreground">{t('bathrooms')}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Square className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-xs font-semibold">{property.area} m²</div>
                    <div className="text-[10px] text-muted-foreground">{t('areaField')}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-base font-semibold font-playfair">{t('description')}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-inter">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              {property.features && Object.keys(property.features).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-semibold font-playfair">{t('characteristics')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(property.features).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex items-center gap-2 p-2.5 bg-muted/50 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span className="text-xs font-inter">{t(key) || key}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {property.category === 'short-stay' ? (
                <div className="space-y-3 pt-2">
                  <PropertyDatePicker 
                    onDateChange={(dates) => console.log("Selected dates:", dates)}
                  />
                  <BookingModal 
                    property={{
                      id: property.id,
                      title: property.title,
                      price: property.price,
                      price_type: property.price_type,
                      category: property.category
                    }}
                  />
                </div>
              ) : property.category === 'sale' ? (
                <div className="space-y-2 pt-2">
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-elegant"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('scheduleVisit')}
                  </Button>
                  {(() => {
                    const propertyPrice = parseFloat(property.price.replace(/[^0-9.-]+/g,"")) || 0;
                    const earnestMoneyAmount = Math.round(propertyPrice * 0.05 * 100) / 100;
                    return (
                      <PaymentButton
                        propertyId={property.id}
                        paymentType="earnest_money"
                        amount={earnestMoneyAmount}
                        currency="EUR"
                        description={`Earnest money for ${property.title}`}
                        className="w-full"
                      >
                        {t('payEarnestMoney')} ({formatPrice(earnestMoneyAmount)})
                      </PaymentButton>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-elegant"
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('scheduleVisit')}
                  </Button>
                  {(() => {
                    const propertyPrice = parseFloat(property.price.replace(/[^0-9.-]+/g,"")) || 0;
                    const securityDepositAmount = Math.round(propertyPrice * 0.2 * 100) / 100;
                    return (
                      <PaymentButton
                        propertyId={property.id}
                        paymentType="security_deposit"
                        amount={securityDepositAmount}
                        currency="EUR"
                        description={`Security deposit for ${property.title}`}
                        className="w-full"
                      >
                        {t('paySecurityDeposit')} ({formatPrice(securityDepositAmount)})
                      </PaymentButton>
                    );
                  })()}
                </div>
              )}

              {/* Contact Owner */}
              <div className="space-y-2 pt-2">
                <h3 className="text-base font-semibold font-playfair flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {t('contactOwner')}
                </h3>
                {property.contact_name ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 font-inter">{property.contact_name}</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center text-xs text-muted-foreground font-inter">
                          <Phone className="w-3.5 h-3.5 mr-1.5" />
                          {property.contact_phone}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground font-inter">
                          <Mail className="w-3.5 h-3.5 mr-1.5" />
                          {property.contact_email}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="bg-gradient-primary hover:shadow-elegant font-inter">
                        <Phone className="w-4 h-4 mr-1" />
                        {t('callBtn')}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="font-inter"
                        onClick={() => setIsMessageModalOpen(true)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        {t('sendMessageBtn')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-inter">
                      {t('secureContactDescription')}
                    </p>
                    <Button 
                      className="w-full bg-gradient-primary hover:shadow-elegant font-inter"
                      onClick={() => setIsMessageModalOpen(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      {t('contactOwnerSecure')}
                    </Button>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="space-y-2 pt-2 pb-4">
                <h3 className="text-base font-semibold font-playfair">{t('listingDetails')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-inter">{t('reference')}</span>
                    <span className="font-medium font-inter">BK-{property.id}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-inter">{t('typeField')}</span>
                    <span className="font-medium font-inter">{t(property.property_type) || property.property_type}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground font-inter">{t('publishedOn')}</span>
                    <span className="font-medium font-inter">{formatDate(property.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <MapboxMap 
                location={`${property.city}, ${property.location}`}
                address={property.full_address || `${property.city}, ${property.location}`}
              />
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Property Images Gallery */}
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid md:grid-cols-4 gap-4">
                    {property.images.slice(1).map((image, index) => (
                      <div key={index} className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                        <img 
                          src={image} 
                          alt={`${property.title} ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Info */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-3xl font-playfair mb-2">{property.title}</CardTitle>
                        <div className="flex items-center text-muted-foreground mb-2">
                          <MapPin className="w-5 h-5 mr-2" />
                          <span className="text-lg font-inter">{property.city}, {property.location}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1 font-inter">{t(property.property_type) || property.property_type}</Badge>
                    </div>
                    <div className="text-4xl font-bold text-primary font-playfair">{formatPrice(property.price, property.price_type)}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center bg-muted/50 rounded-lg p-4 mb-6">
                      {property.bedrooms && (
                        <>
                          <div className="flex items-center text-center">
                            <Bed className="w-6 h-6 mr-2 text-primary" />
                            <div>
                              <div className="font-semibold font-inter">{property.bedrooms}</div>
                              <div className="text-sm text-muted-foreground font-inter">{t('chambers')}</div>
                            </div>
                          </div>
                          <Separator orientation="vertical" className="h-12" />
                        </>
                      )}
                      {property.bathrooms && (
                        <>
                          <div className="flex items-center text-center">
                            <Bath className="w-6 h-6 mr-2 text-primary" />
                            <div>
                              <div className="font-semibold font-inter">{property.bathrooms}</div>
                              <div className="text-sm text-muted-foreground font-inter">{t('bathrooms')}</div>
                            </div>
                          </div>
                          <Separator orientation="vertical" className="h-12" />
                        </>
                      )}
                      <div className="flex items-center text-center">
                        <Square className="w-6 h-6 mr-2 text-primary" />
                        <div>
                          <div className="font-semibold font-inter">{property.area} m²</div>
                          <div className="text-sm text-muted-foreground font-inter">{t('areaField')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold font-playfair">{t('description')}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed font-inter">{property.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-playfair">{t('characteristics')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features && Object.entries(property.features).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex items-center p-3 bg-muted/50 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                            <span className="text-sm font-inter">{t(key) || key}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* Map */}
                <MapboxMap 
                  location={`${property.city}, ${property.location}`}
                  address={property.full_address || `${property.city}, ${property.location}`}
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Booking/Visit Section */}
                {property.category === 'short-stay' ? (
                  <div className="space-y-4">
                    <PropertyDatePicker 
                      onDateChange={(dates) => console.log("Selected dates:", dates)}
                    />
                    <Card>
                      <CardContent className="pt-6">
                        <BookingModal 
                          property={{
                            id: property.id,
                            title: property.title,
                            price: property.price,
                            price_type: property.price_type,
                            category: property.category
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                ) : property.category === 'sale' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-playfair">
                        {t('purchaseProperty')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t('purchaseDescription')}
                      </p>
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-gradient-primary hover:shadow-elegant"
                          onClick={() => setIsScheduleModalOpen(true)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {t('scheduleVisit')}
                        </Button>
                        {(() => {
                          const propertyPrice = parseFloat(property.price.replace(/[^0-9.-]+/g,"")) || 0;
                          const earnestMoneyAmount = Math.round(propertyPrice * 0.05 * 100) / 100;
                          
                          return (
                            <PaymentButton
                              propertyId={property.id}
                              paymentType="earnest_money"
                              amount={earnestMoneyAmount}
                              currency="EUR"
                              description={`Earnest money for ${property.title}`}
                              className="w-full"
                            >
                              {t('payEarnestMoney')} ({formatPrice(earnestMoneyAmount)})
                            </PaymentButton>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-playfair">
                        {t('scheduleVisit')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {t('scheduleVisitDescription')}
                      </p>
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-gradient-primary hover:shadow-elegant"
                          onClick={() => setIsScheduleModalOpen(true)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          {t('scheduleVisit')}
                        </Button>
                        {(() => {
                          const propertyPrice = parseFloat(property.price.replace(/[^0-9.-]+/g,"")) || 0;
                          const securityDepositAmount = Math.round(propertyPrice * 0.2 * 100) / 100;
                          
                          return (
                            <PaymentButton
                              propertyId={property.id}
                              paymentType="security_deposit"
                              amount={securityDepositAmount}
                              currency="EUR"
                              description={`Security deposit for ${property.title}`}
                              className="w-full"
                            >
                              {t('paySecurityDeposit')} ({formatPrice(securityDepositAmount)})
                            </PaymentButton>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Owner */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-playfair">
                      <User className="w-5 h-5 mr-2" />
                      {t('contactOwner')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {property.contact_name ? (
                      <>
                        <div>
                          <h4 className="font-semibold mb-2 font-inter">{property.contact_name}</h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground font-inter">
                              <Phone className="w-4 h-4 mr-2" />
                              {property.contact_phone}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground font-inter">
                              <Mail className="w-4 h-4 mr-2" />
                              {property.contact_email}
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                          <Button className="w-full bg-gradient-primary hover:shadow-elegant font-inter">
                            <Phone className="w-4 h-4 mr-2" />
                            {t('callBtn')}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full font-inter"
                            onClick={() => setIsMessageModalOpen(true)}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            {t('sendMessageBtn')}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground font-inter">
                          {t('secureContactDescription')}
                        </p>
                        <Button 
                          className="w-full bg-gradient-primary hover:shadow-elegant font-inter"
                          onClick={() => setIsMessageModalOpen(true)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {t('contactOwnerSecure')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl font-playfair">{t('listingDetails')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-inter">{t('reference')}</span>
                      <span className="font-medium font-inter">BK-{property.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-inter">{t('typeField')}</span>
                      <span className="font-medium font-inter">{t(property.property_type) || property.property_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-inter">{t('publishedOn')}</span>
                      <span className="font-medium font-inter">{formatDate(property.created_at)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center text-sm text-muted-foreground font-inter">
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('lastUpdated')}: {t('daysAgo')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Modals */}
      {property && (
        <>
          <ScheduleVisitModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
            propertyTitle={property.title}
          />
          <MessageOwnerModal
            isOpen={isMessageModalOpen}
            onClose={() => setIsMessageModalOpen(false)}
            ownerName={property.contact_name || 'Property Owner'}
            ownerEmail={property.contact_email || ''}
            propertyTitle={property.title}
            propertyId={property.id}
            isSecureMode={!property.contact_name}
          />
        </>
      )}
      
      {isMobile ? (
        <>
          <MobileBottomNav />
          <FloatingMapButton />
        </>
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default Property;