import { Badge } from "@/components/ui/Badge";
import type { PayoutStatus } from "@/types/payout";

interface PayoutStatusBadgeProps {
  readonly status: PayoutStatus;
}

const labels: Record<PayoutStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
  held: "On Hold",
};

export function PayoutStatusBadge({
  status,
}: PayoutStatusBadgeProps): React.JSX.Element {
  const variant =
   status === "paid"
     ? "success"
     : status === "failed"
       ? "error"
       : status === "held" || status === "pending"
         ? "warning"
         : "gold";

 return (
   <Badge variant={variant}>
    {labels[status]}
   </Badge>
 );
}
