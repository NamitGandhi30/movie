"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieImageWrapperProps {
  path: string | null;
  title: string;
  priority?: boolean;
  size?: string;
}

export function MovieImageWrapper({ 
  path, 
  title, 
  priority = false,
  size = "w500"
}: MovieImageWrapperProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const imageUrl = getImageUrl(path, size);
  
  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-muted">
      {loading && !error && (
        <Skeleton className="absolute inset-0" />
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <span className="text-sm">Image not available</span>
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          priority={priority}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
} 