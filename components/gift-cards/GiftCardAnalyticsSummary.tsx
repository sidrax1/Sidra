import {
  Gift,
  IndianRupee,
  MailCheck,
  WalletCards,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import { formatCurrency } from "@/lib/currency";

export interface GiftCardAnalytics {
  readonly issuedCount: number;
  readonly deliveredCount: number;
  readonly issuedValuePaise: number;
  readonly outstandingBalancePaise: number;
}

interface GiftCardAnalyticsSummaryProps {
  readonly analytics: GiftCardAnalytics;
}

export function GiftCardAnalyticsSummary({
  analytics,
}: GiftCardAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Cards Issued",
      value: analytics.issuedCount.toLocaleString("en-IN"),
      description: "Purchased digital gift cards",
      icon: Gift,
    },
    {
      label: "Delivered",
      value: analytics.deliveredCount.toLocaleString(
        "en-IN"
      ),
      description: "Successfully delivered gifts",
      icon: MailCheck,
    },
    {
      label: "Issued Value",
      value: formatCurrency(
        analytics.issuedValuePaise / 100
      ),
      description: "Original gift card value",
      icon: IndianRupee,
    },
    {
      label: "Outstanding Balance",
      value: formatCurrency(
        analytics.outstandingBalancePaise / 100
      ),
      description: "Unused active card value",
      icon: WalletCards,
    },
  ] as const;

  return (
    <Surface padding="none" className="overflow-hidden">
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Gift Intelligence
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Gift Card Performance
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
