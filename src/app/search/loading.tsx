import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";

export default function Loading() {
  return (
    <div className="container py-8">
      <div className="mb-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12 w-full max-w-xl" />
      </div>
      
      <MovieGridSkeleton count={12} />
    </div>
  );
} 