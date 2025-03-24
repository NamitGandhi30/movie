import Image from "next/image";
import { getMovieDetails, getImageUrl, type MovieDetails } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { MovieFavoriteButton } from "./movie-favorite-button";
import { MovieImageWrapper } from "./movie-image-wrapper";

export default async function MovieDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const movieId = Number(params.id);
  const movie: MovieDetails = await getMovieDetails(movieId);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4">
          <MovieImageWrapper 
            movie={movie} 
            imagePath={movie.poster_path} 
            imageSize="w500" 
          />
        </div>

        <div className="md:w-2/3 lg:w-3/4 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="text-lg italic text-muted-foreground">"{movie.tagline}"</p>
          )}
          
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre: { id: number; name: string }) => (
              <span 
                key={genre.id} 
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                {genre.name}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
            <span className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span> 
              {movie.vote_average.toFixed(1)}
              <span className="text-muted-foreground ml-1">({movie.vote_count})</span>
            </span>
          </div>
          
          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">{movie.overview}</p>
          </div>
          
          <div className="pt-4">
            <MovieFavoriteButton movie={movie} />
          </div>
        </div>
      </div>
    </div>
  );
}