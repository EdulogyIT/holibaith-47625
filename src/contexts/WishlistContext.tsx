import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (propertyId: string) => boolean;
  toggleWishlist: (propertyId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
    const savedWishlist = localStorage.getItem(storageKey);
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';
    localStorage.setItem(storageKey, JSON.stringify(wishlist));
  }, [wishlist, user]);

  const isInWishlist = (propertyId: string) => {
    return wishlist.includes(propertyId);
  };

  const toggleWishlist = (propertyId: string) => {
    setWishlist(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, clearWishlist }}>
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
