import {
  BadgeIndianRupee,
  CalendarClock,
  Clock3,
  Gauge,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";

import {
  Price,
} from "@/components/ui/Price";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentMetricsProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

export function ServicePartnerAssignmentMetrics({
  assignment,
  className,
}: ServicePartnerAssignmentMetricsProps): React.JSX.Element {
  const responseDue =
    new Date(
      assignment.responseDueAt
    ).getTime();

  const completionDue =
    assignment.completionDueAt
      ? new Date(
          assignment.completionDueAt
        ).getTime()
      : null;

  const responseOverdue =
    Date.now() > responseDue &&
    ![
      "declined",
      "cancelled",
      "completed",
    ].includes(
      assignment.status
    );

  const completionOverdue =
    completionDue !== null &&
    Date.now() >
      completionDue &&
    ![
      "cancelled",
      "completed",
    ].includes(
      assignment.status
    );

  const partnerMarginPaise =
    Math.max(
      assignment.platformPayablePaise,
      0
    );

  const customerCoveragePaise =
    Math.max(
      assignment.approvedCostPaise -
        assignment.customerPayablePaise,
      0
    );

  return (
    <section
      aria-label="Assignment metrics"
      className={cn(
        "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      <article
        className={cn(
          "rounded-[var(--radius-lg)] border bg-card p-5 shadow-[var(--shadow-card)]",
          responseOverdue
            ? "border-[color:rgb(145_59_59_/_0.36)]"
            : "border-border"
        )}
      >
        <Clock3
          aria-hidden={true}
          className={cn(
            "size-5",
            responseOverdue
              ? "text-[var(--color-error)]"
              : "text-[var(--color-gold-600)]"
          )}
        />

        <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
          Response Deadline
        </p>

        <p
          className={cn(
            "mt-2 text-sm font-medium",
            responseOverdue
              ? "text-[var(--color-error)]"
              : "text-foreground"
          )}
        >
          {formatDateTime(
            assignment.responseDueAt
          )}
        </p>
      </article>

      <article
        className={cn(
          "rounded-[var(--radius-lg)] border bg-card p-5 shadow-[var(--shadow-card)]",
          completionOverdue
            ? "border-[color:rgb(145_59_59_/_0.36)]"
            : "border-border"
        )}
      >
        <CalendarClock
          aria-hidden={true}
          className={cn(
            "size-5",
            completionOverdue
              ? "text-[var(--color-error)]"
              : "text-[var(--color-gold-600)]"
          )}
        />

        <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
          Completion Deadline
        </p>

        <p
          className={cn(
            "mt-2 text-sm font-medium",
            completionOverdue
              ? "text-[var(--color-error)]"
              : "text-foreground"
          )}
        >
          {assignment.completionDueAt
            ? formatDateTime(
                assignment.completionDueAt
              )
            : "Not scheduled"}
        </p>
      </article>

      <article className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <Gauge
          aria-hidden={true}
          className="size-5 text-[var(--color-gold-600)]"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
          Assignment Status
        </p>

        <p className="mt-2 text-sm font-medium capitalize text-foreground">
          {assignment.status.replace(
            /([A-Z])/g,
            " $1"
          )}
        </p>
      </article>

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

      <article className="rounded-[var(--radius-lg)] border border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.05)] p-5 shadow-[var(--shadow-card)]">
        <UserRoundCheck
          aria-hidden={true}
          className="size-5 text-[var(--color-success)]"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
          Partner Payable
        </p>

        <Price
          amount={
            partnerMarginPaise /
            100
          }
          size="lg"
          className="mt-2"
        />
      </article>

      <article className="rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.05)] p-5 shadow-[var(--shadow-card)]">
        <ShieldCheck
          aria-hidden={true}
          className="size-5 text-[var(--color-gold-600)]"
        />

        <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
          Protected Coverage
        </p>

        <Price
          amount={
            customerCoveragePaise /
            100
          }
          size="lg"
          className="mt-2"
        />
      </article>
    </section>
  );
}
