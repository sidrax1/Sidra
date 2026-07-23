import { Skeleton } from "@/components/ui/Skeleton";

export function AccountOverviewSkeleton(): React.JSX.Element {
  return (
    <div
      aria-label="Loading account overview"
      aria-busy="true"
      className="grid gap-8"
    >
      <section className="rounded-[var(--radius-xl)] border border-border bg-card p-8">
        <div className="flex items-center gap-5">
          <Skeleton className="size-20 rounded-full" />

          <div className="grid flex-1 gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-12 w-3/5" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from(
          {
            length: 4,
          },
          (_, index) => (
            <article
              key={index}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-5"
            >
              <Skeleton className="size-11 rounded-full" />
              <Skeleton className="mt-5 h-10 w-1/2" />
              <Skeleton className="mt-3 h-4 w-3/4" />
              <Skeleton className="mt-2 h-3 w-full" />
            </article>
          )
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {Array.from(
          {
            length: 4,
          },
          (_, index) => (
            <article
              key={index}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-5"
            >
              <div className="flex gap-4">
                <Skeleton className="size-14 rounded-full" />

                <div className="grid flex-1 gap-3">
                  <Skeleton className="h-5 w-2/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </article>
          )
        )}
      </section>
    </div>
  );
}
