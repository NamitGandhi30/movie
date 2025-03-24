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


import { FavoriteButton } from "@/components/favorite-button";
import { MovieImageWrapper } from "./movie-image-wrapper";
import { MovieTrailer } from "./movie-trailer";
import { SimilarMoviesSection } from "./similar-movies-section";

interface MovieDetailsPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: MovieDetailsPageProps) {
  const movieId = Number(params.id);
  const movie: MovieDetails = await getMovieDetails(movieId);
  
  return {
    title: `${movie.title} | Movie Explorer`,
    description: movie.overview.substring(0, 160) + (movie.overview.length > 160 ? '...' : ''),
  };
}

export default async function MovieDetailsPage({
  params,
}: MovieDetailsPageProps) {
  const movieId = Number(params.id);
  const movie: MovieDetails = await getMovieDetails(movieId);

  // Create backdrop URL
  const backdropUrl = movie.backdrop_path 
    ? getImageUrl(movie.backdrop_path, "original") 
    : null;

    return (
      <>
        {/* Hero backdrop with animation */}
        {backdropUrl && (
          <div className="relative w-full h-[40vh] lg:h-[50vh] -mt-16 mb-8 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/5 z-10"></div>
            <div 
              className="absolute inset-0 bg-cover bg-center animate-scale"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            ></div>
          </div>
        )}

        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 lg:w-1/4 md:-mt-32 lg:-mt-40 relative z-20 animate-fade-up">
              <div className="rounded-lg overflow-hidden shadow-2xl hover-lift transition-transform-300">
                <MovieImageWrapper 
                  movie={movie} 
                  imagePath={movie.poster_path} 
                  imageSize="w500" 
                />
              </div>
            </div>

          <div className="md:w-2/3 lg:w-3/4 space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold animate-fade-up">{movie.title}</h1>
            
            {movie.tagline && (
              <p className="text-lg italic text-muted-foreground animate-fade-up animate-stagger-1">"{movie.tagline}"</p>
            )}
            
            <div className="flex flex-wrap gap-2 animate-fade-up animate-stagger-1">
              {movie.genres.map((genre: { id: number; name: string }, index) => (
                <span 
                  key={genre.id} 
                  className={`px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm transition-all-300 hover:bg-primary hover:text-primary-foreground animate-fade-up animate-stagger-${index % 5 + 1}`}
                >
                  {genre.name}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-6 text-sm animate-fade-up animate-stagger-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg animate-pulse-soft">★</span> 
                <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                <span className="text-muted-foreground">({movie.vote_count})</span>
              </div>
              <div className="flex items-center gap-4">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              </div>
            </div>
            
            <div className="pt-2 animate-fade-up animate-stagger-3">
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
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