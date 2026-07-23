import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface AddressSkeletonProps {
  readonly count?: number;
  readonly className?: string;
}

export function AddressSkeleton({
  className,
  count = 2,
}: AddressSkeletonProps): React.JSX.Element {
  return (
    <div
      aria-label="Loading addresses"
      aria-busy="true"
      className={cn(
        "grid gap-4 md:grid-cols-2",
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
            className="rounded-[var(--radius-lg)] border border-border bg-card p-5"
          >
            <div className="flex gap-4">
              <Skeleton className="size-11 rounded-full" />

              <div className="grid flex-1 gap-3">
                <Skeleton className="h-5 w-2/5" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </article>
        )
      )}
    </div>
  );
}
