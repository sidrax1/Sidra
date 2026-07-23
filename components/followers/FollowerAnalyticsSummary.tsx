import {
  Heart,
  ShoppingBag,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";

export interface FollowerAnalytics {
  readonly totalFollowers: number;
  readonly newFollowersThisMonth: number;
  readonly followersWithOrders: number;
  readonly followerRevenuePaise: number;
}

interface FollowerAnalyticsSummaryProps {
  readonly analytics: FollowerAnalytics;
  readonly className?: string;
}

export function FollowerAnalyticsSummary({
  analytics,
  className,
}: FollowerAnalyticsSummaryProps): React.JSX.Element {
  const conversionRate =
    analytics.totalFollowers > 0
      ? Math.round(
          (analytics.followersWithOrders /
            analytics.totalFollowers) *
            100
        )
      : 0;

  const metrics = [
    {
      label: "Total Followers",
      value:
        analytics.totalFollowers.toLocaleString(
          "en-IN"
        ),
      description:
        "Collectors following this Studio",
      icon: UsersRound,
    },
    {
      label: "New This Month",
      value:
        analytics.newFollowersThisMonth.toLocaleString(
          "en-IN"
        ),
      description:
        "Recent audience growth",
      icon: TrendingUp,
    },
    {
      label: "Follower Customers",
      value: `${conversionRate}%`,
      description: `${analytics.followersWithOrders.toLocaleString(
        "en-IN"
      )} followers placed orders`,
      icon: ShoppingBag,
    },
    {
      label: "Follower Revenue",
      value: new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }
      ).format(
        analytics.followerRevenuePaise /
          100
      ),
      description:
        "Revenue attributed to followers",
      icon: Heart,
    },
  ] as const;

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
          Audience Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Studio Following
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]"
            >
              <Icon
                aria-hidden={true}
                className="size-5 text-[var(--color-gold-600)]"
              />

              <p className="mt-5 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
                {metric.value}
              </p>

              <h3 className="mt-3 text-sm font-medium text-foreground">
                {metric.label}
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                {metric.description}
              </p>
            </article>
          );
        })}
      </div>
    </Surface>
  );
}
