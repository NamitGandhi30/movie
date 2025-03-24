"use client";

import { Movie } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface SimilarMoviesProps {
  movies: Movie[];
  title?: string;
  className?: string;
}

export function SimilarMovies({ movies, title = "Similar Movies", className }: SimilarMoviesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollable = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    checkScrollable();
    // Add event listener for resize
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of visible width
      
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      
      // Update buttons state after scroll
      setTimeout(checkScrollable, 500);
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between animate-fade-up">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full transition-opacity-300 hover:scale-105"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full transition-opacity-300 hover:scale-105"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div 
        className="relative overflow-x-auto pb-4 scrollbar-hide animate-fade-up animate-stagger-1" 
        ref={containerRef}
        onScroll={checkScrollable}
      >
        <div className="flex gap-6 min-w-max">
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className={`w-[180px] flex-shrink-0 animate-fade-up animate-stagger-${(index % 5) + 1} hover-lift`}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 