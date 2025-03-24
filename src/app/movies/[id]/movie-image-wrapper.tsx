"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/lib/tmdb";

interface MovieImageWrapperProps {
  movie: Movie;
  imagePath: string | null;
  imageSize?: string;
}

export function MovieImageWrapper({ movie, imagePath, imageSize = "w500" }: MovieImageWrapperProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
      {!imageLoaded && !imageError && (
        <Skeleton className="absolute inset-0" />
      )}
      
      {!imageError ? (
        <Image
          src={getImageUrl(imagePath, imageSize)}
          alt={movie.title}
          fill
          className="object-cover"
          priority
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
          style={{ 
            opacity: imageLoaded ? 1 : 0
          }}
          unoptimized={true}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted">
          <span className="text-center px-4 text-muted-foreground">{movie.title}</span>
        </div>
      )}
    </div>
  );
} 