import { Skeleton } from "@/components/ui/skeleton";
import { MovieCardSkeleton } from "@/components/ui/movie-card-skeleton";

interface ScrollableListSkeletonProps {
  showTitle?: boolean;
  count?: number;
}

export function ScrollableListSkeleton({ 
  showTitle = true, 
  count = 6 
}: ScrollableListSkeletonProps) {
  return (
    <div className="space-y-4 py-4">
      {showTitle && (
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-10 w-20" />
        </div>
      )}
      <div className="relative">
        <div className="flex space-x-4 overflow-hidden">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="w-[160px] sm:w-[200px] md:w-[240px] flex-shrink-0">
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 