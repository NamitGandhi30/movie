"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[60vh] bg-gradient-to-r from-neutral-950 to-neutral-900 dark:from-black dark:to-neutral-900 flex items-center justify-center">
        <div className="container max-w-6xl mx-auto px-4 py-20 animate-pulse">
          <div className="h-10 w-3/4 bg-neutral-800 rounded mb-8"></div>
          <div className="h-6 w-2/3 bg-neutral-800 rounded mb-12"></div>
          <div className="h-12 w-36 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 to-neutral-900/90 dark:from-black dark:to-neutral-900/90 z-10"></div>
      
      <div className="bg-[url('/hero-image.jpg')] bg-cover bg-center h-[60vh] md:h-[70vh] w-full absolute inset-0"></div>
      
      <div className="container relative z-20 max-w-6xl mx-auto px-4 h-[60vh] md:h-[70vh] flex flex-col justify-center items-start">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 max-w-2xl">
          Discover and explore your favorite movies
        </h1>
        <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-xl">
          Find detailed information, ratings, and keep track of your favorites all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/movies">
            <Button size="lg" className="font-semibold">
              Browse Movies
            </Button>
          </Link>
          <Link href="/genres">
            <Button size="lg" variant="secondary" className="font-semibold">
              Explore Genres
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" size="lg" className="font-semibold bg-background/10 backdrop-blur-sm border-neutral-200/30 text-white hover:bg-background/20">
              <SearchIcon className="mr-2 h-5 w-5" />
              Search Movies
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 