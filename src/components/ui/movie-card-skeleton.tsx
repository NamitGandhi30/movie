import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden group h-full border-0 rounded-xl bg-gradient-to-t from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 relative">
      <div className="aspect-[2/3] relative overflow-hidden w-full rounded-t-lg">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="p-3 h-[70px] flex flex-col justify-between">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
} 