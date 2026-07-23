import {
  CheckCircle2,
  Circle,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentProgressProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

const orderedStatuses: readonly ServicePartnerAssignment["status"][] =
  [
    "assigned",
    "accepted",
    "scheduled",
    "inProgress",
    "completed",
  ];

const statusLabels: Record<
  ServicePartnerAssignment["status"],
  string
> = {
  assigned: "Assigned",
  accepted: "Accepted",
  declined: "Declined",
  scheduled: "Scheduled",
  inProgress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function ServicePartnerAssignmentProgress({
  assignment,
  className,
}: ServicePartnerAssignmentProgressProps): React.JSX.Element {
  const terminalFailure =
    assignment.status ===
      "declined" ||
    assignment.status ===
      "cancelled";

  const currentIndex =
    orderedStatuses.indexOf(
      assignment.status
    );

  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border border-border bg-card p-6 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <h2 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
        Assignment Progress
      </h2>

      {terminalFailure ? (
        <div className="mt-5 rounded-[var(--radius-lg)] border border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)] p-5">
          <p className="text-sm font-medium text-[var(--color-error)]">
            {
              statusLabels[
                assignment.status
              ]
            }
          </p>

          <p className="mt-2 text-sm leading-6 text-muted">
            This assignment exited the
            normal service lifecycle.
          </p>
        </div>
      ) : (
        <ol className="mt-7 grid gap-4 md:grid-cols-5">
          {orderedStatuses.map(
            (
              status,
              index
            ) => {
              const completed =
                index <=
                currentIndex;

              const current =
                index ===
                currentIndex;

              return (
                <li
                  key={status}
                  className="relative"
                >
                  <div
                    className={cn(
                      "flex min-h-28 flex-col items-center justify-center rounded-[var(--radius-lg)] border p-4 text-center",
                      current
                        ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.08)] shadow-[var(--shadow-gold-glow)]"
                        : completed
                          ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.06)]"
                          : "border-border bg-background"
                    )}
                  >
                    {completed ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className={cn(
                          "size-5",
                          current
                            ? "text-[var(--color-gold-600)]"
                            : "text-[var(--color-success)]"
                        )}
                      />
                    ) : (
                      <Circle
                        aria-hidden="true"
                        className="size-5 text-muted"
                      />
                    )}

                    <p className="mt-3 text-sm font-medium text-foreground">
                      {
                        statusLabels[
                          status
                        ]
                      }
                    </p>
                  </div>
                </li>
              );
            }
          )}
        </ol>
      )}
    </section>
  );
}
