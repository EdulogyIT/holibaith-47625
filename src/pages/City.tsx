import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingMapButton from "@/components/FloatingMapButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Bed, Bath, Square, Clock, Users, Building } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import algerImage from "@/assets/city-alger.jpg";
import oranImage from "@/assets/city-oran.jpg";
import constantineImage from "@/assets/city-constantine.jpg";
import annabaImage from "@/assets/city-annaba.jpg";
import villaMediterranean from "@/assets/property-villa-mediterranean.jpg";
import luxuryApartment from "@/assets/property-luxury-apartment.jpg";
import shortStay from "@/assets/property-short-stay.jpg";
import modernApartment from "@/assets/property-modern-apartment.jpg";
import traditionalHouse from "@/assets/property-traditional-house.jpg";
import { cn } from "@/lib/utils";

const City = () => {
  const navigate = useNavigate();
  const { t, currentLang } = useLanguage();
  const { formatPrice } = useCurrency();
  const { cityId } = useParams();
  const isMobile = useIsMobile();
  const [buyProperties, setBuyProperties] = useState<any[]>([]);
  const [rentProperties, setRentProperties] = useState<any[]>([]);
  const [shortStayProperties, setShortStayProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useScrollToTop();

  // Fetch properties from Supabase when city changes
  useEffect(() => {
    fetchPropertiesByCity();
  }, [cityId]);

  const fetchPropertiesByCity = async () => {
    if (!cityId || !currentCity) return;
    
    setIsLoading(true);
    try {
      // Fetch buy properties
      const { data: buyData } = await supabase
        .from('properties')
        .select('*')
        .eq('category', 'buy')
        .eq('status', 'active')
        .ilike('city', `%${currentCity.name}%`)
        .order('created_at', { ascending: false });
      
      // Fetch rent properties
      const { data: rentData } = await supabase
        .from('properties')
        .select('*')
        .eq('category', 'rent')
        .eq('status', 'active')
        .ilike('city', `%${currentCity.name}%`)
        .order('created_at', { ascending: false });
      
      // Fetch short stay properties
      const { data: shortStayData } = await supabase
        .from('properties')
        .select('*')
        .eq('category', 'short-stay')
        .eq('status', 'active')
        .ilike('city', `%${currentCity.name}%`)
        .order('created_at', { ascending: false });

      setBuyProperties(buyData || []);
      setRentProperties(rentData || []);
      setShortStayProperties(shortStayData || []);
    } catch (error) {
      console.error('Error fetching city properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cityData = {
    alger: {
      name: t('cityAlger'),
      description: t('algerDescription'),
      history: t('algerHistory'),
      stats: {
        population: "3.4M " + t('inhabitantsShort'),
        area: "809 km²",
        founded: t('tenthCentury')
      },
      image: algerImage
    },
    oran: {
      name: t('cityOran'),
      description: t('oranDescription'),
      history: t('oranHistory'),
      stats: {
        population: "1.5M " + t('inhabitantsShort'), 
        area: "2,121 km²",
        founded: "903"
      },
      image: oranImage
    },
    constantine: {
      name: t('cityConstantine'),
      description: t('constantineDescription'),
      history: t('constantineHistory'),
      stats: {
        population: "950k " + t('inhabitantsShort'),
        area: "231 km²", 
        founded: t('thirdMillenniumBC')
      },
      image: constantineImage
    },
    annaba: {
      name: t('cityAnnaba'),
      description: t('annabaDescription'),
      history: t('annabaHistory'),
      stats: {
        population: "640k " + t('inhabitantsShort'),
        area: "1,439 km²",
        founded: t('twelfthCenturyBC')
      },
      image: annabaImage
    }
  };

  const currentCity = cityData[cityId as keyof typeof cityData];

  if (!currentCity) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">{t('cityNotFound')}</h1>
            <Button onClick={() => navigate('/')}>{t('backToHome')}</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  const PropertyCard = ({ property, listingType }: { property: any, listingType: string }) => {
    const priceValue = typeof property.price === 'string' ? parseFloat(property.price) : property.price;
    const priceCurrency = property.price_currency || 'DZD';
    
    return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <div className={cn("bg-muted rounded-t-lg overflow-hidden", isMobile ? "h-32" : "aspect-video")}>
        <img 
          src={property.images?.[0] || '/placeholder.jpg'} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className={cn(isMobile && "p-2 pb-1")}>
        <div className="flex justify-between items-start gap-1">
          <CardTitle className={cn("font-playfair", isMobile ? "text-sm leading-tight" : "text-xl")}>{property.title}</CardTitle>
          <Badge variant="secondary" className={cn("font-inter shrink-0", isMobile && "text-[10px] px-1.5 py-0")}>{property.property_type}</Badge>
        </div>
        <div className="flex items-center text-muted-foreground mt-0.5">
          <MapPin className={cn(isMobile ? "w-3 h-3 mr-0.5" : "w-4 h-4 mr-1")} />
          <span className={cn("font-inter", isMobile ? "text-xs" : "text-sm")}>
            {property.city}{property.city && property.location ? ', ' : ''}{property.location}
          </span>
        </div>
      </CardHeader>
      <CardContent className={cn(isMobile && "p-2 pt-0")}>
        <div className="flex justify-between items-center mb-2">
          <span className={cn("font-bold text-primary font-playfair", isMobile ? "text-base" : "text-2xl")}>
            {formatPrice(priceValue, property.price_type, priceCurrency)}
          </span>
        </div>
        <div className={cn("flex justify-between text-muted-foreground mb-2 font-inter", isMobile ? "text-xs gap-1" : "text-sm")}>
          {property.bedrooms && (
            <div className="flex items-center gap-0.5">
              <Bed className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />
              {property.bedrooms}
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-0.5">
              <Bath className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />
              {property.bathrooms}
            </div>
          )}
          <div className="flex items-center gap-0.5">
            <Square className={cn(isMobile ? "w-3 h-3" : "w-4 h-4")} />
            {property.area} m²
          </div>
        </div>
        <Button 
          className={cn("w-full font-inter flex items-center justify-center", isMobile ? "h-8 text-xs" : "min-h-[44px]")} 
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/property/${property.id}`);
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      <main className={cn(isMobile ? "pt-14 pb-20" : "pt-20")}>
        {/* Hero Section */}
        <div className={cn("relative overflow-hidden", isMobile ? "h-56" : "h-96")}>
          <img 
            src={currentCity.image} 
            alt={currentCity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
          <div className={cn("absolute bottom-0 left-0 right-0", isMobile ? "p-4" : "p-8")}>
            <div className="max-w-7xl mx-auto">
              <h1 className={cn("font-playfair font-bold text-white mb-2", isMobile ? "text-2xl" : "text-4xl md:text-5xl")}>
                {currentCity.name}
              </h1>
              <p className={cn("text-white/90 font-inter font-light max-w-2xl", isMobile ? "text-sm" : "text-xl")}>
                {currentCity.description}
              </p>
            </div>
          </div>
        </div>

        <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", isMobile ? "py-6" : "py-12")}>
          {/* City Stats */}
          <div className={cn("grid grid-cols-3 gap-3 mb-6", isMobile && "gap-2")}>
            <div className={cn("text-center bg-card rounded-xl shadow-sm", isMobile ? "p-3" : "p-6")}>
              <Users className={cn("text-primary mx-auto mb-2", isMobile ? "h-5 w-5" : "h-8 w-8")} />
              <div className={cn("font-bold text-foreground font-playfair mb-1", isMobile ? "text-sm" : "text-2xl")}>
                {currentCity.stats.population}
              </div>
              <div className={cn("text-muted-foreground font-inter", isMobile ? "text-xs" : "text-sm")}>{t('population')}</div>
            </div>
            <div className={cn("text-center bg-card rounded-xl shadow-sm", isMobile ? "p-3" : "p-6")}>
              <Square className={cn("text-accent mx-auto mb-2", isMobile ? "h-5 w-5" : "h-8 w-8")} />
              <div className={cn("font-bold text-foreground font-playfair mb-1", isMobile ? "text-sm" : "text-2xl")}>
                {currentCity.stats.area}
              </div>
              <div className={cn("text-muted-foreground font-inter", isMobile ? "text-xs" : "text-sm")}>{t('cityArea')}</div>
            </div>
            <div className={cn("text-center bg-card rounded-xl shadow-sm", isMobile ? "p-3" : "p-6")}>
              <Clock className={cn("text-foreground mx-auto mb-2", isMobile ? "h-5 w-5" : "h-8 w-8")} />
              <div className={cn("font-bold text-foreground font-playfair mb-1", isMobile ? "text-sm" : "text-2xl")}>
                {currentCity.stats.founded}
              </div>
              <div className={cn("text-muted-foreground font-inter", isMobile ? "text-xs" : "text-sm")}>{t('foundedIn')}</div>
            </div>
          </div>

          {/* History Section */}
          <div className={cn(isMobile ? "mb-6" : "mb-12")}>
            <h2 className={cn("font-playfair font-bold text-foreground mb-3", isMobile ? "text-xl" : "text-3xl")}>
              {t('historyHeritage')}
            </h2>
            <div className={cn("bg-card rounded-xl shadow-sm", isMobile ? "p-4" : "p-8")}>
              <p className={cn("text-muted-foreground font-inter leading-relaxed", isMobile ? "text-sm" : "text-lg")}>
                {currentCity.history}
              </p>
            </div>
          </div>

          {/* Properties Tabs */}
          <div className={cn(isMobile ? "mb-6" : "mb-12")}>
            <h2 className={cn("font-playfair font-bold text-foreground mb-4", isMobile ? "text-xl" : "text-3xl")}>
              {t('propertiesAvailableIn')} {currentCity.name}
            </h2>
            
            <Tabs defaultValue="buy" className="w-full">
              <TabsList className={cn("grid w-full grid-cols-3", isMobile ? "mb-4 h-9" : "mb-8")}>
                <TabsTrigger value="buy" className={cn("font-inter", isMobile && "text-xs px-2")}>
                  <Building className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                  {t('buy')}
                </TabsTrigger>
                <TabsTrigger value="rent" className={cn("font-inter", isMobile && "text-xs px-2")}>
                  <MapPin className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                  {t('rent')}
                </TabsTrigger>
                <TabsTrigger value="shortStay" className={cn("font-inter", isMobile && "text-xs px-2")}>
                  <Bed className={cn(isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2")} />
                  {t('shortStay')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading properties...</p>
                  </div>
                ) : buyProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No properties available for sale in {currentCity.name}</p>
                  </div>
                ) : (
                  <div className={cn("grid gap-4", isMobile ? "grid-cols-2 gap-3" : "md:grid-cols-2 lg:grid-cols-3 gap-6")}>
                    {buyProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} listingType="buy" />
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="font-inter"
                    onClick={() => navigate(`/buy?location=${encodeURIComponent(currentCity.name)}`)}
                  >
                    {t('seeAllForSale')}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="rent" className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading properties...</p>
                  </div>
                ) : rentProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No properties available for rent in {currentCity.name}</p>
                  </div>
                ) : (
                  <div className={cn("grid gap-4", isMobile ? "grid-cols-2 gap-3" : "md:grid-cols-2 lg:grid-cols-3 gap-6")}>
                    {rentProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} listingType="rent" />
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="font-inter"
                    onClick={() => navigate(`/rent?location=${encodeURIComponent(currentCity.name)}`)}
                  >
                    {t('seeAllForRent')}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="shortStay" className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading properties...</p>
                  </div>
                ) : shortStayProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No short stay properties available in {currentCity.name}</p>
                  </div>
                ) : (
                  <div className={cn("grid gap-4", isMobile ? "grid-cols-2 gap-3" : "md:grid-cols-2 lg:grid-cols-3 gap-6")}>
                    {shortStayProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} listingType="shortStay" />
                    ))}
                  </div>
                )}
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="font-inter"
                    onClick={() => navigate(`/short-stay?location=${encodeURIComponent(currentCity.name)}`)}
                  >
                    {t('seeAllShortStay')}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
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

export default City;