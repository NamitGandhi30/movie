"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Genre } from "@/lib/tmdb";

interface GenreFilterProps {
  genres: Genre[];
  selectedGenreId: number | null;
  onSelectGenre: (genreId: number | null) => void;
  className?: string;
  isLoading?: boolean;
}

export function GenreFilter({ 
  genres, 
  selectedGenreId, 
  onSelectGenre, 
  className, 
  isLoading = false 
}: GenreFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const visibleGenres = showAll ? genres : genres.slice(0, 10);

  // Reset expanded state if viewport changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-16 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="flex lg:hidden justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Filter by Genre</h3>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FilterIcon className="w-4 h-4 mr-2" />
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <div className={cn(
        "flex-col gap-2 mb-4 lg:mb-0",
        isExpanded ? "flex" : "hidden lg:flex lg:flex-row lg:flex-wrap"
      )}>
        <Badge 
          variant={selectedGenreId === null ? "active" : "inactive"}
          clickable
          className="mb-1 lg:mb-0"
          onClick={() => onSelectGenre(null)}
        >
          All Genres
        </Badge>
        
        {visibleGenres.map((genre) => (
          <Badge 
            key={genre.id} 
            variant={selectedGenreId === genre.id ? "active" : "inactive"}
            clickable
            className="mb-1 lg:mb-0"
            onClick={() => onSelectGenre(genre.id)}
          >
            {genre.name}
          </Badge>
        ))}
        
        {genres.length > 10 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : `+${genres.length - 10} More`}
          </Button>
        )}
      </div>
    </div>
  );
} 