import {
  CheckCircle2,
  Clock3,
  PackageCheck,
  RefreshCcw,
  RotateCcw,
  Truck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { OrderStatus } from "@/types/order";

interface OrderStatusBadgeProps {
  readonly status: OrderStatus;
}

const labels: Record<OrderStatus, string> = {
  pending: "Pending",
  paymentPending: "Payment Pending",
  confirmed: "Confirmed",
  processing: "In Preparation",
  readyToShip: "Ready to Ship",
  shipped: "Dispatched",
  outForDelivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returnRequested: "Return Requested",
  returnApproved: "Return Approved",
  returned: "Returned",
  refundPending: "Refund Pending",
  refunded: "Refunded",
  partiallyRefunded: "Partially Refunded",
};

export function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "delivered"
      ? CheckCircle2
      : status === "shipped" || status === "outForDelivery"
        ? Truck
        : status === "cancelled"
          ? XCircle
          : status === "returnRequested" ||
              status === "returnApproved" ||
              status === "returned"
            ? RotateCcw
            : status === "refundPending" ||
                status === "refunded" ||
                status === "partiallyRefunded"
              ? RefreshCcw
              : status === "confirmed" ||
                  status === "processing" ||
                  status === "readyToShip"
                ? PackageCheck
                : Clock3;

  const variant =
    status === "delivered"
      ? "success"
      : status === "cancelled"
        ? "error"
        : status === "shipped" ||
            status === "outForDelivery" ||
            status === "confirmed" ||
            status === "readyToShip"
          ? "gold"
          : status === "refunded" ||
              status === "partiallyRefunded"
            ? "neutral"
            : "warning";

  return (
    <Badge variant={variant}>
      <Icon
        aria-hidden={true}
        className="mr-1 size-3.5"
      />
      {labels[status]}
    </Badge>
  );
}
