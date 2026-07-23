import {
  CheckCircle2,
  Clock3,
  FileCheck2,
} from "lucide-react";

import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentCompletionCardProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

export function ServicePartnerAssignmentCompletionCard({
  assignment,
  className,
}: ServicePartnerAssignmentCompletionCardProps): React.JSX.Element {
  const completed =
    assignment.status ===
    "completed";

  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border p-6 shadow-[var(--shadow-card)]",
        completed
          ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)]"
          : "border-border bg-card",
        className
      )}
    >
      <div className="flex items-start justify-between gap-5">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-full border",
            completed
              ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]"
              : "border-border bg-background text-muted"
          )}
        >
          {completed ? (
            <CheckCircle2
              aria-hidden="true"
              className="size-5"
            />
          ) : (
            <Clock3
              aria-hidden="true"
              className="size-5"
            />
          )}
        </span>

        {assignment.completedAt ? (
          <time className="text-xs text-muted">
            {formatDateTime(
              assignment.completedAt
            )}
          </time>
        ) : null}
      </div>

      <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
        {completed
          ? "Assignment Completed"
          : "Completion Pending"}
      </h2>

      {assignment.completionNote ? (
        <div className="mt-5 flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-card p-4">
          <FileCheck2
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-600)]"
          />

          <p className="whitespace-pre-wrap text-sm leading-7 text-muted">
            {
              assignment.completionNote
            }
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm leading-7 text-muted">
          The assigned service partner
          has not submitted a final
          completion report.
        </p>
      )}

      <dl className="mt-5 grid gap-3 border-t border-border pt-5 text-sm">
        {assignment.startedAt ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              Started
            </dt>

            <dd className="text-right font-medium text-foreground">
              {formatDateTime(
                assignment.startedAt
              )}
            </dd>
          </div>
        ) : null}

        {assignment.completedAt ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              Completed
            </dt>

            <dd className="text-right font-medium text-foreground">
              {formatDateTime(
                assignment.completedAt
              )}
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
