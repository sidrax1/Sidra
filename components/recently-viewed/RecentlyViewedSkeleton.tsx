import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface RecentlyViewedSkeletonProps {
  readonly count?: number;
  readonly className?: string;
}

export function RecentlyViewedSkeleton({
  className,
  count = 4,
}: RecentlyViewedSkeletonProps): React.JSX.Element {
  return (
    <div
      aria-label="Loading recently viewed products"
      aria-busy="true"
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {Array.from(
        {
          length: Math.max(
            count,
            1
          ),
        },
        (_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
          >
            <Skeleton className="aspect-square w-full rounded-none" />

            <div className="grid gap-3 p-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </article>
        )
      )}
    </div>
  );
}
