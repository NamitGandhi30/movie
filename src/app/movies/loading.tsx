import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-12 w-48 mb-8" />
      <MovieGridSkeleton count={15} />
    </div>
  );
} 