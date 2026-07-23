import {
  BadgeAlert,
  BadgeHelp,
  BanknoteX,
  Boxes,
  CircleOff,
  CopyX,
  PackageX,
  RefreshCcw,
  ShieldAlert,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type {
  DisputeReason,
} from "@/types/dispute";

interface DisputeReasonBadgeProps {
  readonly reason: DisputeReason;
}

const labels: Record<
  DisputeReason,
  string
> = {
  orderNotReceived: "Order Not Received",
  itemDamaged: "Item Damaged",
  itemNotAsDescribed: "Not as Described",
  wrongItem: "Wrong Item",
  unauthorizedPayment:
    "Unauthorized Payment",
  duplicatePayment: "Duplicate Payment",
  refundNotReceived:
    "Refund Not Received",
  sellerNonResponsive:
    "Studio Non-responsive",
  serviceNotDelivered:
    "Service Not Delivered",
  other: "Other",
};

export function DisputeReasonBadge({
  reason,
}: DisputeReasonBadgeProps): React.JSX.Element {
  const Icon =
    reason === "orderNotReceived"
      ? Truck
      : reason === "itemDamaged"
        ? PackageX
        : reason === "itemNotAsDescribed"
          ? BadgeAlert
          : reason === "wrongItem"
            ? Boxes
            : reason === "unauthorizedPayment"
              ? ShieldAlert
              : reason === "duplicatePayment"
                ? CopyX
                : reason === "refundNotReceived"
                  ? RefreshCcw
                  : reason === "sellerNonResponsive"
                    ? CircleOff
                    : reason === "serviceNotDelivered"
                      ? BanknoteX
                      : BadgeHelp;

  const variant =
    reason === "unauthorizedPayment" ||
    reason === "duplicatePayment"
      ? "error"
      : reason === "orderNotReceived" ||
          reason === "itemDamaged" ||
          reason === "refundNotReceived"
        ? "warning"
        : "neutral";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      {labels[reason]}
    </Badge>
  );
}
