import {
  Badge,
} from "@/components/ui/Badge";
import type {
  CustomOrderStatus,
} from "@/types/custom-order";

interface CustomOrderStatusBadgeProps {
  readonly status: CustomOrderStatus;
}

const statusLabels: Record<
  CustomOrderStatus,
  string
>={
  submitted: "Submitted",
  underReview: "Under Review",
  awaitingQuote: "Awaiting Quote",
  quoted: "Quote Ready",
  quoteAccepted: "Quote Accepted",
  paymentPending: "Payment Pending",
  paid: "Paid",
  inProduction: "In Production",
  readyForDispatch: "Ready for Dispatch",
  shipped: "Shipped",
  delivered: "Delivered",
  declined: "Declined",
  cancelled: "Cancelled",
};

export function CustomOrderStatusBadge({
  status,
}: CustomOrderStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "delivered"
     ? "success"
     : status === "cancelled" ||
         status === "declined"
       ? "error"
       : status === "quoted" ||
           status === "quoteAccepted" ||
           status === "paid" ||
           status === "readyForDispatch" ||
           status === "shipped"
         ? "gold"
         : "warning";

 return (
   <Badge variant={variant}>
    {statusLabels[status]}
   </Badge>
 );
}
