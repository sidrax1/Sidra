import {
  AlertTriangle,
  Circle,
  CircleAlert,
  Siren,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentPriorityBadgeProps {
  readonly priority: ServicePartnerAssignment["priority"];
}

const priorityLabels: Record<
  ServicePartnerAssignment["priority"],
  string
> = {
  low: "Low Priority",
  normal: "Normal Priority",
  high: "High Priority",
  urgent: "Urgent Priority",
};

export function ServicePartnerAssignmentPriorityBadge({
  priority,
}: ServicePartnerAssignmentPriorityBadgeProps): React.JSX.Element {
  const Icon =
    priority === "urgent"
      ? Siren
      : priority === "high"
        ? CircleAlert
        : priority === "normal"
          ? AlertTriangle
          : Circle;

  const variant =
    priority === "urgent"
      ? "error"
      : priority === "high"
        ? "warning"
        : priority === "normal"
          ? "gold"
          : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      {priorityLabels[priority]}
    </Badge>
  );
}
