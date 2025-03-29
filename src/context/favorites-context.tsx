"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import type { Movie } from "@/lib/tmdb";

interface FavoritesContextType {
  favorites: number[];
  isLoading: boolean;
  addFavorite: (movie: Movie) => Promise<boolean>;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, requireAuth, updateFavorites } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Load favorites from user object when user changes
  useEffect(() => {
    const loadFavorites = () => {
      if (user && user.favorites) {
        setFavorites(user.favorites);
      } else {
        setFavorites([]);
      }
      setIsLoading(false);
    };

    loadFavorites();
  }, [user]);

  // Sync favorites with the auth context when they change locally
  const syncFavoritesToUser = async (newFavorites: number[]) => {
    if (user) {
      // Update favorites in user context
      await updateFavorites(newFavorites);
    }
  };

  const addFavorite = async (movie: Movie) => {
    // Check if user is authenticated
    const isAuthenticated = await requireAuth();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add movies to your favorites",
        variant: "destructive",
      });
      return false;
    }

    if (!isFavorite(movie.id)) {
      const newFavorites = [...favorites, movie.id];
      setFavorites(newFavorites);
      
      // Sync with user context
      await syncFavoritesToUser(newFavorites);
      
      toast({
        title: "Added to Favorites",
        description: `${movie.title} has been added to your favorites`,
      });
    }
    return true;
  };

  const removeFavorite = (movieId: number) => {
    const newFavorites = favorites.filter((id) => id !== movieId);
    setFavorites(newFavorites);
    
    // Sync with user context
    syncFavoritesToUser(newFavorites);
    
    toast({
      title: "Removed from Favorites",
      description: "Movie has been removed from your favorites",
    });
  };

  const isFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isLoading, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
} 