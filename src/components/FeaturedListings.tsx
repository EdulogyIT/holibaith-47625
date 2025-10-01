import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import propertyLuxury from "@/assets/property-luxury-apartment.jpg";
import propertyModern from "@/assets/property-modern-apartment.jpg";

const FeaturedListings = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();

  const listings = [
    {
      id: 1,
      image: propertyLuxury,
      badge: "New",
      verified: true,
      title: "Luxury Apartment",
      location: "Alger Centre",
      price: 45000000, // Store price as number in DZD base
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
      price: 65000000, // Store price as number in DZD base
      beds: 4,
      baths: 3,
    },
  ];

  return (
    <section className="px-4 py-4 bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">{t('featuredListings')}</h2>
        <button 
          onClick={() => navigate('/featured-listings')}
          className="text-primary font-medium text-xs hover:underline"
        >
          {t('seeAll')}
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {listings.map((listing) => (
          <div
            key={listing.id}
            onClick={() => navigate(`/property/${listing.id}`)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer w-64 flex-shrink-0"
          >
            <div className="relative">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-36 object-cover"
              />
              <div className="absolute top-2 left-2 flex gap-1.5">
                <Badge className="bg-white text-foreground text-[10px] py-0.5">
                  {listing.badge}
                </Badge>
                {listing.verified && (
                  <Badge variant="secondary" className="text-[10px] py-0.5">Verified</Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle wishlist toggle
                }}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full h-8 w-8"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm mb-0.5 truncate">{listing.title}</h3>
              <div className="flex items-center text-muted-foreground text-xs mb-1.5">
                <MapPin className="h-3 w-3 mr-0.5" />
                {listing.location}
              </div>
              <div className="flex justify-between items-center">
                <div className="font-bold text-sm">{formatPrice(listing.price)}</div>
                <div className="text-[10px] text-muted-foreground">
                  {listing.beds} beds • {listing.baths} baths
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedListings;
