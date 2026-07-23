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
  reviewing: "Under Review",
  quoted: "Quote Ready",
  accepted: "Accepted",
  inProduction: "In Production",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export function CustomOrderStatusBadge({
  status,
}: CustomOrderStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "completed"
     ? "success"
     : status === "cancelled" ||
         status === "rejected"
       ? "error"
       : status === "quoted" ||
           status === "accepted"
         ? "gold"
         : "warning";

 return (
   <Badge variant={variant}>
    {statusLabels[status]}
   </Badge>
 );
}
