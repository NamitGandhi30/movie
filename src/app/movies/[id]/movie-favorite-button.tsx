"use client";

import { FavoriteButton } from "@/components/favorite-button";
import type { Movie } from "@/lib/tmdb";

interface MovieFavoriteButtonProps {
  movie: Movie;
}

export function MovieFavoriteButton({ movie }: MovieFavoriteButtonProps) {
  return <FavoriteButton movie={movie} />;
} 