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
  const { user, requireAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Load favorites from localStorage when user changes
  useEffect(() => {
    const loadFavorites = () => {
      if (user) {
        const storedFavorites = localStorage.getItem(`favorites-${user.id}`);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
      setIsLoading(false);
    };

    if (typeof window !== "undefined") {
      loadFavorites();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user, isLoading]);

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
      setFavorites((prev) => [...prev, movie.id]);
      toast({
        title: "Added to Favorites",
        description: `${movie.title} has been added to your favorites`,
      });
    }
    return true;
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== movieId));
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