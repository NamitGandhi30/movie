import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";

export default function Loading() {
  return (
    <div className="container py-12">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8 mb-8">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
      </div>

      <MovieGridSkeleton count={8} />
    </div>
  );
} 