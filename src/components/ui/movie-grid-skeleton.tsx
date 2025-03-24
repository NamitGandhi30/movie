import { MovieCardSkeleton } from "@/components/ui/movie-card-skeleton";

interface MovieGridSkeletonProps {
  count?: number;
}

export function MovieGridSkeleton({ count = 10 }: MovieGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
} 