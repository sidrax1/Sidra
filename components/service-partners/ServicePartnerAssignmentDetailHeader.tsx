import {
  BadgeIndianRupee,
  CalendarClock,
  Clock3,
  ShieldAlert,
  Store,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  ServicePartnerAssignmentStatusBadge,
} from "@/components/service-partners/ServicePartnerAssignmentStatusBadge";
import {
  ServicePartnerCapabilityBadge,
} from "@/components/service-partners/ServicePartnerCapabilityBadge";
import {
  Badge,
} from "@/components/ui/Badge";
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

interface ServicePartnerAssignmentDetailHeaderProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

export function ServicePartnerAssignmentDetailHeader({
  assignment,
  className,
}: ServicePartnerAssignmentDetailHeaderProps): React.JSX.Element {
  const responseOverdue =
    ![
      "declined",
      "completed",
      "cancelled",
    ].includes(
      assignment.status
    ) &&
    new Date(
      assignment.responseDueAt
    ).getTime() < Date.now();

  const completionOverdue =
    Boolean(
      assignment.completionDueAt
    ) &&
    ![
      "completed",
      "cancelled",
    ].includes(
      assignment.status
    ) &&
    new Date(
      assignment.completionDueAt ??
        ""
    ).getTime() < Date.now();

  const urgent =
    assignment.priority ===
    "urgent";

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-hover)]",
        urgent ||
          responseOverdue ||
          completionOverdue
          ? "border-[color:rgb(145_59_59_/_0.44)]"
          : "border-[color:rgb(200_169_106_/_0.32)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-10 text-white md:px-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              urgent ||
              responseOverdue ||
              completionOverdue
                ? "radial-gradient(circle at 86% 8%, rgba(145,59,59,0.38), transparent 45%)"
                : "radial-gradient(circle at 86% 8%, rgba(200,169,106,0.35), transparent 45%)",
          }}
        />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <ServicePartnerAssignmentStatusBadge
                status={
                  assignment.status
                }
              />

              <ServicePartnerCapabilityBadge
                capability={
                  assignment.capability
                }
              />

              <Badge
                variant={
                  urgent
                    ? "error"
                    : assignment.priority ===
                        "high"
                      ? "warning"
                      : "neutral"
                }
              >
                {
                  assignment.priority
                }{" "}
                priority
              </Badge>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Service Assignment
            </p>

            <h1 className="mt-3 font-heading text-[clamp(2.8rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
              #
              {
                assignment.assignmentNumber
              }
            </h1>

            <h2 className="mt-6 max-w-4xl font-heading text-3xl font-medium tracking-[-0.035em]">
              {
                assignment.title
              }
            </h2>

            <p className="mt-4 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-white/65">
              {
                assignment.description
              }
            </p>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <Wrench
                  aria-hidden="true"
                  className="size-4"
                />
                {
                  assignment.partnerName
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <Store
                  aria-hidden="true"
                  className="size-4"
                />
                Studio{" "}
                {
                  assignment.studioId
                }
              </span>

              <span className="inline-flex items-center gap-2">
                <UserRound
                  aria-hidden="true"
                  className="size-4"
                />
                Customer{" "}
                {
                  assignment.customerId
                }
              </span>
            </div>
          </div>

          <section className="rounded-[var(--radius-xl)] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.14em] text-white/50">
              Approved Service Cost
            </p>

            <Price
              amount={
                assignment.approvedCostPaise /
                100
              }
              size="xl"
              className="mt-2 text-white"
            />

            <dl className="mt-6 grid gap-4 border-t border-white/10 pt-5">
              <div className="flex items-end justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.12em] text-white/50">
                  Partner Payable
                </dt>

                <dd>
                  <Price
                    amount={
                      assignment.platformPayablePaise /
                      100
                    }
                    size="sm"
                    className="text-white"
                  />
                </dd>
              </div>

              <div className="flex items-end justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.12em] text-white/50">
                  Customer Payable
                </dt>

                <dd>
                  <Price
                    amount={
                      assignment.customerPayablePaise /
                      100
                    }
                    size="sm"
                    className="text-white"
                  />
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <article
          className={cn(
            "rounded-[var(--radius-lg)] border bg-background p-5",
            responseOverdue
              ? "border-[color:rgb(145_59_59_/_0.35)]"
              : "border-border"
          )}
        >
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <Clock3
              aria-hidden="true"
              className="size-3.5"
            />
            Response Due
          </p>

          <p
            className={cn(
              "mt-3 text-sm font-medium",
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
            "rounded-[var(--radius-lg)] border bg-background p-5",
            completionOverdue
              ? "border-[color:rgb(145_59_59_/_0.35)]"
              : "border-border"
          )}
        >
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <CalendarClock
              aria-hidden="true"
              className="size-3.5"
            />
            Completion Due
          </p>

          <p
            className={cn(
              "mt-3 text-sm font-medium",
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

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <CalendarClock
              aria-hidden="true"
              className="size-3.5"
            />
            Service Schedule
          </p>

          <p className="mt-3 text-sm font-medium text-foreground">
            {assignment.scheduledAt
              ? formatDateTime(
                  assignment.scheduledAt
                )
              : "Not scheduled"}
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
            <BadgeIndianRupee
              aria-hidden="true"
              className="size-3.5"
            />
            Estimated Cost
          </p>

          <Price
            amount={
              assignment.estimatedCostPaise /
              100
            }
            size="lg"
            className="mt-3"
          />
        </article>
      </div>

      {(responseOverdue ||
        completionOverdue) ? (
        <footer className="flex items-start gap-3 border-t border-[color:rgb(145_59_59_/_0.25)] bg-[color:rgb(145_59_59_/_0.06)] px-6 py-4">
          <ShieldAlert
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-[var(--color-error)]"
          />

          <p className="text-sm leading-6 text-muted">
            {completionOverdue
              ? "This assignment has passed its completion deadline and requires immediate operational action."
              : "This assignment has passed its response deadline and may require reassignment or escalation."}
          </p>
        </footer>
      ) : null}
    </header>
  );
}
