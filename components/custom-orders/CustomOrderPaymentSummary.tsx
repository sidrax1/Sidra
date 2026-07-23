import {
  CreditCard,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { Separator } from "@/components/ui/Separator";
import { Surface } from "@/components/ui/Surface";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { CustomOrderPaymentRecord } from "@/types/custom-order-workflow";

interface CustomOrderPaymentSummaryProps {
  readonly payment: CustomOrderPaymentRecord;
  readonly className?: string;
}

const statusLabels: Record<
  CustomOrderPaymentRecord["status"],
  string
> = {
  pending: "Pending",
  authorized: "Authorized",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partiallyRefunded:
    "Partially Refunded",
};

export function CustomOrderPaymentSummary({
  className,
  payment,
}: CustomOrderPaymentSummaryProps): React.JSX.Element {
  const statusVariant =
    payment.status === "paid"
      ? "success"
      : payment.status ===
            "failed" ||
          payment.status ===
            "refunded"
        ? "error"
        : payment.status ===
            "authorized"
          ? "gold"
          : "warning";

  return (
    <Surface
      padding="none"
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      <header className="flex flex-col gap-5 border-b border-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
            <CreditCard
              aria-hidden="true"
              className="size-5"
            />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
              Protected Payment
            </p>

            <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              Payment Summary
            </h2>
          </div>
        </div>

        <Badge variant={statusVariant}>
          {statusLabels[payment.status]}
        </Badge>
      </header>

      <div className="grid gap-5 p-6">
        <div className="grid gap-4 text-sm">
          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Crafting amount</span>

            <Price
              amount={
                payment.amountPaise /
                100
              }
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Shipping</span>

            <Price
              amount={
                payment.shippingFeePaise /
                100
              }
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Tax</span>

            <Price
              amount={
                payment.taxPaise / 100
              }
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Platform service</span>

            <Price
              amount={
                payment.platformFeePaise /
                100
              }
              size="sm"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-5 font-semibold text-foreground">
            <span>Total</span>

            <Price
              amount={
                payment.totalPaise /
                100
              }
              size="lg"
            />
          </div>

          {typeof payment.refundedAmountPaise ===
            "number" &&
          payment.refundedAmountPaise >
            0 ? (
            <div className="flex items-center justify-between gap-5 text-[var(--color-error)]">
              <span>Refunded</span>

              <Price
                amount={
                  payment.refundedAmountPaise /
                  100
                }
                size="sm"
              />
            </div>
          ) : null}
        </div>

        <div className="grid gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-xs text-muted">
          <div className="flex items-center justify-between gap-4">
            <span>Gateway</span>

            <strong className="font-medium text-foreground">
              {payment.gateway}
            </strong>
          </div>

          {payment.gatewayTransactionId ? (
            <div className="flex items-start justify-between gap-4">
              <span>Transaction reference</span>

              <strong className="max-w-[65%] break-all text-right font-mono font-medium text-foreground">
                {
                  payment.gatewayTransactionId
                }
              </strong>
            </div>
          ) : null}

          {payment.paidAt ? (
            <div className="flex items-center justify-between gap-4">
              <span>Paid at</span>

              <strong className="font-medium text-foreground">
                {formatDateTime(
                  payment.paidAt
                )}
              </strong>
            </div>
          ) : null}
        </div>

        <div className="flex items-start gap-3 border-t border-border pt-5 text-xs leading-6 text-muted">
          {payment.status === "paid" ? (
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
            />
          ) : (
            <LockKeyhole
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-600)]"
            />
          )}

          <p>
            Payment confirmation and state transitions are verified
            through trusted server-side functions.
          </p>
        </div>
      </div>
    </Surface>
  );
}
