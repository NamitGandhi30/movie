import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      {/* Hero backdrop skeleton */}
      <div className="relative w-full h-[40vh] lg:h-[50vh] -mt-16 mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background"></div>
        <Skeleton className="w-full h-full" />
      </div>

      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 lg:w-1/4 md:-mt-32 lg:-mt-40 relative z-20">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
          </div>

          <div className="md:w-2/3 lg:w-3/4 space-y-5">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/2" />
            
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
            
            <div className="flex items-center gap-6">
              <Skeleton className="h-6 w-20" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
            
            <div className="pt-2">
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="pt-4 flex gap-3">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
        
        <div className="mt-16 space-y-4">
          <Skeleton className="h-8 w-48" />
          
          <div className="relative">
            <div className="flex gap-6 overflow-hidden scrollbar-hide">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-[180px] flex-shrink-0">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-5 w-full mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 