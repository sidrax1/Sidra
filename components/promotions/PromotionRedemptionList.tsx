import {
  BadgePercent,
  CalendarDays,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Price";
import { formatDateTime } from "@/lib/date";
import type { PromotionRedemption } from "@/types/promotion";

interface PromotionRedemptionListProps {
  readonly redemptions: readonly PromotionRedemption[];
}

export function PromotionRedemptionList({
  redemptions,
}: PromotionRedemptionListProps): React.JSX.Element {
  if (redemptions.length === 0) {
    return (
      <EmptyState
        title="No redemptions yet"
        description="Successful promotion usage will appear here."
      />
    );
  }

  return (
    <section
      aria-label="Promotion redemptions"
      className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead className="bg-[color:rgb(200_169_106_/_0.05)]">
            <tr className="border-b border-border text-left text-xs uppercase tracking-[0.12em] text-muted">
              <th className="px-5 py-4 font-medium">
                Customer
              </th>
              <th className="px-5 py-4 font-medium">
                Order
              </th>
              <th className="px-5 py-4 font-medium">
                Code
              </th>
              <th className="px-5 py-4 font-medium">
                Discount
              </th>
              <th className="px-5 py-4 font-medium">
                Redeemed
              </th>
            </tr>
          </thead>

          <tbody>
            {redemptions.map((redemption) => (
              <tr
                key={redemption.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <UserRound
                      aria-hidden="true"
                      className="size-4 text-[var(--color-gold-600)]"
                    />
                    {redemption.customerId}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
                    <ShoppingBag
                      aria-hidden="true"
                      className="size-4"
                    />
                    {redemption.orderId}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-foreground">
                    <BadgePercent
                      aria-hidden="true"
                      className="size-4 text-[var(--color-gold-600)]"
                    />
                    {redemption.code ?? "AUTOMATIC"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <Price
                    amount={redemption.discountPaise / 100}
                    size="sm"
                  />
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 text-xs text-muted">
                    <CalendarDays
                      aria-hidden="true"
                      className="size-4"
                    />
                    {formatDateTime(redemption.redeemedAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
