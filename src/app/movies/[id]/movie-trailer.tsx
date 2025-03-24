"use client";

import { useState, useEffect } from "react";
import { getMovieVideos } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

interface MovieTrailerProps {
  movieId: number;
}

export async function MovieTrailer({ movieId }: MovieTrailerProps) {
  const data = await getMovieVideos(movieId);
  
  // Find first trailer or teaser
  const trailer = data.results?.find(
    (video: any) => 
      (video.type === "Trailer" || video.type === "Teaser") && 
      video.site === "YouTube"
  );
  
  if (!trailer) {
    return null;
  }
  
  return (
    <Button 
      className="flex items-center gap-2" 
      variant="default"
      onClick={() => {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
      }}
    >
      <PlayIcon className="h-4 w-4" />
      Watch Trailer
    </Button>
  );
} 