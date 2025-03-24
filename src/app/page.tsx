import { getPopularMovies, getTopRatedMovies } from "@/lib/tmdb";
import { ScrollableMovieList } from "@/components/scrollable-movie-list";
import { getImageUrl } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/lib/tmdb";
import HeroSection from "@/components/hero-section";
import { Suspense } from "react";
import { ScrollableListSkeleton } from "@/components/ui/scrollable-list-skeleton";

export default async function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Suspense fallback={
        <div className="w-full h-[60vh] bg-gradient-to-r from-neutral-950 to-neutral-900 dark:from-black dark:to-neutral-900">
          <div className="container px-4 py-16 animate-pulse">
            <div className="h-12 w-3/4 max-w-2xl bg-neutral-800 rounded mb-6"></div>
            <div className="h-6 w-2/3 max-w-xl bg-neutral-800 rounded mb-8"></div>
            <div className="h-10 w-32 bg-neutral-800 rounded"></div>
          </div>
        </div>
      }>
        <HeroSection />
      </Suspense>

      <div className="container px-4 sm:px-6 space-y-8">
        <Suspense fallback={<ScrollableListSkeleton />}>
          <PopularMoviesSection />
        </Suspense>

        <Suspense fallback={<ScrollableListSkeleton />}>
          <TopRatedMoviesSection />
        </Suspense>
      </div>
    </main>
  );
}

async function PopularMoviesSection() {
  const popularMovies = await getPopularMovies();
  
  return (
    <ScrollableMovieList 
      title="Popular Movies" 
      movies={popularMovies.results.slice(0, 20)} 
      id="popular-movies"
    />
  );
}

async function TopRatedMoviesSection() {
  const topRatedMovies = await getTopRatedMovies();
  
  return (
    <ScrollableMovieList 
      title="Top Rated Movies" 
      movies={topRatedMovies.results.slice(0, 20)} 
      id="top-rated-movies"
    />
  );
}
