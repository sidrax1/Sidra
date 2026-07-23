import {
  BadgePercent,
  IndianRupee,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import { formatCurrency } from "@/lib/currency";

export interface PromotionAnalytics {
  readonly activePromotions: number;
  readonly totalRedemptions: number;
  readonly discountPaise: number;
  readonly attributedRevenuePaise: number;
}

interface PromotionAnalyticsSummaryProps {
  readonly analytics: PromotionAnalytics;
}

export function PromotionAnalyticsSummary({
  analytics,
}: PromotionAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Active Promotions",
      value: analytics.activePromotions.toLocaleString(
        "en-IN"
      ),
      description: "Currently available campaigns",
      icon: Sparkles,
    },
    {
      label: "Redemptions",
      value: analytics.totalRedemptions.toLocaleString(
        "en-IN"
      ),
      description: "Successful customer usage",
      icon: UsersRound,
    },
    {
      label: "Discount Granted",
      value: formatCurrency(
        analytics.discountPaise / 100
      ),
      description: "Total promotional value",
      icon: BadgePercent,
    },
    {
      label: "Attributed Revenue",
      value: formatCurrency(
        analytics.attributedRevenuePaise / 100
      ),
      description: "Revenue from promoted orders",
      icon: IndianRupee,
    },
  ] as const;

  return (
    <Surface padding="none" className="overflow-hidden">
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Campaign Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Promotion Performance
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
                aria-hidden="true"
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
