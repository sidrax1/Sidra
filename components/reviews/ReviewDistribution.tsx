import {
  Star,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";

export interface ReviewDistributionItem {
  readonly rating: 1 | 2 | 3 | 4 | 5;
  readonly count: number;
}

interface ReviewDistributionProps {
  readonly items: readonly ReviewDistributionItem[];
  readonly totalReviews: number;
  readonly className?: string;
}

export function ReviewDistribution({
  className,
  items,
  totalReviews,
}: ReviewDistributionProps): React.JSX.Element {
  const normalizedItems = [5, 4, 3, 2, 1].map(
    (rating) =>
      items.find(
        (item) =>
          item.rating === rating
      ) ?? {
        rating:
          rating as ReviewDistributionItem["rating"],
        count: 0,
      }
  );

  return (
    <section
      aria-label="Review rating distribution"
      className={cn(
        "grid gap-4 rounded-[var(--radius-xl)] border border-border bg-card p-6",
        "shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Rating Distribution
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Customer Sentiment
        </h2>
      </header>

      <div className="grid gap-3 border-t border-border pt-5">
        {normalizedItems.map(
          (item) => {
            const percentage =
              totalReviews > 0
                ? Math.min(
                    Math.max(
                      (item.count /
                        totalReviews) *
                        100,
                      0
                    ),
                    100
                  )
                : 0;

            return (
              <div
                key={item.rating}
                className="grid grid-cols-[56px_minmax(0,1fr)_48px] items-center gap-3"
              >
                <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  {item.rating}
                  <Star
                    aria-hidden={true}
                    className="size-3.5 fill-current text-[var(--color-gold-600)]"
                  />
                </span>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-background"
                  aria-label={`${item.rating} star reviews: ${item.count}`}
                >
                  <div
                    className="h-full rounded-full bg-[var(--color-gold-500)] transition-[width] duration-[var(--duration-slow)]"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="text-right text-xs text-muted">
                  {item.count.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
