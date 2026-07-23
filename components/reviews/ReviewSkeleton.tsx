import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface ReviewSkeletonProps {
  readonly count?: number;
  readonly className?: string;
}

export function ReviewSkeleton({
  className,
  count = 3,
}: ReviewSkeletonProps): React.JSX.Element {
  return (
    <div
      aria-label="Loading reviews"
      aria-busy="true"
      className={cn(
        "grid gap-5",
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
            className="rounded-[var(--radius-lg)] border border-border bg-card p-6 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start justify-between gap-5">
              <div className="flex items-center gap-4">
                <Skeleton className="size-11 rounded-full" />

                <div className="grid gap-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              <Skeleton className="h-5 w-28" />
            </div>

            <div className="mt-6 grid gap-3">
              <Skeleton className="h-6 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[92%]" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </article>
        )
      )}
    </div>
  );
}
