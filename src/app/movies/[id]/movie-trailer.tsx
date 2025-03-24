"use client";

import { VideoPlayer } from "@/components/video-player";
import { getMovieVideos } from "@/lib/tmdb";

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

interface MovieTrailerProps {
  movieId: number;
}

export async function MovieTrailer({ movieId }: MovieTrailerProps) {
  const data = await getMovieVideos(movieId);
  
  // Find the official trailer or teaser
  const officialTrailer = data.results.find(
    (video: Video) => 
      video.type === "Trailer" && 
      video.site === "YouTube" && 
      video.official
  );
  
  // If no official trailer, find any trailer
  const anyTrailer = data.results.find(
    (video: Video) => 
      video.type === "Trailer" && 
      video.site === "YouTube"
  );
  
  // If no trailer, find a teaser
  const teaser = data.results.find(
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
    <VideoPlayer
      videoKey={video.key}
      title={video.name}
      btnText="Watch Trailer"
      variant="default"
    />
  );
} 