import {
  CheckCircle2,
  Clock3,
  FileSearch,
  Gavel,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  ReviewReportStatus,
  ReviewReportTimelineEvent,
} from "@/types/review-report";

interface ReviewReportTimelineProps {
  readonly events: readonly ReviewReportTimelineEvent[];
  readonly className?: string;
}

const icons: Record<
  ReviewReportStatus,
  React.ComponentType<{
    readonly className?: string;
    readonly "aria-hidden"?: boolean;
  }>
> = {
  submitted: Clock3,
  underReview: FileSearch,
  actionRequired: Gavel,
  resolved: CheckCircle2,
  dismissed: XCircle,
  escalated: ShieldAlert,
};

export function ReviewReportTimeline({
  className,
  events,
}: ReviewReportTimelineProps): React.JSX.Element {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No report activity"
        description="Assignment, moderation and resolution events will appear here."
      />
    );
  }

  const orderedEvents = [...events].sort(
    (first, second) =>
      first.createdAt.localeCompare(
        second.createdAt
      )
  );

  return (
    <section
      aria-label="Review report timeline"
      className={cn(
        "relative grid gap-4",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-[1.35rem] top-6 hidden w-px bg-border sm:block"
      />

      {orderedEvents.map((event, index) => {
        const Icon = icons[event.status];
        const latest =
          index === orderedEvents.length - 1;

        return (
          <article
            key={event.id}
            className={cn(
              "relative rounded-[var(--radius-lg)] border bg-card p-5 sm:ml-14",
              latest
                ? "border-[color:rgb(200_169_106_/_0.42)] shadow-[var(--shadow-gold-glow)]"
                : "border-border shadow-[var(--shadow-card)]"
            )}
          >
            <span
              className={cn(
                "absolute -left-[3.55rem] top-5 hidden size-11 items-center justify-center rounded-full border sm:flex",
                latest
                  ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
                  : "border-border bg-card text-muted"
              )}
            >
              <Icon
                aria-hidden="true"
                className="size-5"
              />
            </span>

            <div className="flex items-start gap-4 sm:hidden">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border",
                  latest
                    ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
                    : "border-border bg-background text-muted"
                )}
              >
                <Icon
                  aria-hidden="true"
                  className="size-4"
                />
              </span>

              <h3 className="font-medium text-foreground">
                {event.title}
              </h3>
            </div>

            <h3 className="hidden font-medium text-foreground sm:block">
              {event.title}
            </h3>

            {event.description ? (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                {event.description}
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
              <time>
                {formatDateTime(event.createdAt)}
              </time>

              <span>
                Actor role: {event.actorRole}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
