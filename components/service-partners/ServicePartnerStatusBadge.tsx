import {
  Archive,
  Ban,
  CheckCircle2,
  Clock3,
  PauseCircle,
  ShieldAlert,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerStatus,
} from "@/types/service-partner";

interface ServicePartnerStatusBadgeProps {
  readonly status: ServicePartnerStatus;
}

const labels: Record<
  ServicePartnerStatus,
  string
> = {
  pendingVerification:
    "Pending Verification",
  active: "Active",
  temporarilyUnavailable:
    "Temporarily Unavailable",
  suspended: "Suspended",
  rejected: "Rejected",
  archived: "Archived",
};

export function ServicePartnerStatusBadge({
  status,
}: ServicePartnerStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "active"
      ? CheckCircle2
      : status ===
          "pendingVerification"
        ? Clock3
        : status ===
            "temporarilyUnavailable"
          ? PauseCircle
          : status ===
              "suspended"
            ? ShieldAlert
            : status ===
                "rejected"
              ? Ban
              : Archive;

  const variant =
    status === "active"
      ? "success"
      : status ===
          "pendingVerification"
        ? "gold"
        : status ===
            "temporarilyUnavailable"
          ? "warning"
          : status ===
                "suspended" ||
              status ===
                "rejected"
            ? "error"
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
