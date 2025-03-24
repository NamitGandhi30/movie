import { Skeleton } from "@/components/ui/skeleton";
import { ScrollableListSkeleton } from "@/components/ui/scrollable-list-skeleton";

export default function Loading() {
  return (
    <div>
      {/* Hero Section Skeleton */}
      <div className="w-full h-[60vh] bg-gradient-to-r from-neutral-950 to-neutral-900 dark:from-black dark:to-neutral-900 flex items-center justify-center">
        <div className="container max-w-6xl mx-auto px-4 py-20">
          <Skeleton className="h-12 w-3/4 max-w-2xl mb-6" />
          <Skeleton className="h-6 w-2/3 max-w-xl mb-8" />
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>

      {/* Content Section Skeletons */}
      <div className="container py-8">
        <ScrollableListSkeleton />
        <ScrollableListSkeleton />
      </div>
    </div>
  );
} 