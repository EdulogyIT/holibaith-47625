import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import propertyLuxury from "@/assets/property-luxury-apartment.jpg";
import propertyModern from "@/assets/property-modern-apartment.jpg";

const FeaturedListings = () => {
  const navigate = useNavigate();

  const listings = [
    {
      id: 1,
      image: propertyLuxury,
      badge: "New",
      verified: true,
      title: "Luxury Apartment",
      location: "Alger Centre",
      price: "45,000,000 DZD",
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
      price: "65,000,000 DZD",
      beds: 4,
      baths: 3,
    },
  ];

  return (
    <section className="px-4 py-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Featured listings</h2>
        <button className="text-primary font-medium text-sm">See all</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {listings.map((listing) => (
          <div
            key={listing.id}
            onClick={() => navigate(`/property/${listing.id}`)}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border cursor-pointer min-w-[280px] flex-shrink-0"
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
                className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {listing.location}
              </div>
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg">{listing.price}</div>
                <div className="text-sm text-muted-foreground">
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
