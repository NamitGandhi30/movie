import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-10 w-64 mb-8" />
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
        
        <Skeleton className="h-10 w-[180px]" />
      </div>
      
      <Skeleton className="h-8 w-48 mb-6" />
      
      <MovieGridSkeleton count={20} />
      
      <div className="flex justify-center mt-12 gap-2">
        <Skeleton className="h-10 w-24" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
} 