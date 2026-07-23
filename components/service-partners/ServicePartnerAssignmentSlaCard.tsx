import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  ShieldAlert,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentSlaCardProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

function getRemainingLabel(
  target: string
): string {
  const remaining =
    new Date(target).getTime() -
    Date.now();

  const absoluteMinutes =
    Math.floor(
      Math.abs(remaining) /
        60_000
    );

  const days = Math.floor(
    absoluteMinutes / 1440
  );

  const hours = Math.floor(
    (absoluteMinutes % 1440) /
      60
  );

  const minutes =
    absoluteMinutes % 60;

  const label = [
    days > 0
      ? `${days}d`
      : null,
    hours > 0
      ? `${hours}h`
      : null,
    `${minutes}m`,
  ]
    .filter(Boolean)
    .join(" ");

  return remaining >= 0
    ? `${label} remaining`
    : `${label} overdue`;
}

export function ServicePartnerAssignmentSlaCard({
  assignment,
  className,
}: ServicePartnerAssignmentSlaCardProps): React.JSX.Element {
  const completed =
    assignment.status ===
    "completed";

  const responseOverdue =
    ![
      "declined",
      "cancelled",
      "completed",
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
      "cancelled",
      "completed",
    ].includes(
      assignment.status
    ) &&
    new Date(
      assignment.completionDueAt ??
        ""
    ).getTime() < Date.now();

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-card)]",
        responseOverdue ||
          completionOverdue
          ? "border-[color:rgb(145_59_59_/_0.4)]"
          : "border-border",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <Clock3
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            SLA Monitoring
          </h2>
        </div>

        <Badge
          variant={
            completed
              ? "success"
              : responseOverdue ||
                  completionOverdue
                ? "error"
                : "gold"
          }
        >
          {completed
            ? "Completed"
            : responseOverdue ||
                completionOverdue
              ? "SLA Breached"
              : "Within SLA"}
        </Badge>
      </header>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <article
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            responseOverdue
              ? "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)]"
              : "border-border bg-background"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <CalendarClock
              aria-hidden="true"
              className={cn(
                "size-5",
                responseOverdue
                  ? "text-[var(--color-error)]"
                  : "text-[var(--color-gold-600)]"
              )}
            />

            {responseOverdue ? (
              <ShieldAlert
                aria-hidden="true"
                className="size-4 text-[var(--color-error)]"
              />
            ) : (
              <CheckCircle2
                aria-hidden="true"
                className="size-4 text-[var(--color-success)]"
              />
            )}
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.13em] text-muted">
            Response Deadline
          </p>

          <p className="mt-2 text-sm font-medium text-foreground">
            {formatDateTime(
              assignment.responseDueAt
            )}
          </p>

          <p
            className={cn(
              "mt-2 text-xs",
              responseOverdue
                ? "text-[var(--color-error)]"
                : "text-muted"
            )}
          >
            {getRemainingLabel(
              assignment.responseDueAt
            )}
          </p>
        </article>

        <article
          className={cn(
            "rounded-[var(--radius-lg)] border p-5",
            completionOverdue
              ? "border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)]"
              : "border-border bg-background"
          )}
        >
          <Clock3
            aria-hidden="true"
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

          {assignment.completionDueAt ? (
            <>
              <p className="mt-2 text-sm font-medium text-foreground">
                {formatDateTime(
                  assignment.completionDueAt
                )}
              </p>

              <p
                className={cn(
                  "mt-2 text-xs",
                  completionOverdue
                    ? "text-[var(--color-error)]"
                    : "text-muted"
                )}
              >
                {getRemainingLabel(
                  assignment.completionDueAt
                )}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">
              No completion deadline
              configured.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
