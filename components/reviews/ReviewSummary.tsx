import { Star } from "lucide-react";

import { Progress } from "@/components/ui/Progress";
import { Rating } from "@/components/ui/Rating";
import { Surface } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";

export interface ReviewDistribution {
  readonly rating:
    | 1
    | 2
    | 3
    | 4
    | 5;
  readonly count: number;
}

interface ReviewSummaryProps {
  readonly averageRating: number;
  readonly reviewCount: number;
  readonly distribution: readonly ReviewDistribution[];
  readonly className?: string;
}

export function ReviewSummary({
  averageRating,
  className,
  distribution,
  reviewCount,
}: ReviewSummaryProps): React.JSX.Element {
  const distributionMap =
    new Map(
      distribution.map((entry) => [
        entry.rating,
        entry.count,
      ])
    );

  return (
    <Surface
      className={cn(
        "grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]",
        className
      )}
      shadow="hover"
    >
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.06)] p-7 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.35)] bg-card text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]">
          <Star
            aria-hidden="true"
            className="size-6 fill-current"
          />
        </span>

        <p className="mt-5 font-heading text-6xl font-medium tracking-[-0.055em] text-foreground">
          {averageRating.toFixed(1)}
        </p>

        <Rating
          value={averageRating}
          showValue={false}
          className="mt-3"
        />

        <p className="mt-3 text-sm text-muted">
          Based on{" "}
          {reviewCount.toLocaleString(
            "en-IN"
          )}{" "}
          verified{" "}
          {reviewCount === 1
            ? "review"
            : "reviews"}
        </p>
      </div>

      <div className="grid content-center gap-4">
        {[5, 4, 3, 2, 1].map(
          (ratingValue) => {
            const count =
              distributionMap.get(
                ratingValue as
                  | 1
                  | 2
                  | 3
                  | 4
                  | 5
              ) ?? 0;

            const percentage =
              reviewCount > 0
                ? (count /
                    reviewCount) *
                  100
                : 0;

            return (
              <div
                key={ratingValue}
                className="grid grid-cols-[70px_minmax(0,1fr)_54px] items-center gap-4"
              >
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  {ratingValue}

                  <Star
                    aria-hidden="true"
                    className="size-3.5 fill-[var(--color-gold-500)] text-[var(--color-gold-500)]"
                  />
                </span>

                <Progress
                  value={percentage}
                  aria-label={`${ratingValue} star reviews`}
                />

                <span className="text-right text-xs text-muted">
                  {count.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            );
          }
        )}
      </div>
    </Surface>
  );
}
