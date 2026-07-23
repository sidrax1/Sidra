import {
  BadgeIndianRupee,
  Building2,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  Price,
} from "@/components/ui/Price";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerSettlementProfile,
} from "@/types/service-partner";

interface ServicePartnerSettlementCardProps {
  readonly settlement: ServicePartnerSettlementProfile;
  readonly className?: string;
}

export function ServicePartnerSettlementCard({
  className,
  settlement,
}: ServicePartnerSettlementCardProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <BadgeIndianRupee
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Settlement Profile
          </h2>
        </div>

        <Badge
          variant={
            settlement.bankAccount
              ?.verified
              ? "success"
              : "warning"
          }
        >
          {settlement.bankAccount
            ?.verified
            ? "Bank Verified"
            : "Verification Pending"}
        </Badge>
      </header>

      <div className="grid gap-5 p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.13em] text-muted">
              Commission
            </dt>

            <dd className="mt-2 font-heading text-3xl font-medium text-foreground">
              {
                settlement.commissionPercentage
              }
              %
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.13em] text-muted">
              Platform Fee
            </dt>

            <dd className="mt-2 font-heading text-3xl font-medium text-foreground">
              {
                settlement.platformFeePercentage
              }
              %
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="text-xs uppercase tracking-[0.13em] text-muted">
              Tax Deduction
            </dt>

            <dd className="mt-2 font-heading text-3xl font-medium text-foreground">
              {
                settlement.taxDeductionPercentage
              }
              %
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <CalendarClock
                aria-hidden="true"
                className="size-3.5"
              />
              Settlement Cycle
            </dt>

            <dd className="mt-2 text-sm font-medium capitalize text-foreground">
              {
                settlement.settlementCycle
              }
            </dd>
          </div>
        </dl>

        <div className="rounded-[var(--radius-md)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Minimum Settlement
          </p>

          <Price
            amount={
              settlement.minimumSettlementPaise /
              100
            }
            size="lg"
            className="mt-2"
          />

          <p className="mt-2 text-xs text-muted">
            Released after{" "}
            {
              settlement.settlementHoldDays
            }{" "}
            hold day
            {settlement.settlementHoldDays ===
            1
              ? ""
              : "s"}
            .
          </p>
        </div>

        {settlement.bankAccount ? (
          <section className="rounded-[var(--radius-md)] border border-border bg-background p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-muted">
                <Building2
                  aria-hidden="true"
                  className="size-3.5 text-[var(--color-gold-600)]"
                />
                Settlement Bank
              </p>

              {settlement.bankAccount
                .verified ? (
                <ShieldCheck
                  aria-label="Verified bank account"
                  className="size-4 text-[var(--color-success)]"
                />
              ) : null}
            </div>

            <p className="mt-3 font-medium text-foreground">
              {
                settlement.bankAccount
                  .accountHolderName
              }
            </p>

            <p className="mt-1 text-sm text-muted">
              {
                settlement.bankAccount
                  .bankName
              }{" "}
              ••••{" "}
              {
                settlement.bankAccount
                  .accountNumberLastFour
              }
            </p>

            <p className="mt-1 font-mono text-xs text-muted">
              {
                settlement.bankAccount
                  .ifscCode
              }
            </p>
          </section>
        ) : null}
      </div>
    </section>
  );
}
