import { Badge } from "@/components/ui/Badge";
import type { Order } from "@/types/order";

interface SellerOrderStatusBadgeProps {
  readonly status: Order["status"];
}

const labels: Record<Order["status"], string> = {
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

export function SellerOrderStatusBadge({
  status,
}: SellerOrderStatusBadgeProps): React.JSX.Element {
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
   <Badge variant={variant}>
    {labels[status]}
   </Badge>
 );
}
