import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface PromotionSkeletonProps {
  readonly count?: number;
  readonly className?: string;
}

export function PromotionSkeleton({
  className,
  count = 4,
}: PromotionSkeletonProps): React.JSX.Element {
  return (
    <div
      aria-label="Loading promotions"
      aria-busy="true"
      className={cn(
        "grid gap-5 xl:grid-cols-2",
        className
      )}
    >
      {Array.from(
        {
          length: Math.max(count, 1),
        },
        (_, index) => (
          <article
            key={index}
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
          >
            <div className="border-b border-border p-6">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>

              <Skeleton className="mt-5 h-9 w-3/5" />
              <Skeleton className="mt-3 h-7 w-28 rounded-full" />
            </div>

            <div className="grid gap-4 p-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[88%]" />

              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </article>
        )
      )}
    </div>
  );
}
