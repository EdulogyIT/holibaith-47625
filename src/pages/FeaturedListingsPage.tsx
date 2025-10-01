import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";
import { Heart, MapPin, Bed, Bath } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import propertyLuxury from "@/assets/property-luxury-apartment.jpg";
import propertyModern from "@/assets/property-modern-apartment.jpg";
import propertyPenthouse from "@/assets/property-penthouse.jpg";
import propertyStudio from "@/assets/property-studio.jpg";
import propertyVilla from "@/assets/property-villa-mediterranean.jpg";
import propertyTraditional from "@/assets/property-traditional-house.jpg";

const FeaturedListingsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { formatPrice } = useCurrency();
  useScrollToTop();

  const listings = [
    {
      id: 1,
      image: propertyLuxury,
      badge: "New",
      verified: true,
      title: "Luxury Apartment",
      location: "Alger Centre",
      price: 45000000,
      beds: 3,
      baths: 2,
    },
    {
      id: 2,
      image: propertyModern,
      badge: "Hot Deal",
      verified: false,
      title: "Modern Penthouse",
      location: "Oran",
      price: 65000000,
      beds: 4,
      baths: 3,
    },
    {
      id: 3,
      image: propertyPenthouse,
      badge: "Featured",
      verified: true,
      title: "Seaside Penthouse",
      location: "Annaba",
      price: 55000000,
      beds: 3,
      baths: 2,
    },
    {
      id: 4,
      image: propertyStudio,
      badge: "New",
      verified: true,
      title: "Modern Studio",
      location: "Constantine",
      price: 28000000,
      beds: 1,
      baths: 1,
    },
    {
      id: 5,
      image: propertyVilla,
      badge: "Exclusive",
      verified: true,
      title: "Mediterranean Villa",
      location: "Tlemcen",
      price: 85000000,
      beds: 5,
      baths: 4,
    },
    {
      id: 6,
      image: propertyTraditional,
      badge: "Featured",
      verified: false,
      title: "Traditional House",
      location: "Béjaïa",
      price: 38000000,
      beds: 4,
      baths: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20 pb-8")}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Featured Listings</h1>
            <p className="text-muted-foreground">Handpicked properties from across Algeria</p>
          </div>

          <div className={cn(
            "grid gap-6",
            isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
          )}>
            {listings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => navigate(`/property/${listing.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-white text-foreground">
                      {listing.badge}
                    </Badge>
                    {listing.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full h-10 w-10"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-xl text-primary">{formatPrice(listing.price)}</div>
                    <div className="flex gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {listing.beds}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {listing.baths}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isMobile ? <MobileBottomNav /> : <Footer />}
    </div>
  );
};

export default FeaturedListingsPage;
