"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useFavorites } from "@/context/favorites-context";
import { Button } from "@/components/ui/button";
import { getMovieDetails, getImageUrl } from "@/lib/tmdb";
import { useToast } from "@/components/ui/use-toast";
import { FavoriteButton } from "@/components/favorite-button";
import { LogOutIcon, Loader2Icon } from "lucide-react";
import type { Movie } from "@/lib/tmdb";

export default function ProfilePage() {
  const { user, logout, requireAuth } = useAuth();
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

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

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
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account and preferences
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0" 
            onClick={handleLogout}
          >
            <LogOutIcon className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center">
              <span className="text-muted-foreground">Name</span>
              <span className="col-span-2 font-medium">{user.name}</span>
            </div>
            <div className="grid grid-cols-3 items-center">
              <span className="text-muted-foreground">Email</span>
              <span className="col-span-2 font-medium">{user.email}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">My Favorites</h2>
          {favoriteMovies.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground mb-4">You haven't added any favorites yet</p>
              <Button onClick={() => router.push("/movies")}>
                Browse Movies
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
} 