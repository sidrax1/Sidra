import {
  BadgeIndianRupee,
  CheckCircle2,
  Clock3,
  RefreshCcw,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { OrderPaymentStatus } from "@/types/order";

interface OrderPaymentStatusBadgeProps {
  readonly status: OrderPaymentStatus;
}

const labels: Record<OrderPaymentStatus, string> = {
  pending: "Payment Pending",
  authorized: "Authorized",
  paid: "Paid",
  failed: "Payment Failed",
  partiallyRefunded: "Partially Refunded",
  refunded: "Refunded",
};

export function OrderPaymentStatusBadge({
  status,
}: OrderPaymentStatusBadgeProps): React.JSX.Element {
  const Icon =
    status === "paid"
      ? CheckCircle2
      : status === "failed"
        ? XCircle
        : status === "refunded" ||
            status === "partiallyRefunded"
          ? RefreshCcw
          : status === "authorized"
            ? BadgeIndianRupee
            : Clock3;

  const variant =
    status === "paid"
      ? "success"
      : status === "failed"
        ? "error"
        : status === "authorized"
          ? "gold"
          : status === "refunded" ||
              status === "partiallyRefunded"
            ? "neutral"
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
