import {
  Ban,
  CheckCircle2,
  Clock3,
  Gift,
  Hourglass,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { GiftCardStatus } from "@/types/gift-card";

interface GiftCardStatusBadgeProps {
  readonly status: GiftCardStatus;
}

const labels: Record<GiftCardStatus, string> = {
  pending: "Pending",
  active: "Active",
  partiallyUsed: "Partially Used",
  redeemed: "Redeemed",
  expired: "Expired",
  cancelled: "Cancelled",
  disabled: "Disabled",
};

export function GiftCardStatusBadge({
  status,
}: GiftCardStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "active"
      ? Gift
      : status === "partiallyUsed"
        ? WalletCards
        : status === "redeemed"
          ? CheckCircle2
          : status === "expired"
            ? Hourglass
            : status === "cancelled" ||
                status === "disabled"
              ? Ban
              : Clock3;

  const variant =
    status === "active"
      ? "success"
      : status === "partiallyUsed"
        ? "gold"
        : status === "redeemed"
          ? "neutral"
          : status === "cancelled" ||
              status === "disabled"
            ? "error"
            : "warning";

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
