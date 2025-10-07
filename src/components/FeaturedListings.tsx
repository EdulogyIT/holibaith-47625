import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const FeaturedListings = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .or('is_featured.eq.true,is_new.eq.true,is_hot_deal.eq.true,is_verified.eq.true')
          .limit(6)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setListings(data || []);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  if (isLoading) return null;

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
        {listings.map((listing) => {
          const getBadgeText = () => {
            if (listing.is_new) return "New";
            if (listing.is_hot_deal) return "Hot Deal";
            return null;
          };

          const badge = getBadgeText();

          return (
            <div
              key={listing.id}
              onClick={() => navigate(`/property/${listing.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border cursor-pointer w-64 flex-shrink-0"
            >
              <div className="relative">
                <img
                  src={listing.images?.[0] || '/placeholder.svg'}
                  alt={listing.title}
                  className="w-full h-36 object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  {badge && (
                    <Badge className="bg-white text-foreground text-[10px] py-0.5">
                      {badge}
                    </Badge>
                  )}
                  {listing.is_verified && (
                    <Badge variant="secondary" className="text-[10px] py-0.5">Verified</Badge>
                  )}
                  {listing.is_featured && (
                    <Badge className="bg-primary text-white text-[10px] py-0.5">Featured</Badge>
                  )}
                  {listing.features?.guest_favorite && (
                    <Badge className="bg-pink-500 text-white text-[10px] py-0.5">Guest Favorite</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(String(listing.id));
                  }}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full h-8 w-8"
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(String(listing.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-0.5 truncate">{listing.title}</h3>
                <div className="flex items-center text-muted-foreground text-xs mb-1.5">
                  <MapPin className="h-3 w-3 mr-0.5" />
                  {listing.city || listing.location}
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-sm">{formatPrice(Number(listing.price))}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {listing.bedrooms || 0} beds • {listing.bathrooms || 0} baths
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedListings;
