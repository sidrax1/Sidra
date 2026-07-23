import {
  CalendarCheck2,
  CheckCircle2,
  Circle,
  CirclePlay,
  Clock3,
  UserRoundCheck,
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

interface ServicePartnerAssignmentTimelineProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

interface AssignmentTimelineEntry {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly timestamp?: string;
  readonly complete: boolean;
  readonly current: boolean;
  readonly icon:
    typeof Clock3;
}

export function ServicePartnerAssignmentTimeline({
  assignment,
  className,
}: ServicePartnerAssignmentTimelineProps): React.JSX.Element {
  const entries: readonly AssignmentTimelineEntry[] =
    [
      {
        id: "created",
        title:
          "Assignment Created",
        description:
          "The service assignment was created and allocated to the partner.",
        timestamp:
          assignment.createdAt,
        complete: true,
        current:
          assignment.status ===
          "assigned",
        icon: Clock3,
      },
      {
        id: "accepted",
        title:
          "Assignment Accepted",
        description:
          "The service partner accepted responsibility for the assignment.",
        timestamp:
          assignment.acceptedAt,
        complete:
          Boolean(
            assignment.acceptedAt
          ) ||
          [
            "accepted",
            "scheduled",
            "inProgress",
            "completed",
          ].includes(
            assignment.status
          ),
        current:
          assignment.status ===
          "accepted",
        icon: UserRoundCheck,
      },
      {
        id: "scheduled",
        title:
          "Service Scheduled",
        description:
          "A service date and operational schedule were confirmed.",
        timestamp:
          assignment.scheduledAt,
        complete:
          Boolean(
            assignment.scheduledAt
          ) ||
          [
            "scheduled",
            "inProgress",
            "completed",
          ].includes(
            assignment.status
          ),
        current:
          assignment.status ===
          "scheduled",
        icon: CalendarCheck2,
      },
      {
        id: "started",
        title:
          "Service Started",
        description:
          "The assigned repair, inspection or logistics activity began.",
        timestamp:
          assignment.startedAt,
        complete:
          Boolean(
            assignment.startedAt
          ) ||
          [
            "inProgress",
            "completed",
          ].includes(
            assignment.status
          ),
        current:
          assignment.status ===
          "inProgress",
        icon: CirclePlay,
      },
      {
        id: "completed",
        title:
          "Assignment Completed",
        description:
          "The service partner completed the assignment and submitted a final report.",
        timestamp:
          assignment.completedAt,
        complete:
          assignment.status ===
            "completed" ||
          Boolean(
            assignment.completedAt
          ),
        current:
          assignment.status ===
          "completed",
        icon: CheckCircle2,
      },
    ];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Operational History
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Assignment Timeline
        </h2>
      </header>

      <ol className="p-6">
        {entries.map(
          (
            entry,
            index
          ) => {
            const Icon =
              entry.icon;

            const finalEntry =
              index ===
              entries.length - 1;

            return (
              <li
                key={entry.id}
                className="relative flex gap-4"
              >
                {!finalEntry ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-5 top-10 h-[calc(100%-1rem)] w-px",
                      entry.complete
                        ? "bg-[var(--color-gold-500)]"
                        : "bg-border"
                    )}
                  />
                ) : null}

                <span
                  className={cn(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border",
                    entry.current
                      ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.1)] text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]"
                      : entry.complete
                        ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.07)] text-[var(--color-success)]"
                        : "border-border bg-background text-muted"
                  )}
                >
                  {entry.complete ? (
                    <Icon
                      aria-hidden="true"
                      className="size-4"
                    />
                  ) : (
                    <Circle
                      aria-hidden="true"
                      className="size-4"
                    />
                  )}
                </span>

                <div className="min-w-0 flex-1 pb-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium text-foreground">
                      {entry.title}
                    </h3>

                    {entry.timestamp ? (
                      <time className="text-xs text-muted">
                        {formatDateTime(
                          entry.timestamp
                        )}
                      </time>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {
                      entry.description
                    }
                  </p>
                </div>
              </li>
            );
          }
        )}
      </ol>
    </section>
  );
}
