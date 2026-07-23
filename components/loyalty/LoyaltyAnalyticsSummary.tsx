import {
  Coins,
  IndianRupee,
  RefreshCcw,
  Sparkles,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { Surface } from "@/components/ui/Surface";
import { formatCurrency } from "@/lib/currency";
import type {
  LoyaltyProgramAnalytics,
} from "@/types/loyalty";

interface LoyaltyAnalyticsSummaryProps {
  readonly analytics: LoyaltyProgramAnalytics;
}

export function LoyaltyAnalyticsSummary({
  analytics,
}: LoyaltyAnalyticsSummaryProps): React.JSX.Element {
  const metrics = [
    {
      label: "Active Members",
      value:
        analytics.activeMembers.toLocaleString(
          "en-IN"
        ),
      description:
        "Customers enrolled in the loyalty programme",
      icon: UsersRound,
    },
    {
      label: "Points Issued",
      value:
        analytics.pointsIssued.toLocaleString(
          "en-IN"
        ),
      description:
        "Total points credited across all accounts",
      icon: Sparkles,
    },
    {
      label: "Points Redeemed",
      value:
        analytics.pointsRedeemed.toLocaleString(
          "en-IN"
        ),
      description:
        "Points converted into member rewards",
      icon: WalletCards,
    },
    {
      label: "Outstanding Points",
      value:
        analytics.outstandingPoints.toLocaleString(
          "en-IN"
        ),
      description:
        "Available points currently held by members",
      icon: Coins,
    },
    {
      label: "Expired Points",
      value:
        analytics.pointsExpired.toLocaleString(
          "en-IN"
        ),
      description:
        "Points removed after their validity period",
      icon: RefreshCcw,
    },
    {
      label: "Attributed Revenue",
      value: formatCurrency(
        analytics.attributedRevenuePaise /
          100
      ),
      description:
        "Revenue linked to loyalty member purchases",
      icon: IndianRupee,
    },
  ] as const;

  return (
    <Surface
      padding="none"
      className="overflow-hidden"
    >
      <header className="flex flex-col gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Membership Intelligence
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Loyalty Programme Performance
          </h2>
        </div>

        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted">
          Redemption rate{" "}
          <strong className="font-medium text-foreground">
            {analytics.redemptionRatePercentage.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 2,
              }
            )}
            %
          </strong>
        </div>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon =
            metric.icon;

          return (
            <article
              key={metric.label}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.38)] hover:shadow-[var(--shadow-hover)]"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
                <Icon
                  aria-hidden={true}
                  className="size-5"
                />
              </span>

              <p className="mt-5 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
                {metric.value}
              </p>

              <h3 className="mt-3 text-sm font-medium text-foreground">
                {metric.label}
              </h3>

              <p className="mt-1 text-xs leading-5 text-muted">
                {
                  metric.description
                }
              </p>
            </article>
          );
        })}
      </div>
    </Surface>
  );
}
