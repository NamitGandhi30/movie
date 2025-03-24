import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";

export default function Loading() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b">
          <div>
            <Skeleton className="h-10 w-48 mb-3" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-28 mt-4 md:mt-0" />
        </div>

        <div className="mb-10">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-40 col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-56 col-span-2" />
            </div>
          </div>
        </div>

        <div>
          <Skeleton className="h-8 w-48 mb-6" />
          <MovieGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
} 