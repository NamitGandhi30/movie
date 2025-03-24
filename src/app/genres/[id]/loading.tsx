import { Skeleton } from "@/components/ui/skeleton";
import { MovieGridSkeleton } from "@/components/ui/movie-grid-skeleton";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="container py-8">
      <Link href="/genres" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back to genres
      </Link>
      
      <Skeleton className="h-10 w-64 mb-8" />
      
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