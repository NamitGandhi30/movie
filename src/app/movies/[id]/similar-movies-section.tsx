import { getSimilarMovies } from "@/lib/tmdb";
import { SimilarMovies } from "@/components/similar-movies";

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
      <SimilarMovies 
        movies={data.results} 
        title="Similar Movies"
      />
    </div>
  );
} 