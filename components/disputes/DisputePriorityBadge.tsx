import {
  AlertTriangle,
  Circle,
  CircleAlert,
  Siren,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  Dispute,
} from "@/types/dispute";

interface DisputePriorityBadgeProps {
  readonly priority: Dispute["priority"];
}

const labels: Record<
  Dispute["priority"],
  string
> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export function DisputePriorityBadge({
  priority,
}: DisputePriorityBadgeProps): React.JSX.Element {
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
      {labels[priority]}
    </Badge>
  );
}
