"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type FavoritesContextType = {
  favorites: number[];
  addFavorite: (movieId: number) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favoriteMovies");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movieId: number) => {
    setFavorites((prev) => {
      if (!prev.includes(movieId)) {
        return [...prev, movieId];
      }
      return prev;
    });
  };

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}