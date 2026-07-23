import {
  BadgeIndianRupee,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import {
  Price,
} from "@/components/ui/Price";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentFinancialsProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

export function ServicePartnerAssignmentFinancials({
  assignment,
  className,
}: ServicePartnerAssignmentFinancialsProps): React.JSX.Element {
  const platformMarginPaise =
    Math.max(
      assignment.approvedCostPaise -
        assignment.platformPayablePaise,
      0
    );

  const approvalVariancePaise =
    assignment.approvedCostPaise -
    assignment.estimatedCostPaise;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <WalletCards
          aria-hidden={true}
          className="size-5 text-[var(--color-gold-600)]"
        />

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Assignment Financials
        </h2>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Estimated Cost
          </p>

          <Price
            amount={
              assignment.estimatedCostPaise /
              100
            }
            size="lg"
            className="mt-2"
          />
        </article>

        <article className="rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Approved Cost
          </p>

          <Price
            amount={
              assignment.approvedCostPaise /
              100
            }
            size="lg"
            className="mt-2"
          />
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <ShieldCheck
              aria-hidden={true}
              className="size-3.5"
            />
            Partner Payable
          </p>

          <Price
            amount={
              assignment.platformPayablePaise /
              100
            }
            size="lg"
            className="mt-2"
          />
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <BadgeIndianRupee
              aria-hidden={true}
              className="size-3.5"
            />
            Customer Payable
          </p>

          <Price
            amount={
              assignment.customerPayablePaise /
              100
            }
            size="lg"
            className="mt-2"
          />
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Platform Margin
          </p>

          <Price
            amount={
              platformMarginPaise /
              100
            }
            size="lg"
            className="mt-2"
          />
        </article>

        <article
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            approvalVariancePaise >
              0
              ? "border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.06)]"
              : "border-border bg-background"
          )}
        >
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Approval Variance
          </p>

          <p className="mt-2 font-heading text-3xl font-medium text-foreground">
            {approvalVariancePaise >=
            0
              ? "+"
              : "−"}
            ₹
            {(
              Math.abs(
                approvalVariancePaise
              ) / 100
            ).toLocaleString(
              "en-IN"
            )}
          </p>
        </article>
      </div>
    </section>
  );
}
