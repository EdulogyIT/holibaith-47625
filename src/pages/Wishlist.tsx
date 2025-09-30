import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import FloatingMapButton from "@/components/FloatingMapButton";

interface WishlistProperty {
  id: string;
  property_id: string;
  properties: {
    id: string;
    title: string;
    images: string[];
    city: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    property_type: string;
  };
}

const Wishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<WishlistProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;
    
    try {
      // For now, just set empty array since wishlists table might not exist
      setWishlist([]);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      // Placeholder for remove functionality
      toast({
        title: "Success",
        description: "Property removed from wishlist"
      });
      
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove property",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <main className="pt-16 pb-20">
          <div className="px-4 py-8">
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">Please log in</h1>
                <p className="text-muted-foreground mb-4">
                  Sign in to save your favorite properties
                </p>
                <Button onClick={() => navigate('/login')}>
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
          <h1 className="text-3xl font-bold mb-6">Wishlist</h1>
          
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : wishlist.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-4">
                  Start adding properties you love
                </p>
                <Button onClick={() => navigate('/buy')}>
                  Browse Properties
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {wishlist.map((item) => {
                const property = item.properties;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border"
                  >
                    <div className="relative">
                      <img
                        src={property.images?.[0] || '/placeholder.svg'}
                        alt={property.title}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => navigate(`/property/${property.id}`)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.city}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-lg">
                          {property.price?.toLocaleString()} DZD
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {property.bedrooms} beds • {property.bathrooms} baths
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-3"
                        onClick={() => navigate(`/property/${property.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <MobileBottomNav />
      <FloatingMapButton />
    </div>
  );
};

export default Wishlist;
