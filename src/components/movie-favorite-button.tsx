"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HeartIcon } from "lucide-react";
import type { Movie } from "@/lib/tmdb";

interface MovieFavoriteButtonProps {
  movie: Movie;
}

export function MovieFavoriteButton({ movie }: MovieFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if movie is in favorites on mount
  useEffect(() => {
    const favorites = getFavorites();
    setIsFavorite(favorites.some(fav => fav.id === movie.id));
  }, [movie.id]);

  // Get favorites from localStorage
  const getFavorites = (): Movie[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const favorites = localStorage.getItem('favorites');
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      return [];
    }
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const favorites = getFavorites();

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(false);
      } else {
        // Add to favorites
        const updatedFavorites = [...favorites, movie];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <Button
      variant={isFavorite ? "default" : "outline"} 
      size="sm"
      className={isFavorite ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <HeartIcon className="w-4 h-4 mr-2" fill={isFavorite ? "white" : "none"} />
      {isFavorite ? "Favorited" : "Add to Favorites"}
    </Button>
  );
} 