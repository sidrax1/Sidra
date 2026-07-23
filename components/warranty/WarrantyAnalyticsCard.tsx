import {
  ShieldCheck,
} from "lucide-react";

import {
  Price,
} from "@/components/ui/Price";
import type {
  WarrantyAnalytics,
} from "@/types/warranty";

interface WarrantyAnalyticsCardProps {
  readonly analytics: WarrantyAnalytics;
}

export function WarrantyAnalyticsCard({
  analytics,
}: WarrantyAnalyticsCardProps): React.JSX.Element {
  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <article className="rounded-[var(--radius-lg)] border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Active Warranties
        </p>

        <h2 className="mt-3 font-heading text-4xl">
          {analytics.activeWarranties}
        </h2>
      </article>

      <article className="rounded-[var(--radius-lg)] border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Open Claims
        </p>

        <h2 className="mt-3 font-heading text-4xl">
          {analytics.openClaims}
        </h2>
      </article>

      <article className="rounded-[var(--radius-lg)] border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Claim Rate
        </p>

        <h2 className="mt-3 font-heading text-4xl">
          {analytics.claimRatePercentage.toFixed(
            1
          )}
          %
        </h2>
      </article>

      <article className="rounded-[var(--radius-lg)] border border-border bg-card p-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">
          Coverage Approved
        </p>

        <div className="mt-3">
          <Price
            amount={
              analytics.approvedCoverageValuePaise /
              100
            }
            size="lg"
          />
        </div>
      </article>
    </section>
  );
}
