"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollableListSkeleton } from "@/components/ui/scrollable-list-skeleton";
import type { Movie } from "@/lib/tmdb";

interface ScrollableMovieListProps {
  movies: Movie[] | undefined;
  title: string;
  id?: string;
  isLoading?: boolean;
}

export function ScrollableMovieList({ 
  movies, 
  title, 
  id = `movie-list-${title.toLowerCase().replace(/\s+/g, '-')}`,
  isLoading = false
}: ScrollableMovieListProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentFocus, setCurrentFocus] = useState(-1);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after the component is mounted to handle client-side only rendering
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // If loading or no movies, show skeleton
  if (isLoading || !movies || movies.length === 0) {
    return <ScrollableListSkeleton showTitle={true} count={6} />;
  }

  // Check if we're at the edges to show/hide arrows
  const checkScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  }, []);

  // Initialize and set up scroll event listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && isMounted) {
      // Only add event listeners after the component is mounted
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Check initially

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [checkScrollPosition, isMounted]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const container = scrollContainerRef.current;
    if (!container || !container.contains(document.activeElement)) return;

    // Handle arrow keys for navigation within the list
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToRight();
      
      if (currentFocus < movies.length - 1) {
        setCurrentFocus(prev => prev + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToLeft();
      
      if (currentFocus > 0) {
        setCurrentFocus(prev => prev - 1);
      }
    }
  }, [currentFocus, movies.length]);

  // Set up keyboard event listeners
  useEffect(() => {
    if (isMounted) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isMounted]);

  // Scroll handler functions
  const scrollToLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
    }
  };

  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
    }
  };

  // Mouse drag handlers for touch-like scrolling with mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="relative py-4 mb-6" aria-labelledby={`${id}-heading`}>
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 id={`${id}-heading`} className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-950 to-neutral-600 dark:from-white dark:to-neutral-400">
          {title}
        </h2>
        {isMounted && (
          <div className="flex gap-2">
            <Button
              onClick={scrollToLeft}
              variant="outline"
              size="icon"
              className={`rounded-full transition-opacity bg-neutral-100 dark:bg-neutral-800 border-0 hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
                showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scroll left"
              aria-controls={id}
            >
              {isMounted && <ChevronLeft className="h-4 w-4" />}
            </Button>
            <Button
              onClick={scrollToRight}
              variant="outline"
              size="icon"
              className={`rounded-full transition-opacity bg-neutral-100 dark:bg-neutral-800 border-0 hover:bg-neutral-200 dark:hover:bg-neutral-700 ${
                showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-label="Scroll right"
              aria-controls={id}
            >
              {isMounted && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>
      
      <div 
        id={id}
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-5 pb-6 pt-1 snap-x snap-mandatory no-scrollbar pl-1"
        onScroll={checkScrollPosition}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        role="region"
        aria-label={`Scrollable list of ${title}`}
        tabIndex={0}
      >
        {movies.map((movie, index) => (
          <div 
            key={movie.id} 
            className="min-w-[160px] w-[160px] md:min-w-[180px] md:w-[180px] lg:min-w-[200px] lg:w-[200px] flex-shrink-0 snap-start transition-transform hover:scale-[1.03] h-full"
            tabIndex={-1}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
} 