import {
  BadgeIndianRupee,
  CalendarClock,
  Clock3,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  Price,
} from "@/components/ui/Price";
import {
  formatDateTime,
} from "@/lib/date";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentSummaryGridProps {
  readonly assignment: ServicePartnerAssignment;
}

export function ServicePartnerAssignmentSummaryGrid({
  assignment,
}: ServicePartnerAssignmentSummaryGridProps): React.JSX.Element {
  const metrics = [
    {
      label: "Partner",
      value: assignment.partnerName,
      icon: Wrench,
    },
    {
      label: "Customer",
      value: assignment.customerId,
      icon: UserRound,
    },
    {
      label: "Response Due",
      value: formatDateTime(
        assignment.responseDueAt
      ),
      icon: Clock3,
    },
    {
      label: "Scheduled At",
      value: assignment.scheduledAt
        ? formatDateTime(
            assignment.scheduledAt
          )
        : "Not scheduled",
      icon: CalendarClock,
    },
  ] as const;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

            <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
              {metric.label}
            </p>

            <p className="mt-2 break-all text-sm font-medium text-foreground">
              {metric.value}
            </p>
          </article>
        );
      })}

      <article className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <BadgeIndianRupee
          aria-hidden={true}
          className="size-5 text-[var(--color-gold-600)]"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
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

      <article className="rounded-[var(--radius-lg)] border border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)] p-5 shadow-[var(--shadow-card)]">
        <ShieldCheck
          aria-hidden={true}
          className="size-5 text-[var(--color-success)]"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
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
    </section>
  );
}
