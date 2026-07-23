"use client";

import {
  Ban,
  CalendarClock,
  CheckCircle2,
  CirclePlay,
  Eye,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentActionsProps {
  readonly assignment: ServicePartnerAssignment;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onAccept?: (
    assignment: ServicePartnerAssignment
  ) => void | Promise<void>;
  readonly onDecline?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onSchedule?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onStart?: (
    assignment: ServicePartnerAssignment
  ) => void | Promise<void>;
  readonly onComplete?: (
    assignment: ServicePartnerAssignment
  ) => void;
  readonly onCancel?: (
    assignment: ServicePartnerAssignment
  ) => void;
}

export function ServicePartnerAssignmentActions({
  assignment,
  className,
  loading = false,
  onAccept,
  onCancel,
  onComplete,
  onDecline,
  onOpen,
  onSchedule,
  onStart,
}: ServicePartnerAssignmentActionsProps): React.JSX.Element {
  const canAccept =
    assignment.status ===
    "assigned";

  const canSchedule =
    assignment.status ===
      "accepted" ||
    assignment.status ===
      "scheduled";

  const canStart =
    assignment.status ===
      "accepted" ||
    assignment.status ===
      "scheduled";

  const canComplete =
    assignment.status ===
    "inProgress";

  const canCancel =
    ![
      "completed",
      "declined",
      "cancelled",
    ].includes(
      assignment.status
    );

  return (
    <section
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-card p-5 shadow-[var(--shadow-card)]",
        className
      )}
    >
      {onOpen ? (
        <Button
          variant="outline"
          disabled={loading}
          onClick={() =>
            onOpen(assignment)
          }
        >
          <Eye
            aria-hidden={true}
            className="size-4"
          />
          View Details
        </Button>
      ) : null}

      {canAccept &&
      onAccept ? (
        <Button
          disabled={loading}
          onClick={() => {
            void onAccept(
              assignment
            );
          }}
        >
          <UserRoundCheck
            aria-hidden={true}
            className="size-4"
          />
          Accept Assignment
        </Button>
      ) : null}

      {canAccept &&
      onDecline ? (
        <Button
          variant="danger"
          disabled={loading}
          onClick={() =>
            onDecline(
              assignment
            )
          }
        >
          <XCircle
            aria-hidden={true}
            className="size-4"
          />
          Decline
        </Button>
      ) : null}

      {canSchedule &&
      onSchedule ? (
        <Button
          variant="outline"
          disabled={loading}
          onClick={() =>
            onSchedule(
              assignment
            )
          }
        >
          <CalendarClock
            aria-hidden={true}
            className="size-4"
          />
          Schedule
        </Button>
      ) : null}

      {canStart &&
      onStart ? (
        <Button
          disabled={loading}
          onClick={() => {
            void onStart(
              assignment
            );
          }}
        >
          <CirclePlay
            aria-hidden={true}
            className="size-4"
          />
          Start Service
        </Button>
      ) : null}

      {canComplete &&
      onComplete ? (
        <Button
          disabled={loading}
          onClick={() =>
            onComplete(
              assignment
            )
          }
        >
          <CheckCircle2
            aria-hidden={true}
            className="size-4"
          />
          Complete
        </Button>
      ) : null}

      {canCancel &&
      onCancel ? (
        <Button
          variant="ghost"
          disabled={loading}
          className="text-[var(--color-error)]"
          onClick={() =>
            onCancel(
              assignment
            )
          }
        >
          <Ban
            aria-hidden={true}
            className="size-4"
          />
          Cancel
        </Button>
      ) : null}
    </section>
  );
}
