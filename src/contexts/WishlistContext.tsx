import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (propertyId: string) => boolean;
  toggleWishlist: (propertyId: string) => void;
  clearWishlist: () => void;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from database for authenticated users or localStorage for guests
  useEffect(() => {
    if (user) {
      loadWishlistFromDB();
    } else {
      loadWishlistFromLocalStorage();
    }
  }, [user]);

  const loadWishlistFromDB = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wishlists' as any)
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setWishlist((data as any)?.map((item: any) => item.property_id) || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const loadWishlistFromLocalStorage = () => {
    const savedWishlist = localStorage.getItem('wishlist_guest');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  };

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist_guest', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const isInWishlist = (propertyId: string) => {
    return wishlist.includes(propertyId);
  };

  const toggleWishlist = async (propertyId: string) => {
    if (!user) {
      // Guest mode - use localStorage
      setWishlist(prev => {
        if (prev.includes(propertyId)) {
          return prev.filter(id => id !== propertyId);
        } else {
          return [...prev, propertyId];
        }
      });
      return;
    }

    // Authenticated user - sync with database
    try {
      if (wishlist.includes(propertyId)) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists' as any)
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;

        setWishlist(prev => prev.filter(id => id !== propertyId));
        toast({
          title: 'Removed from wishlist',
          description: 'Property removed from your wishlist',
        });
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists' as any)
          .insert({
            user_id: user.id,
            property_id: propertyId,
          });

        if (error) throw error;

        setWishlist(prev => [...prev, propertyId]);
        toast({
          title: 'Added to wishlist',
          description: 'Property added to your wishlist',
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to update wishlist',
        variant: 'destructive',
      });
    }
  };

  const clearWishlist = async () => {
    if (user) {
      try {
        await supabase
          .from('wishlists' as any)
          .delete()
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    }
    setWishlist([]);
  };

  const refreshWishlist = () => {
    if (user) {
      loadWishlistFromDB();
    } else {
      loadWishlistFromLocalStorage();
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, clearWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
