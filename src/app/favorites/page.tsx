"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useFavorites } from "@/context/favorites-context";
import { Button } from "@/components/ui/button";
import { getMovieDetails, getImageUrl } from "@/lib/tmdb";
import { HeartIcon, Loader2Icon } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { useToast } from "@/components/ui/use-toast";
import type { Movie } from "@/lib/tmdb";

export default function FavoritesPage() {
  const { user, requireAuth } = useAuth();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await requireAuth();
      if (!isAuthenticated) return;
      setIsLoading(false);
    };

    checkAuth();
  }, [requireAuth]);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      if (!user || favoritesLoading || favorites.length === 0) {
        setFavoriteMovies([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const moviePromises = favorites.map((id) => getMovieDetails(id));
        const movies = await Promise.all(moviePromises);
        setFavoriteMovies(movies);
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
        toast({
          title: "Error",
          description: "Failed to load your favorite movies",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [favorites, favoritesLoading, user, toast]);

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center items-center min-h-[70vh]">
        <Loader2Icon className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8 mb-8">
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
            <HeartIcon className="h-6 w-6 text-red-500" />
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            Your collection of favorite movies
          </p>
        </div>
      </div>

      {favoriteMovies.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center rounded-lg border bg-muted/30">
          <HeartIcon className="h-16 w-16 mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-medium mb-2">No favorites yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Add movies to your favorites to keep track of the films you love.
          </p>
          <Button onClick={() => router.push("/movies")}>
            Browse Movies
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="group relative overflow-hidden rounded-lg border bg-background hover:shadow-md transition-all"
            >
              <div 
                className="absolute top-2 right-2 z-10" 
                onClick={(e) => e.stopPropagation()}
              >
                <FavoriteButton movie={movie} variant="icon" />
              </div>
              <div 
                className="cursor-pointer"
                onClick={() => router.push(`/movies/${movie.id}`)}
              >
                <div className="aspect-[2/3] overflow-hidden">
                  <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium leading-tight line-clamp-1">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}