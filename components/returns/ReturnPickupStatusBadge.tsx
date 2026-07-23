import {
  Ban,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Truck,
  TruckIcon,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  ReturnPickupStatus,
} from "@/types/return";

interface ReturnPickupStatusBadgeProps {
  readonly status: ReturnPickupStatus;
}

const statusLabels: Record<
  ReturnPickupStatus,
  string
> = {
  notRequired: "Not Required",
  pending: "Pending",
  scheduled: "Scheduled",
  attempted: "Attempted",
  pickedUp: "Picked Up",
  cancelled: "Cancelled",
  failed: "Failed",
};

export function ReturnPickupStatusBadge({
  status,
}: ReturnPickupStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "pickedUp"
      ? PackageCheck
      : status === "scheduled"
        ? Truck
        : status === "attempted"
          ? TruckIcon
          : status === "cancelled"
            ? Ban
            : status === "failed"
              ? XCircle
              : status === "notRequired"
                ? CheckCircle2
                : Clock3;

  const variant =
    status === "pickedUp" ||
    status === "notRequired"
      ? "success"
      : status === "scheduled"
        ? "gold"
        : status === "attempted"
          ? "warning"
          : status === "cancelled" ||
              status === "failed"
            ? "error"
            : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden={true}
        className="mr-1 size-3.5"
      />
      {statusLabels[status]}
    </Badge>
  );
}
