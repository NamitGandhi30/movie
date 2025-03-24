import { Suspense } from "react";
import { 
  getMovieDetails, 
  getImageUrl, 
  getMovieVideos, 
  getSimilarMovies, 
  type MovieDetails 
} from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";

import { MovieImageWrapper } from "./movie-image-wrapper";
import { MovieTrailer } from "./movie-trailer";
import { SimilarMoviesSection } from "./similar-movies-section";
import { MovieFavoriteButton } from "@/components/movie-favorite-button";

interface MovieDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MovieDetailsPageProps) {
  const movieId = Number(params.id);
  const movie: MovieDetails = await getMovieDetails(movieId);
  
  return {
    title: `${movie.title || 'Movie Details'} | Movie Explorer`,
    description: movie.overview 
      ? movie.overview.substring(0, 160) + (movie.overview.length > 160 ? '...' : '')
      : 'No description available',
  };
}

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const movieId = Number(params.id);
  const movie: MovieDetails = await getMovieDetails(movieId);

  if (!movie || !movie.title) {
    return notFound();
  }

  // Create backdrop URL
  const backdropUrl = movie.backdrop_path 
    ? getImageUrl(movie.backdrop_path, "original") 
    : null;

  // Render movie details page
  return (
    <>
      <div className="container pb-10">
        {/* Header with backdrop */}
        <div 
          className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-6 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10"
          style={{
            background: backdropUrl ? 
              `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${backdropUrl}) no-repeat center/cover` : 
              'linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9))'
          }}
        >
          <div className="absolute inset-0 flex items-center container">
            <Button 
              className="absolute left-4 top-4 sm:left-6 md:left-8"
              variant="outline"
              size="icon"
              asChild
            >
              <a href="/movies">
                <ArrowLeftIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="mx-auto md:mx-0 w-[250px] md:w-auto">
            <MovieImageWrapper 
              path={movie.poster_path}
              title={movie.title}
              priority={true}
            />
          </div>
          
          {/* Details */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold animate-fade-up">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-lg italic text-muted-foreground animate-fade-up animate-stagger-1">"{movie.tagline}"</p>
            )}
            
            <div className="flex flex-wrap gap-2 animate-fade-up animate-stagger-1">
              {movie.genres && movie.genres.length > 0 ? (
                movie.genres.map((genre: { id: number; name: string }, index) => (
                  <span 
                    key={genre.id} 
                    className={`px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm transition-all-300 hover:bg-primary hover:text-primary-foreground animate-fade-up animate-stagger-${index % 5 + 1}`}
                  >
                    {genre.name}
                  </span>
                ))
              ) : (
                <span className="text-muted-foreground">No genres available</span>
              )}
            </div>
            
            <div className="flex items-center gap-6 text-sm animate-fade-up animate-stagger-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg animate-pulse-soft">★</span> 
                <span className="font-medium">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                <span className="text-muted-foreground">({movie.vote_count || 0})</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}</span>
                <span>{movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown'}</span>
              </div>
            </div>
            
            <div className="pt-2 animate-fade-up animate-stagger-3">
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview || "No description available for this movie."}
              </p>
            </div>
            
            <div className="pt-4 flex gap-3 animate-fade-up animate-stagger-4">
              <Suspense fallback={<Button disabled>Loading Trailer...</Button>}>
                <MovieTrailer movieId={movieId} />
              </Suspense>
              <MovieFavoriteButton movie={movie} />
            </div>
          </div>
        </div>
        
        <Suspense fallback={<div className="mt-12"><Skeleton className="h-8 w-48 mb-8" /></div>}>
          <div className="animate-fade-up animate-stagger-5">
            <SimilarMoviesSection movieId={movieId} />
          </div>
        </Suspense>
      </div>
    </>
  );
}