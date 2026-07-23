import {
  Archive,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileEdit,
  PauseCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { PromotionStatus } from "@/types/promotion";

interface PromotionStatusBadgeProps {
  readonly status: PromotionStatus;
}

const labels: Record<PromotionStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  active: "Active",
  paused: "Paused",
  expired: "Expired",
  archived: "Archived",
};

export function PromotionStatusBadge({
  status,
}: PromotionStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "active"
      ? CheckCircle2
      : status === "scheduled"
        ? CalendarClock
        : status === "paused"
          ? PauseCircle
          : status === "draft"
            ? FileEdit
            : status === "archived"
              ? Archive
              : Clock3;

  const variant =
    status === "active"
      ? "success"
      : status === "scheduled"
        ? "gold"
        : status === "paused" || status === "draft"
          ? "warning"
          : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      {labels[status]}
    </Badge>
  );
}
