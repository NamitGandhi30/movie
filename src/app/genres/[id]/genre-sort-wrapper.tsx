"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMoviesByGenre } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { SortSelector } from "@/components/sort-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";
import Link from "next/link";
import type { Movie } from "@/lib/tmdb";

interface GenreSortWrapperProps {
  genreId: number;
  genreName: string;
  initialPage: number;
  initialSort: string;
}

export function GenreSortWrapper({ 
  genreId, 
  genreName = "Genre",
  initialPage = 1, 
  initialSort = "popularity.desc" 
}: GenreSortWrapperProps) {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState(initialSort);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const SORT_OPTIONS = [
    { label: "Popularity", value: "popularity.desc" },
    { label: "Rating", value: "vote_average.desc" },
    { label: "Release Date (New)", value: "release_date.desc" },
    { label: "Release Date (Old)", value: "release_date.asc" },
    { label: "Title A-Z", value: "original_title.asc" },
    { label: "Title Z-A", value: "original_title.desc" },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getMoviesByGenre(genreId, page, sortBy);
        
        if (data && data.results) {
          setMovies(data.results);
          setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB API limits to 500 pages
        } else {
          throw new Error("Invalid response data");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError(true);
        setMovies([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genreId, page, sortBy]);

  // Update URL when filters change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `/genres/${genreId}?page=${page}&sort=${sortBy}`;
      router.push(url, { scroll: false });
    }
  }, [page, sortBy, genreId, router]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // Reset to first page on sort change
  };

  const currentSortOption = SORT_OPTIONS.find(option => option.value === sortBy);

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{genreName} Movies</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/genres">
            <Button variant="outline" size="sm">
              ← All Genres
            </Button>
          </Link>
        </div>
        <SortSelector 
          value={sortBy} 
          onChange={handleSortChange} 
          options={SORT_OPTIONS}
        />
      </div>
      
      {loading && <MovieGridSkeleton count={20} />}
      
      {error && !loading && (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">Error loading movies. Please try again.</p>
          <Button onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      )}
      
      {!loading && !error && (
        <>
          {currentSortOption && (
            <p className="text-muted-foreground mb-4">
              Sorted by {currentSortOption.label}
            </p>
          )}
          
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground mb-4">No movies found for this genre.</p>
              <Link href="/genres">
                <Button>View All Genres</Button>
              </Link>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
              {page > 1 && (
                <Button 
                  variant="outline" 
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
              )}
              
              <div className="flex items-center gap-2">
                {page > 2 && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(1)}
                    >
                      1
                    </Button>
                    {page > 3 && <span className="text-muted-foreground">...</span>}
                  </>
                )}
                
                {page > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(page - 1)}
                  >
                    {page - 1}
                  </Button>
                )}
                
                <Button 
                  variant="default"
                  disabled
                >
                  {page}
                </Button>
                
                {page < totalPages && (
                  <Button 
                    variant="outline" 
                    onClick={() => setPage(page + 1)}
                  >
                    {page + 1}
                  </Button>
                )}
                
                {page < totalPages - 1 && (
                  <>
                    {page < totalPages - 2 && <span className="text-muted-foreground">...</span>}
                    <Button 
                      variant="outline" 
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              
              {page < totalPages && (
                <Button 
                  variant="outline" 
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 