import {
  BadgeCheck,
  Flag,
  MessageSquareText,
  Star,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";

export interface ReviewAnalytics {
  readonly totalReviews: number;
  readonly publishedReviews: number;
  readonly pendingReviews: number;
  readonly verifiedReviews: number;
  readonly reportedReviews: number;
  readonly averageRating: number;
}

interface ReviewAnalyticsSummaryProps {
  readonly analytics: ReviewAnalytics;
  readonly className?: string;
}

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly icon: React.ReactNode;
}

function MetricCard({
  description,
  icon,
  label,
  value,
}: MetricCardProps): React.JSX.Element {
  return (
    <article className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
          {icon}
        </span>

        <p className="font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
          {value}
        </p>
      </div>

      <h3 className="mt-5 text-sm font-medium text-foreground">
        {label}
      </h3>

      <p className="mt-2 text-xs leading-5 text-muted">
        {description}
      </p>
    </article>
  );
}

export function ReviewAnalyticsSummary({
  analytics,
  className,
}: ReviewAnalyticsSummaryProps): React.JSX.Element {
  const verifiedPercentage =
    analytics.totalReviews > 0
      ? Math.round(
          (analytics.verifiedReviews /
            analytics.totalReviews) *
            100
        )
      : 0;

  return (
    <Surface
      padding="none"
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Reputation Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Review Performance
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Average Rating"
          value={analytics.averageRating.toFixed(
            1
          )}
          description={`${analytics.totalReviews.toLocaleString(
            "en-IN"
          )} total collector reviews`}
          icon={
            <Star
              aria-hidden="true"
              className="size-5 fill-current"
            />
          }
        />

        <MetricCard
          label="Published Reviews"
          value={analytics.publishedReviews.toLocaleString(
            "en-IN"
          )}
          description={`${analytics.pendingReviews.toLocaleString(
            "en-IN"
          )} awaiting moderation`}
          icon={
            <MessageSquareText
              aria-hidden="true"
              className="size-5"
            />
          }
        />

        <MetricCard
          label="Verified Purchase"
          value={`${verifiedPercentage}%`}
          description={`${analytics.verifiedReviews.toLocaleString(
            "en-IN"
          )} reviews linked to completed orders`}
          icon={
            <BadgeCheck
              aria-hidden="true"
              className="size-5"
            />
          }
        />

        <MetricCard
          label="Reported Reviews"
          value={analytics.reportedReviews.toLocaleString(
            "en-IN"
          )}
          description="Requires moderation investigation"
          icon={
            <Flag
              aria-hidden="true"
              className="size-5"
            />
          }
        />
      </div>
    </Surface>
  );
}
