import {
  BadgeIndianRupee,
  ShieldCheck,
} from "lucide-react";

import { Price } from "@/components/ui/Price";
import { Separator } from "@/components/ui/Separator";
import { Surface } from "@/components/ui/Surface";
import { cn } from "@/lib/utils";
import type { OrderPricing } from "@/types/order";

interface OrderPricingSummaryProps {
  readonly pricing: OrderPricing;
  readonly className?: string;
}

interface PricingRowProps {
  readonly label: string;
  readonly amountPaise: number;
  readonly negative?: boolean;
  readonly emphasized?: boolean;
}

function PricingRow({
  amountPaise,
  emphasized = false,
  label,
  negative = false,
}: PricingRowProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-5",
        emphasized
          ? "font-semibold text-foreground"
          : "text-sm text-muted"
      )}
    >
      <span>{label}</span>

      <Price
        amount={(negative ? -amountPaise : amountPaise) / 100}
        size={emphasized ? "lg" : "sm"}
        className={cn(
          negative && "text-[var(--color-success)]"
        )}
      />
    </div>
  );
}

export function OrderPricingSummary({
  className,
  pricing,
}: OrderPricingSummaryProps): React.JSX.Element {
  return (
    <Surface
      padding="none"
      className={cn("overflow-hidden", className)}
    >
      <header className="flex items-start gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.28)] bg-card text-[var(--color-gold-600)]">
          <BadgeIndianRupee
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Financial Summary
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Order Pricing
          </h2>
        </div>
      </header>

      <div className="grid gap-4 p-6">
        <PricingRow
          label="Items subtotal"
          amountPaise={pricing.itemsSubtotalPaise}
        />

        {pricing.discountPaise > 0 ? (
          <PricingRow
            label="Discount"
            amountPaise={pricing.discountPaise}
            negative
          />
        ) : null}

        <PricingRow
          label="Shipping"
          amountPaise={pricing.shippingPaise}
        />

        <PricingRow
          label="Tax"
          amountPaise={pricing.taxPaise}
        />

        {pricing.platformFeePaise > 0 ? (
          <PricingRow
            label="Platform service"
            amountPaise={pricing.platformFeePaise}
          />
        ) : null}

        {pricing.giftWrapPaise > 0 ? (
          <PricingRow
            label="Luxury gift wrapping"
            amountPaise={pricing.giftWrapPaise}
          />
        ) : null}

        <Separator />

        <PricingRow
          label="Order total"
          amountPaise={pricing.totalPaise}
          emphasized
        />

        {pricing.refundedPaise > 0 ? (
          <>
            <Separator />

            <PricingRow
              label="Refunded"
              amountPaise={pricing.refundedPaise}
              negative
            />
          </>
        ) : null}

        <div className="mt-2 flex items-start gap-3 border-t border-border pt-5 text-xs leading-6 text-muted">
          <ShieldCheck
            aria-hidden={true}
            className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
          />

          <p>
            Order totals, refunds and payment transitions are
            calculated and verified through trusted server-side
            functions.
          </p>
        </div>
      </div>
    </Surface>
  );
}
