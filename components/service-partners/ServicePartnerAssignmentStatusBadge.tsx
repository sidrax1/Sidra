import {
  Ban,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock3,
  PlayCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentStatusBadgeProps {
  readonly status: ServicePartnerAssignment["status"];
}

const assignmentStatusLabels: Record<
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

export function ServicePartnerAssignmentStatusBadge({
  status,
}: ServicePartnerAssignmentStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "assigned"
      ? Clock3
      : status === "accepted"
        ? ShieldCheck
        : status === "declined"
          ? XCircle
          : status === "scheduled"
            ? CalendarClock
            : status ===
                "inProgress"
              ? CircleDashed
              : status ===
                  "completed"
                ? CheckCircle2
                : Ban;

  const variant =
    status === "completed"
      ? "success"
      : status ===
          "accepted"
        ? "gold"
        : status ===
            "scheduled" ||
          status ===
            "inProgress"
          ? "warning"
          : status ===
                "declined" ||
              status ===
                "cancelled"
            ? "error"
            : "neutral";

  return (
    <Badge variant={variant}>
      {status ===
      "inProgress" ? (
        <PlayCircle
          aria-hidden="true"
          className="mr-1 size-3.5 animate-pulse"
        />
      ) : (
        <Icon
          aria-hidden="true"
          className="mr-1 size-3.5"
        />
      )}

      {
        assignmentStatusLabels[
          status
        ]
      }
    </Badge>
  );
}
