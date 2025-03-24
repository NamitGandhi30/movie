"use client";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/context/favorites-context";
import { HeartIcon } from "lucide-react";
import type { Movie } from "@/lib/tmdb";

interface FavoriteButtonProps {
  movie: Movie;
  variant?: "icon" | "default";
  size?: "sm" | "default";
}

export function FavoriteButton({ 
  movie, 
  variant = "default",
  size = "default" 
}: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      await addFavorite(movie);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size={size === "sm" ? "sm" : "icon"}
        onClick={handleToggleFavorite}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        className={`rounded-full ${favorite ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
      >
        <HeartIcon className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} ${favorite ? "fill-current" : ""}`} />
      </Button>
    );
  }

  return (
    <Button
      variant={favorite ? "default" : "outline"}
      size={size}
      onClick={handleToggleFavorite}
      className={favorite ? "bg-red-500 hover:bg-red-600 border-0" : ""}
    >
      <HeartIcon className={`${size === "sm" ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2"} ${favorite ? "fill-current" : ""}`} />
      {favorite ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  );
}