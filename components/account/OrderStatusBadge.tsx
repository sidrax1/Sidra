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
  confirmed: "Confirmed",
  processing: "In Production",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrderStatusBadge({
  className,
  status,
}: OrderStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "delivered"
     ? "success"
     : status === "cancelled" ||
         status === "refunded"
       ? "error"
       : status === "pending"
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
