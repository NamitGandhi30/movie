import { Skeleton } from "@/components/ui/skeleton";

export function MovieDetailsSkeleton() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
            <Skeleton className="absolute inset-0" />
          </div>
        </div>

        <div className="md:w-2/3 lg:w-3/4 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          
          <Skeleton className="h-6 w-1/2" />
          
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          
          <div className="pt-4">
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="pt-4">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
} 