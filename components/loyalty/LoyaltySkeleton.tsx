import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface LoyaltySkeletonProps {
  readonly rewardCount?: number;
  readonly className?: string;
}

export function LoyaltySkeleton({
  className,
  rewardCount = 6,
}: LoyaltySkeletonProps): React.JSX.Element {
  return (
    <div
      aria-label="Loading loyalty programme"
      aria-busy="true"
      className={cn(
        "grid gap-8",
        className
      )}
    >
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card">
        <div className="bg-[var(--color-black-900)] p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="grid gap-4">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full bg-white/15" />
                <Skeleton className="h-6 w-28 rounded-full bg-white/15" />
              </div>

              <Skeleton className="h-4 w-44 bg-white/15" />
              <Skeleton className="h-24 w-72 bg-white/15" />
              <Skeleton className="h-4 w-40 bg-white/15" />
            </div>

            <Skeleton className="h-40 w-full rounded-[var(--radius-lg)] bg-white/15 lg:w-72" />
          </div>
        </div>

        <div className="grid gap-5 p-6">
          <Skeleton className="h-32 w-full rounded-[var(--radius-lg)]" />

          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from(
          {
            length: Math.max(
              rewardCount,
              1
            ),
          },
          (_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
            >
              <Skeleton className="aspect-[16/10] w-full rounded-none" />

              <div className="grid gap-4 p-5">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[86%]" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            </article>
          )
        )}
      </section>
    </div>
  );
}
