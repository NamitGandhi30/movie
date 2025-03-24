"use client";

import { useState } from "react";
import { getMovieVideos } from "@/lib/tmdb";
import { Button } from "@/components/ui/button";
import { PlayIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

interface MovieTrailerProps {
  movieId: number;
}

export async function MovieTrailer({ movieId }: MovieTrailerProps) {
  // Use React's useState for client-side state
  const [isOpen, setIsOpen] = useState(false);
  
  // Fetch videos data
  const data = await getMovieVideos(movieId);
  
  // Find official trailer first
  const officialTrailer = data.results?.find(
    (video: Video) => 
      video.type === "Trailer" && 
      video.site === "YouTube" && 
      video.official
  );
  
  // If no official trailer, find any trailer
  const anyTrailer = data.results?.find(
    (video: Video) => 
      video.type === "Trailer" && 
      video.site === "YouTube"
  );
  
  // If no trailer, find a teaser
  const teaser = data.results?.find(
    (video: Video) => 
      video.type === "Teaser" && 
      video.site === "YouTube"
  );
  
  // Use the first available video
  const video = officialTrailer || anyTrailer || teaser;
  
  if (!video) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant="default">
          <PlayIcon className="h-4 w-4" />
          Watch Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-none">
        <div className="aspect-video w-full relative">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.name || "Movie Trailer"}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
          ></iframe>
          
          {/* Custom close button positioned in the top-right for better visibility */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 