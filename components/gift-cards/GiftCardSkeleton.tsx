import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface GiftCardSkeletonProps {
  readonly count?: number;
  readonly className?: string;
}

export function GiftCardSkeleton({
  className,
  count = 3,
}: GiftCardSkeletonProps): React.JSX.Element {
  return (
    <div
      aria-label="Loading gift cards"
      aria-busy="true"
      className={cn(
        "grid gap-5 md:grid-cols-2 xl:grid-cols-3",
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
            <Skeleton className="aspect-[1.6/1] w-full rounded-none" />

            <div className="grid gap-4 p-5">
              <div className="flex justify-between gap-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </article>
        )
      )}
    </div>
  );
}
