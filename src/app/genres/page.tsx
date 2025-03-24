"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getGenres, getMoviesByGenre } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import { GenreFilter } from "@/components/genre-filter";
import { SortSelector, SORT_OPTIONS } from "@/components/sort-selector";
import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";
import type { Genre, Movie } from "@/lib/tmdb";

export default function GenresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genreParam = searchParams.get("id");
  const pageParam = searchParams.get("page") || "1";
  const sortParam = searchParams.get("sort") || "popularity.desc";

  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(
    genreParam ? parseInt(genreParam, 10) : null
  );
  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(parseInt(pageParam, 10));
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState(sortParam);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [selectedGenreName, setSelectedGenreName] = useState<string>("All Genres");

  // Load genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);
        const data = await getGenres();
        setGenres(data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    fetchGenres();
  }, []);

  // Load movies based on selected genre
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoadingMovies(true);
        
        let data;
        if (selectedGenreId) {
          data = await getMoviesByGenre(selectedGenreId, page, sortBy);
          
          // Find the genre name
          const genre = genres.find(g => g.id === selectedGenreId);
          if (genre) {
            setSelectedGenreName(genre.name);
          }
        } else {
          // When no genre is selected, use popular movies
          data = await getMoviesByGenre(28, page, sortBy); // Default to action genre
          setSelectedGenreName("All Genres");
        }
        
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDB API limits to 500 pages
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    };

    if (genres.length > 0 || !loadingGenres) {
      fetchMovies();
    }
  }, [selectedGenreId, page, sortBy, genres, loadingGenres]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedGenreId !== null) {
      params.set("id", selectedGenreId.toString());
    }
    params.set("page", page.toString());
    params.set("sort", sortBy);
    
    const url = `/genres?${params.toString()}`;
    router.push(url, { scroll: false });
  }, [selectedGenreId, page, sortBy, router]);

  const handleGenreSelect = (genreId: number | null) => {
    if (genreId !== null) {
      // Navigate to the dedicated genre page
      router.push(`/genres/${genreId}?sort=${sortBy}`);
    } else {
      setSelectedGenreId(null);
      setPage(1); // Reset to first page on genre change
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const currentSortOption = SORT_OPTIONS.find(option => option.value === sortBy);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Movies by Genre</h1>
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <GenreFilter 
          genres={genres} 
          selectedGenreId={selectedGenreId} 
          onSelectGenre={handleGenreSelect}
          isLoading={loadingGenres}
          className="flex-1"
        />
        
        <SortSelector 
          value={sortBy} 
          onChange={handleSortChange} 
        />
      </div>
      
      <h2 className="text-xl font-medium mb-6">
        {loadingMovies ? (
          <Skeleton className="h-8 w-48" />
        ) : (
          <>
            {selectedGenreName}
            {currentSortOption && (
              <span className="text-muted-foreground font-normal"> • Sorted by {currentSortOption.label}</span>
            )}
          </>
        )}
      </h2>
      
      {loadingMovies ? (
        <MovieGridSkeleton count={20} />
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground mb-4">No movies found for this genre.</p>
          <Button onClick={() => handleGenreSelect(null)}>
            View All Genres
          </Button>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {page > 1 && (
            <Button 
              variant="outline" 
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>
          )}
          <div className="flex items-center gap-2">
            {page > 2 && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(1)}
                >
                  1
                </Button>
                {page > 3 && <span className="text-muted-foreground">...</span>}
              </>
            )}
            
            {page > 1 && (
              <Button 
                variant="outline" 
                onClick={() => handlePageChange(page - 1)}
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
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Button>
            )}
            
            {page < totalPages - 1 && (
              <>
                {page < totalPages - 2 && <span className="text-muted-foreground">...</span>}
                <Button 
                  variant="outline" 
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
          
          {page < totalPages && (
            <Button 
              variant="outline" 
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 