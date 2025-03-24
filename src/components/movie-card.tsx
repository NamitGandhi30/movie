"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/tmdb";
import { FavoriteButton } from "@/components/favorite-button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/lib/tmdb";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-indigo-500/10 group h-full border-0 rounded-xl bg-gradient-to-t from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 relative">
      {mounted && (
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton movie={movie} variant="icon" size="sm" />
        </div>
      )}
      <Link href={`/movies/${movie.id}`} aria-label={`View details for ${movie.title}`} className="block h-full">
        <div className="aspect-[2/3] relative overflow-hidden w-full rounded-t-lg">
          {!imageLoaded && !imageError && (
            <Skeleton className="absolute inset-0" />
          )}
          
          <Image
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 160px, (max-width: 1200px) 180px, 200px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
            style={{ 
              display: imageError ? 'none' : 'block',
              opacity: imageLoaded ? 1 : 0 
            }}
          />
          
          {imageError && (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-center px-4 text-sm font-medium">{movie.title}</span>
            </div>
          )}
          
          {mounted && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-bold">
                ★ {movie.vote_average.toFixed(1)}
              </div>
            </>
          )}
        </div>
        <CardContent className="p-3 h-[70px] flex flex-col justify-between">
          <h3 className="font-bold line-clamp-1 text-sm sm:text-base">{movie.title}</h3>
          <div className="flex items-center mt-1">
            <span className="text-xs sm:text-sm text-muted-foreground">
              {movie.release_date?.split("-")[0] || "N/A"}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}