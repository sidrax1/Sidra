import {
  Ban,
  CheckCircle2,
  Clock3,
  Gift,
  History,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  LoyaltyRedemptionStatus,
} from "@/types/loyalty";

interface LoyaltyRedemptionStatusBadgeProps {
  readonly status: LoyaltyRedemptionStatus;
}

const statusLabels: Record<
  LoyaltyRedemptionStatus,
  string
> = {
  pending: "Pending",
  issued: "Issued",
  applied: "Applied",
  used: "Used",
  expired: "Expired",
  cancelled: "Cancelled",
  reversed: "Reversed",
};

export function LoyaltyRedemptionStatusBadge({
  status,
}: LoyaltyRedemptionStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "used"
      ? CheckCircle2
      : status === "issued"
        ? Gift
        : status === "applied"
          ? ShieldCheck
          : status === "expired"
            ? History
            : status === "cancelled"
              ? XCircle
              : status === "reversed"
                ? Ban
                : Clock3;

  const variant =
    status === "used"
      ? "success"
      : status === "issued" ||
          status === "applied"
        ? "gold"
        : status === "cancelled" ||
            status === "reversed"
          ? "error"
          : status === "expired"
            ? "neutral"
            : "warning";

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
