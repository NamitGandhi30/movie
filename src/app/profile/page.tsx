"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useFavorites } from "@/context/favorites-context";
import { Button } from "@/components/ui/button";
import { getMovieDetails, getImageUrl } from "@/lib/tmdb";
import { useToast } from "@/components/ui/use-toast";
import { FavoriteButton } from "@/components/favorite-button";
import { LogOutIcon, Loader2Icon, Edit2Icon, SaveIcon, XIcon } from "lucide-react";
import type { Movie } from "@/lib/tmdb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { user, logout, requireAuth, updateUserData } = useAuth();
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
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

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

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

  const validateForm = () => {
    const newErrors: { name?: string; email?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      const success = await updateUserData({
        name: formData.name,
        email: formData.email
      });
      
      if (success) {
        setIsEditing(false);
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully",
        });
      } else {
        toast({
          title: "Update failed",
          description: "Failed to update your profile information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cancelEdit = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
    setErrors({});
    setIsEditing(false);
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Account Information</h2>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                <Edit2Icon className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={cancelEdit}
                >
                  <XIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <SaveIcon className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-4 bg-card rounded-lg p-6 border">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">{errors.email}</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground">Name</span>
                  <span className="col-span-2 font-medium">{user.name}</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground">Email</span>
                  <span className="col-span-2 font-medium">{user.email}</span>
                </div>
                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground">Account ID</span>
                  <span className="col-span-2 text-sm text-muted-foreground">{user.id}</span>
                </div>
              </>
            )}
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