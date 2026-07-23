import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

import type { Order } from "@/types/order";

interface OrderStatusBadgeProps {
  readonly status: Order["status"];
  readonly className?: string;
}

const labels: Record<
  Order["status"],
  string
>={
  pending: "Pending",
  paymentPending: "Payment Pending",
  confirmed: "Confirmed",
  processing: "In Production",
  readyToShip: "Ready to Ship",
  shipped: "Shipped",
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
  className,
  status,
}: OrderStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "delivered"
     ? "success"
     : status === "cancelled" ||
         status === "refunded" ||
         status === "returned" ||
         status === "partiallyRefunded"
       ? "error"
       : status === "pending" ||
           status === "paymentPending" ||
           status === "returnRequested" ||
           status === "refundPending"
         ? "warning"
         : "gold";

 return (
  <Badge
    variant={variant}
    className={cn(
      "capitalize",
      className
    )}
  >
    {labels[status]}
  </Badge>

 );
}
