"use client";

import { getSimilarMovies } from "@/lib/tmdb";
import { ScrollableMovieList } from "@/components/scrollable-movie-list";

interface SimilarMoviesSectionProps {
  movieId: number;
}

export async function SimilarMoviesSection({ movieId }: SimilarMoviesSectionProps) {
  const data = await getSimilarMovies(movieId);
  
  if (!data.results || data.results.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-16">
      <ScrollableMovieList
        title="Similar Movies"
        movies={data.results.slice(0, 12)}
        id={`similar-movies-${movieId}`}
      />
    </div>
  );
} 