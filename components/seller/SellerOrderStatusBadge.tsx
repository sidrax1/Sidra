import { Badge } from "@/components/ui/Badge";
import type { Order } from "@/types/order";

interface SellerOrderStatusBadgeProps {
  readonly status: Order["status"];
}

const labels: Record<Order["status"], string> = {
 pending: "Pending",
 confirmed: "Confirmed",
 processing: "In Production",
 shipped: "Shipped",
 delivered: "Delivered",
 cancelled: "Cancelled",

  refunded: "Refunded",
};

export function SellerOrderStatusBadge({
  status,
}: SellerOrderStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "delivered"
     ? "success"
     : status === "cancelled" || status === "refunded"
       ? "error"
       : status === "pending"
         ? "warning"
         : "gold";

 return (
   <Badge variant={variant}>
    {labels[status]}
   </Badge>
 );
}
