import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";
import { Heart, MapPin, Bed, Bath, Star, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturedListingsPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { formatPrice } = useCurrency();
  const { hasRole } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useScrollToTop();

  const isAdmin = hasRole('admin');

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .or('is_featured.eq.true,is_new.eq.true,is_hot_deal.eq.true,is_verified.eq.true')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePropertyFeature = async (propertyId: string, field: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ [field]: !currentValue })
        .eq('id', propertyId);

      if (error) throw error;

      await fetchFeaturedProperties();
      toast({
        title: "Success",
        description: `Property ${!currentValue ? 'added to' : 'removed from'} ${field.replace('is_', '').replace('_', ' ')}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive"
      });
    }
  };

  const toggleGuestFavorite = async (propertyId: string, currentValue: boolean) => {
    try {
      const { data: property } = await supabase
        .from('properties')
        .select('features')
        .eq('id', propertyId)
        .single();

      const features = (property?.features as any) || {};
      features.guest_favorite = !currentValue;

      const { error } = await supabase
        .from('properties')
        .update({ features })
        .eq('id', propertyId);

      if (error) throw error;

      await fetchFeaturedProperties();
      toast({
        title: "Success",
        description: `Property ${!currentValue ? 'added to' : 'removed from'} guest favorites`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileHeader /> : <Navigation />}
      
      <main className={cn(isMobile ? "pt-14 pb-24" : "pt-20 pb-8")}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t('featuredListings')}</h1>
            <p className="text-muted-foreground">{t('handpickedProperties')}</p>
          </div>

          {loading ? (
            <div className="col-span-full text-center py-12">{t('loading')}</div>
          ) : (
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
                      src={listing.images?.[0] || '/placeholder.svg'}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap max-w-[60%]">
                      {listing.is_new && (
                        <Badge className="bg-white text-foreground text-xs">{t('newBadge')}</Badge>
                      )}
                      {listing.is_hot_deal && (
                        <Badge className="bg-orange-500 text-white text-xs">{t('hotDealBadge')}</Badge>
                      )}
                      {listing.is_verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          {t('verifiedBadge')}
                        </Badge>
                      )}
                      {listing.is_featured && (
                        <Badge className="bg-primary text-white text-xs">{t('featuredBadge')}</Badge>
                      )}
                      {listing.features?.guest_favorite && (
                        <Badge className="bg-pink-500 text-white text-xs">
                          <Heart className="h-3 w-3 mr-1 fill-white" />
                          {t('guestFavoriteBadge')}
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(String(listing.id));
                      }}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full h-10 w-10"
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(String(listing.id)) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                    <div className="flex items-center text-muted-foreground text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {listing.city || listing.location}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-bold text-xl text-primary">{formatPrice(Number(listing.price))}</div>
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {listing.bedrooms || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          {listing.bathrooms || 0}
                        </div>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="pt-3 border-t flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant={listing.is_featured ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePropertyFeature(listing.id, 'is_featured', listing.is_featured);
                          }}
                          className="text-xs"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Button>
                        <Button
                          size="sm"
                          variant={listing.is_hot_deal ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePropertyFeature(listing.id, 'is_hot_deal', listing.is_hot_deal);
                          }}
                          className="text-xs"
                        >
                          Hot Deal
                        </Button>
                        <Button
                          size="sm"
                          variant={listing.is_new ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePropertyFeature(listing.id, 'is_new', listing.is_new);
                          }}
                          className="text-xs"
                        >
                          New
                        </Button>
                        <Button
                          size="sm"
                          variant={listing.features?.guest_favorite ? "default" : "outline"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGuestFavorite(listing.id, listing.features?.guest_favorite);
                          }}
                          className="text-xs"
                        >
                          <Heart className="h-3 w-3 mr-1" />
                          Guest Fav
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {isMobile ? <MobileBottomNav /> : <Footer />}
    </div>
  );
};

export default FeaturedListingsPage;
